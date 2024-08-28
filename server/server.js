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
let client;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((mongoClient) => {
    console.log('DB connected');
    client = mongoClient; // client 변수에 MongoClient 객체 할당
    db = client.db('Login'); // 데이터베이스 선택

    // 서버 시작
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ storage });

// 점을 제거하는 함수
function sanitizeDbName(email) {
  return email.replace(/\./g, '_');
}


// 중복 확인 엔드포인트
app.post('/check-duplicate', async (req, res) => {
  const { userId } = req.body;

  try {
      const member = await db.collection('Member').findOne({ userId: userId });
      if (member) {
          res.json({ exists: true });
      } else {
          res.json({ exists: false });
      }
  } catch (error) {
      res.status(500).json({ error: '서버 오류' });
  }
});



// Passport 설정에서 db 연결 부분 수정
passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'userId',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, userId, password, done) => {
      try {
        const existingUser = await db.collection('Member').findOne({ userId });

        if (existingUser) {
          // If userId already exists, return an error message
          return done(null, false, { message: 'User ID is already taken.' });
        }

        const { name, companyEmail } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the collection
        await db.collection('Member').insertOne({
          name,
          userId,
          companyEmail,
          password: hashedPassword,
        });

        // Create collections for the new user
        const sanitizedUserId = sanitizeDbName(userId);
        const userDb = client.db(sanitizedUserId);
        await userDb.createCollection('ChartData');
        await userDb.createCollection('CpuData');
        await userDb.createCollection('CpuTime');
        await userDb.createCollection('V-Memory');
        await userDb.createCollection('TextData');

        return done(null, { userId });
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
      usernameField: 'userId',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, userId, password, done) => {
      try {
        const user = await db.collection('Member').findOne({ userId });

        if (!user) {
          return done(null, false, { message: 'Incorrect user ID.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await db.collection('Member').findOne({ userId });
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

// 주통 총합 가져오는 API 엔드포인트
app.get('/api/data', async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userDb = client.db(userEmail); // 현재 로그인된 사용자의 데이터베이스
    const data = await userDb.collection('ChartData').find().toArray();
    const transformedData = data.map((item, index) => {
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
    res.json(transformedData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 게시물 목록을 검색 및 필터링하여 가져오는 API 엔드포인트
app.get('/api/search-text-data', async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const filter = query ? {
      $or: [
        { 분류: { $regex: query, $options: 'i' } },
        { 결과상세: { $regex: query, $options: 'i' } },
        { 결과: { $regex: query, $options: 'i' } }
      ]
    } : {};

    const [total, data] = await Promise.all([
      db.collection('TextData').countDocuments(filter),
      db.collection('TextData').find(filter).skip(skip).limit(Number(limit)).toArray()
    ]);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data
    });
  } catch (err) {
    console.error('Error searching text data:', err);
    res.status(500).send('Error searching text data');
  }
});

// 취약한 결과를 확인하는 API 엔드포인트
app.get('/api/diagnosis-results/:objectId', async (req, res) => {
  const { objectId } = req.params;

  try {
    const userEmail = req.user.email;
    const userDb = client.db(userEmail); // 현재 로그인된 사용자의 데이터베이스

    const [chartData, cpuData, cpuTime, vMemory, textData] = await Promise.all([
      userDb.collection('ChartData').findOne({ _id: new ObjectId(objectId) }),
      userDb.collection('CpuData').findOne({ _id: new ObjectId(objectId) }),
      userDb.collection('CpuTime').findOne({ _id: new ObjectId(objectId) }),
      userDb.collection('V-Memory').findOne({ _id: new ObjectId(objectId) }),
      userDb.collection('TextData').findOne({ _id: new ObjectId(objectId) })
    ]);

    if (!chartData || !cpuData || !cpuTime || !vMemory || !textData) {
      return res.status(404).send('Data not found');
    }

    res.json({
      chartData,
      cpuData,
      cpuTime,
      vMemory,
      textData
    });
  } catch (err) {
    console.error('Error fetching diagnosis results:', err);
    res.status(500).send('Error fetching diagnosis results');
  }
});

// 해결 방안을 안내하는 페이지의 정보를 가져오는 API 엔드포인트
app.get('/api/solutions', async (req, res) => {
  try {
    const solutions = await db.collection('Solutions').find().toArray();
    res.json(solutions);
  } catch (err) {
    console.error('Error fetching solutions:', err);
    res.status(500).send('Error fetching solutions');
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

// 정적 파일 제공 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 게시물 목록을 가져오는 API 엔드포인트
app.get('/posts', async (req, res) => {
  try {
    const posts = await db.collection('Posts').find().toArray();
    res.json(posts);
  } catch (err) {
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
    res.status(500).send('Error fetching post');
  }
});

// 게시물 수정 (파일만 업데이트)
app.put('/posts/:id', upload.array('files'), async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files ? req.files.map(file => file.filename) : [];

    const updateData = files.length > 0 ? { files } : {};

    await db.collection('Posts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    res.send('Post updated');
  } catch (err) {
    res.status(500).send('Error updating post');
  }
});

// 게시물 삭제
app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send('Invalid post ID format');
    }
    const result = await db.collection('Posts').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.send('Post deleted');
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
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


// 게시물 상세 페이지를 위한 데이터 조회 및 출력
app.get('/diagnosis-results/:objectId', async (req, res) => {
  const { objectId } = req.params;

  try {
    const userEmail = req.user.email;
    const userDb = client.db(userEmail);

    const [chartData, cpuData, cpuTime, vMemory, textData] = await Promise.all([
      userDb.collection('ChartData').findOne({ _id: new ObjectId(objectId) }),
      userDb.collection('CpuData').findOne({ _id: new ObjectId(objectId) }),
      userDb.collection('CpuTime').findOne({ _id: new ObjectId(objectId) }),
      userDb.collection('V-Memory').findOne({ _id: new ObjectId(objectId) }),
      userDb.collection('TextData').findOne({ _id: new ObjectId(objectId) })
    ]);

    if (!chartData || !cpuData || !cpuTime || !vMemory || !textData) {
      return res.status(404).send('Data not found');
    }

    res.render('diagnosis-results', {
      chartData,
      cpuData,
      cpuTime,
      vMemory,
      textData,
      title: 'Diagnosis Results'
    });
  } catch (err) {
    console.error('Error fetching diagnosis results:', err);
    res.status(500).send('Error fetching diagnosis results');
  }
});

// 파일 업로드 및 처리

app.post('/upload-json', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    // 파일 내용을 MongoDB에 업로드
    const userEmail = req.user.email;
    const userDb = client.db(userEmail);

    for (const [collectionName, data] of Object.entries(jsonData)) {
      await userDb.collection(collectionName).insertMany(data);
    }

    res.status(200).send('File uploaded and data imported successfully');
  } catch (err) {
    console.error('Error uploading and processing file:', err);
    res.status(500).send('Error uploading and processing file');
  }
});