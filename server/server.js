require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb'); // MongoClient 가져오기
const multer = require('multer');

// Express 애플리케이션 생성
const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// MongoDB 연결
const url = process.env.DB_URL;
let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('DB connected');
    db = client.db('Login'); // 데이터베이스 선택

    // 서버 시작
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

// Passport 설정
passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const { name, companyEmail } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection('Member').insertOne({
          name,
          email,
          companyEmail,
          password: hashedPassword,
        });
        return done(null, { email });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        console.log('Finding user by email:', email);
        const user = await db.collection('Member').findOne({ email });

        if (!user) {
          console.log('User not found');
          return done(null, false, { message: 'Incorrect email.' });
        }

        console.log('User found:', user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log('Password does not match');
          return done(null, false, { message: 'Incorrect password.' });
        }

        console.log('Password matches');
        return done(null, user);
      } catch (err) {
        console.error('Error during login process:', err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await db.collection('Member').findOne({ email });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// 회원가입 라우트
app.post('/register', passport.authenticate('local-signup'), (req, res) => {
  res.status(201).send('User registered');
});

// 로그인 라우트
app.post('/login', passport.authenticate('local-login'), (req, res) => {
  res.json({ user: req.user });
});

// SSH 연결 및 명령어 실행
app.get('/ssh-test', (req, res) => {
  const conn = new Client();
  const sudoPassword = process.env.LINUX_PASSWORD;

  conn
    .on('ready', () => {
      console.log('SSH connection established');

      // 실행할 스크립트들
      const scripts = [
        '/home/kang/다운로드/test.sh',
        '/home/kang/다운로드/test2.sh',
        '/home/kang/다운로드/monitering2.py',
      ];

      // 각 스크립트를 차례대로 실행
      executeScripts(conn, sudoPassword, scripts, 0, (err) => {
        if (err) {
          console.error('Error executing scripts:', err);
          res.status(500).send(`Error executing scripts: ${err}`);
          conn.end();
        } else {
          res.send('All scripts executed successfully');
          conn.end();
        }
      });
    })
    .connect({
      host: process.env.VM_HOST,
      port: 22,
      username: process.env.VM_USERNAME,
      privateKey: fs.readFileSync(process.env.VM_PRIVATE_KEY_PATH),
    });

  conn.on('error', (err) => {
    console.error('SSH connection error:', err);
    res.status(500).send(`SSH connection error: ${err}`);
  });

  conn.on('end', () => {
    console.log('SSH connection ended');
  });

  conn.on('close', (hadError) => {
    if (hadError) {
      console.error('SSH connection closed due to an error');
    } else {
      console.log('SSH connection closed');
    }
  });
});

// 스크립트 실행 함수
function executeScripts(conn, sudoPassword, scripts, index, callback) {
  if (index >= scripts.length) {
    // 모든 스크립트가 실행된 경우 콜백 호출
    callback(null);
    return;
  }

  const scriptPath = scripts[index];
  const command = `echo '${sudoPassword}' | sudo -S bash ${scriptPath}`;

  conn.exec(command, { pty: true }, (err, stream) => {
    if (err) {
      console.error(`Error executing ${scriptPath}:`, err);
      callback(err);
      return;
    }

    let scriptOutput = '';

    stream
      .on('close', (code, signal) => {
        console.log(
          `Script ${scriptPath} executed :: code: ${code}, signal: ${signal}`
        );

        // 다음 스크립트 실행
        executeScripts(conn, sudoPassword, scripts, index + 1, callback);
      })
      .on('data', (data) => {
        console.log(`STDOUT (${scriptPath}): ` + data);
        scriptOutput += data.toString();
      })
      .stderr.on('data', (data) => {
        console.error(`STDERR (${scriptPath}): ` + data);
        callback(data); // 에러 발생 시 콜백 호출
      });
  });
}

app.get('/api/data', async (req, res) => {
  try {
    // ChartData와 TextData 두 컬렉션에서 데이터 가져오기
    const chartDataPromise = db.collection('ChartData').find().toArray();
    const textDataPromise = db.collection('TextData').find().toArray();
    
    // 두 Promise를 동시에 실행하고, 완료될 때까지 기다리기
    const [chartData, textData] = await Promise.all([chartDataPromise, textDataPromise]);
    
    // ChartData 변환
    const transformedChartData = chartData.map((item, index) => {
      const { _id, ...rest } = item;
      const dataEntries = Object.entries(rest).map(([key, value]) => ({
        name: key,
        value: Number(value),
      }));
      return {
        id: index + 1,
        data: dataEntries,
      };
    });
    
    // TextData 변환
    const transformedTextData = textData.map((item, index) => {
      const { _id, ...rest } = item;
      return {
        id: index + 1,
        ...rest,
      };
    });
    
    // 두 데이터 합쳐서 반환
    res.json({
      chartData: transformedChartData,
      textData: transformedTextData,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});


// MongoDB CpuData(모니터링 CPU 부분) 내용 가져오는 API 엔드포인트
app.get('/api/cpu-data', async (req, res) => {
  try {
    const cpuData = await db
      .collection('CpuData')
      .find({ hour: { $gte: 1, $lte: 24 } })
      .toArray();
    res.json(cpuData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// MongoDB CpuTime(모니터링 CPU 부분) 내용 가져오는 API 엔드포인트
app.get('/api/cpu-time', async (req, res) => {
  try {
    const cpuData = await db
      .collection('CpuTime')
      .find({ hour: { $gte: 1, $lte: 24 } })
      .toArray();
    res.json(cpuData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// MongoDB V-Memory (가상메모리) 내용 가져오는 API 엔드포인트
app.get('/api/v-memory', async (req, res) => {
  try {
    const cpuData = await db
      .collection('V-Memory')
      .find({ hour: { $gte: 1, $lte: 24 } })
      .toArray();
    res.json(cpuData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// MongoDB S-Memory (스왑메모리) 내용 가져오는 API 엔드포인트
app.get('/api/S-memory', async (req, res) => {
  try {
    const cpuData = await db
      .collection('S-Memory')
      .find({ hour: { $gte: 1, $lte: 24 } })
      .toArray();
    res.json(cpuData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 이메일 전송을 위한 transporter 생성
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

    const mailOptions = {
      from: 'cofl3890@gmail.com',
      to: companyEmail,
      subject: 'Verification Code for Company Email',
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send('Verification code sent successfully');
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).send('Error sending verification code');
  }
});

app.post('/verify-code', async (req, res) => {
  const { companyEmail, verificationCode } = req.body;

  try {
    const tempData = await db
      .collection('TempData')
      .findOne({ email: companyEmail, verificationCode });
    if (tempData) {
      await db
        .collection('TempData')
        .deleteOne({ email: companyEmail, verificationCode });
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).send('Error verifying code');
  }
});

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 정적 파일 제공 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// 게시물 목록을 가져오는 API 엔드포인트
app.get('/posts', async (req, res) => {
  try {
    const posts = await db.collection('Posts').find().toArray();
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Error fetching posts');
  }
});

// 게시물 생성 엔드포인트
app.post('/posts', async (req, res) => {
  try {
    const { title, content, password, author } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    await db.collection('Posts').insertOne({
      title,
      content,
      password: hashedPassword,
      author,
      createdAt: new Date(),
    });
    res.status(201).send('Post created');
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).send('Error creating post');
  }
});

// 특정 게시물 가져오는 엔드포인트
app.get('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send('Invalid post ID format');
    }
    const post = await db.collection('Posts').findOne({ _id: new ObjectId(id) });
    if (post) {
      res.json(post);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).send('Error fetching post');
  }
});

// 게시물 수정 (파일만 업데이트)
app.put('/posts/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file ? req.file.filename : null;
    
    // 파일이 첨부된 경우에만 업데이트
    const updateData = file ? { file } : {};

    const result = await db.collection('Posts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send('Post not found');
    }

    res.json({ file }); // 클라이언트가 파일 이름을 받을 수 있도록 응답
  } catch (err) {
    res.status(500).send(err);
  }
});



// 게시물 삭제 엔드포인트
app.delete('/posts/:id', async (req, res) => {
  try {
    const result = await db.collection('Posts').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      res.status(404).send('Post not found');
    } else {
      res.send('Post deleted');
    }
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).send('Error deleting post');
  }
});

// 게시물 비밀번호 확인 엔드포인트
app.post('/posts/check-password', async (req, res) => {
  try {
    const { postId, password } = req.body;
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ valid: false, message: 'Invalid post ID format' });
    }
    
    const post = await db.collection('Posts').findOne({ _id: new ObjectId(postId) });
    
    if (post) {
      if (post.password) {
        const isMatch = await bcrypt.compare(password, post.password);
        if (isMatch) {
          res.json({ valid: true });
        } else {
          res.json({ valid: false });
        }
      } else {
        res.status(400).json({ valid: false, message: 'This post does not require a password.' });
      }
    } else {
      res.status(404).json({ valid: false, message: 'Post not found' });
    }
  } catch (err) {
    console.error('Error checking password:', err);
    res.status(500).json({ valid: false, message: 'Internal server error while checking password' });
  }
});

// 게시물 비밀번호 확인 후 게시물 가져오는 엔드포인트
app.post('/posts/:id', async (req, res) => {
  const { password } = req.body;
  try {
    // 게시물 조회
    const post = await db.collection('Posts').findOne({ _id: new ObjectId(req.params.id) });

    if (!post) {
      return res.status(404).send('Post not found');
    }

    // 비밀번호가 설정된 게시물인지 확인
    if (post.password) {
      const isMatch = await bcrypt.compare(password, post.password);
      if (!isMatch) {
        return res.status(403).json({ valid: false, message: 'Incorrect password.' });
      }
    }

    // 비밀번호가 맞거나 비밀번호가 없는 게시물의 경우 게시물 반환
    const { title, content, author } = post;
    res.json({ title, content, author });
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).send('Error fetching post');
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