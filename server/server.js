require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

let db;

const url = process.env.DB_URL;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('DB connected');
    db = client.db('Login');
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('DB connection error:', err));

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, async (req, email, password, done) => {
  try {
    const { name, companyEmail } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('Member').insertOne({ name, email, companyEmail, password: hashedPassword });
    return done(null, { email });
  } catch (err) {
    return done(err);
  }
}));

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, async (req, email, password, done) => {
  try {
    const user = await db.collection('Member').findOne({ email });
    if (!user) return done(null, false, { message: 'Incorrect email.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.email));
passport.deserializeUser(async (email, done) => {
  try {
    const user = await db.collection('Member').findOne({ email });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.post('/register', passport.authenticate('local-signup'), (req, res) => res.status(201).send('User registered'));
app.post('/login', passport.authenticate('local-login'), (req, res) => res.send('Logged in'));

app.get('/ssh-test', (req, res) => {
  const conn = new Client();
  const sudoPassword = process.env.LINUX_PASSWORD;

  conn.on('ready', () => {
    const scripts = ['/home/kang/다운로드/vun.sh'];
    executeScripts(conn, sudoPassword, scripts, 0, err => {
      if (err) {
        res.status(500).send(`Error executing scripts: ${err}`);
      } else {
        res.send('All scripts executed successfully');
      }
      conn.end();
    });
  }).connect({
    host: process.env.VM_HOST,
    port: 22,
    username: process.env.VM_USERNAME,
    privateKey: fs.readFileSync(process.env.VM_PRIVATE_KEY_PATH),
  });

  conn.on('error', err => res.status(500).send(`SSH connection error: ${err}`));
  conn.on('end', () => console.log('SSH connection ended'));
  conn.on('close', hadError => hadError ? console.error('SSH connection closed due to an error') : console.log('SSH connection closed'));
});

function executeScripts(conn, sudoPassword, scripts, index, callback) {
  if (index >= scripts.length) return callback(null);

  const scriptPath = scripts[index];
  const command = `echo '${sudoPassword}' | sudo -S bash ${scriptPath}`;

  conn.exec(command, { pty: true }, (err, stream) => {
    if (err) {
      callback(err);
      return;
    }

    let scriptOutput = '';
    stream
      .on('close', (code, signal) => executeScripts(conn, sudoPassword, scripts, index + 1, callback))
      .on('data', data => scriptOutput += data.toString())
      .stderr.on('data', data => callback(data));
  });
}

app.get('/api/data', async (req, res) => {
  try {
    const data = await db.collection('ChartData').find().toArray();
    const transformedData = data.map((item, index) => ({
      id: index + 1,
      data: Object.entries(item).map(([key, value]) => ({ name: key, value: Number(value) }))
    }));
    res.json(transformedData);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/cpu-data', async (req, res) => {
  try {
    const cpuData = await db.collection('CpuData').find({ hour: { $gte: 1, $lte: 24 } }).toArray();
    res.json(cpuData);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/cpu-time', async (req, res) => {
  try {
    const cpuTime = await db.collection('CpuTime').find({ hour: { $gte: 1, $lte: 24 } }).toArray();
    res.json(cpuTime);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/v-memory', async (req, res) => {
  try {
    const vMemory = await db.collection('V-Memory').find({ hour: { $gte: 1, $lte: 24 } }).toArray();
    res.json(vMemory);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/s-memory', async (req, res) => {
  try {
    const sMemory = await db.collection('S-Memory').find({ hour: { $gte: 1, $lte: 24 } }).toArray();
    res.json(sMemory);
  } catch (err) {
    res.status(500).send(err);
  }
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.NODE_MAILER_ID,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});

function generateRandomNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

app.post('/verify-company-email', async (req, res) => {
  const { companyEmail } = req.body;
  try {
    const verificationCode = generateRandomNumber();
    await db.collection('TempData').insertOne({
      email: companyEmail,
      verificationCode: verificationCode.toString(),
    });

    await transporter.sendMail({
      from: 'cofl3890@gmail.com',
      to: companyEmail,
      subject: 'Verification Code for Company Email',
      text: `Your verification code is: ${verificationCode}`,
    });

    res.status(200).send('Verification code sent successfully');
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).send('Error sending verification code');
  }
});

app.post('/verify-code', async (req, res) => {
  const { companyEmail, verificationCode } = req.body;
  try {
    const tempData = await db.collection('TempData').findOne({ email: companyEmail, verificationCode });
    if (tempData) {
      await db.collection('TempData').deleteOne({ email: companyEmail, verificationCode });
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).send('Error verifying code');
  }
});

app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

app.post('/logout', (req, res) => {
  req.logout();
  res.send('Logged out');
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await db.collection('Posts').find().toArray();
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Error fetching posts: ' + err.message);
  }
});

app.post('/posts', async (req, res) => {
  try {
    const { title, content, author, password } = req.body;
    if (!title || !content || !author) return res.status(400).json({ error: "Title, content, and author are required" });
    const result = await db.collection('Posts').insertOne({
      title,
      content,
      author,
      password: password || null
    });
    res.status(201).json(result);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, password, author } = req.body;
    if (!title || !content || !author) return res.status(400).json({ error: "All fields are required" });
    const result = await db.collection('Posts').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, password, author } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(result);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('Posts').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(result);
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// JSON 파일을 읽고 MongoDB에 저장하는 엔드포인트
app.get('/upload-json', async (req, res) => {
  const filePath = path.join(__dirname, 'data', 'postdb.json'); // JSON 파일 경로를 여기에 입력하세요

  try {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const collection = db.collection('TextData');

    await collection.insertMany(jsonData);
    res.send('JSON data has been successfully uploaded to MongoDB');
  } catch (error) {
    console.error('Error uploading data to MongoDB:', error);
    res.status(500).send('Error uploading data to MongoDB');
  }
});
