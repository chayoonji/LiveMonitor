
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
const PORT = process.env.PORT || 3002;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 세션 미들웨어 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

// Passport 미들웨어 초기화
app.use(passport.initialize());
app.use(passport.session());

// MongoDB 연결
const url = process.env.DB_URL;
let db;
let client;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((mongoClient) => {
    console.log('DB connected');
    client = mongoClient;
    db = client.db('Login');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

// Multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8')); // Correctly encode the filename
  },
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

// Passport 설정
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
          return done(null, false, { message: 'User ID is already taken.' });
        }
        const { name, companyEmail } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection('Member').insertOne({
          name,
          userId,
          companyEmail,
          password: hashedPassword,
        });
        const sanitizedUserId = sanitizeDbName(userId);
        const userDb = client.db(sanitizedUserId);
        await userDb.createCollection('ChartData');
        await userDb.createCollection('CpuData');
        await userDb.createCollection('CpuTime');
        await userDb.createCollection('VMemory');
        await userDb.createCollection('SMemory');
        await userDb.createCollection('TextData');
        await userDb.createCollection('Solutions');
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
  done(null, { userId: user.userId });
});

passport.deserializeUser(async (obj, done) => {
  try {
    const user = await db.collection('Member').findOne({ userId: obj.userId });
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
app.post('/login', async (req, res) => {
  const { userId } = req.body;

  try {
    // Check if the user exists
    const user = await db.collection('Member').findOne({ userId });

    if (!user) {
      return res.status(401).send('Invalid credentials');
    }

    // Determine if the user is an admin
    const isAdmin = user.type === 'admin';
    res.status(200).json({ success: true, isAdmin });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error');
  }
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

// 사용자 아이디 설정 라우트
app.post('/set-user-id', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const sanitizedDbName = sanitizeDbName(userId);
    userDb = client.db(sanitizedDbName); // 사용자 아이디로 데이터베이스 선택
    console.log('Using database:', sanitizedDbName);

    res.status(200).json({ message: 'Database selected', dbName: sanitizedDbName });
  } catch (err) {
    console.error('Error connecting to database:', err);
    res.status(500).json({ message: 'Error connecting to database' });
  }
});


// 주통 총합 가져오는 API 엔드포인트
app.get('/api/data', async (req, res) => {
  try {
    const data = await userDb.collection('ChartData').find().toArray();

    if (!data.length) {
      return res.status(404).send('No summary data found');
    }

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
    console.error('Error fetching summary data:', err);
    res.status(500).send('Error fetching summary data');
  }
});

// 게시물 목록을 검색 및 필터링하여 가져오는 API 엔드포인트
app.get('/api/search-text-data', async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const filter = query
      ? {
          $or: [
            { 분류: { $regex: query, $options: 'i' } },
            { 결과상세: { $regex: query, $options: 'i' } },
            { 결과: { $regex: query, $options: 'i' } },
          ],
        }
      : {};

    const [total, data] = await Promise.all([
      userDb.collection('TextData').countDocuments(filter),
      userDb
        .collection('TextData')
        .find(filter)
        .skip(skip)
        .limit(Number(limit))
        .toArray(),
    ]);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (err) {
    console.error('Error searching text data:', err);
    res.status(500).send('Error searching text data');
  }
});

// 진단 결과를 가져오는 API 엔드포인트
app.get('/api/diagnosis-results', async (req, res) => {
  try {
    // 데이터베이스 컬렉션 이름을 소문자로 변환하여 찾기
    const collections = [
      'ChartData',
      'CpuData',
      'CpuTime',
      'VMemory',
      'SMemory',
      'TextData',
      'Solutions'
    ];

    const uploadsPath = path.join(__dirname, 'uploads'); // 서버에서 uploads 폴더의 절대 경로

    const [chartData, cpuData, cpuTime, vMemory, sMemory, textData, solutions] =
      await Promise.all(collections.map(async (collectionName) => {
        const normalizedCollectionName = collectionName.toLowerCase();
        const files = fs.readdirSync(uploadsPath); // 인코딩 없이 폴더의 파일 목록 읽기
        const jsonFile = files.find(file => 
          file.toLowerCase() === `${normalizedCollectionName}.json`
        );

        if (jsonFile) {
          const data = fs.readFileSync(path.join(uploadsPath, jsonFile), 'utf8'); // 인코딩을 'utf8'로 설정하여 파일 읽기
          return JSON.parse(data);
        } else {
          return []; // 파일이 없으면 빈 배열 반환
        }
      }));

    res.json({
      chartData,
      cpuData,
      cpuTime,
      vMemory,
      sMemory,
      textData,
      solutions,
    });
  } catch (err) {
    console.error('Error fetching diagnosis results:', err);
    res.status(500).send('Error fetching diagnosis results');
  }
});

// 해결 방안을 안내하는 페이지의 정보를 가져오는 API 엔드포인트
app.get('/api/solutions', async (req, res) => {
  try {
    const solutions = await userDb.collection('Solutions').find().toArray();
    res.json(solutions);
  } catch (err) {
    console.error('Error fetching solutions:', err);
    res.status(500).send('Error fetching solutions');
  }
});


// MongoDB CpuData(모니터링 CPU 부분) 내용 가져오는 API 엔드포인트
app.get('/api/cpu-data', async (req, res) => {
  try {
    const cpuData = await userDb
      .collection('CpuData')
      .find({ hour: { $gte: 1, $lte: 24 } })
      .toArray();

    res.json(cpuData);
  } catch (err) {
    console.error('Error fetching CPU data:', err);
    res.status(500).send('Error fetching CPU data');
  }
});

// MongoDB CpuTime(모니터링 CPU 부분) 내용 가져오는 API 엔드포인트
app.get('/api/cpu-time', async (req, res) => {
  try {
    const cpuTime = await userDb
      .collection('CpuTime')
      .find({ hour: { $gte: 1, $lte: 24 } })
      .toArray();

    console.log('Fetched CPU Time Data:', cpuTime); // 로그 추가

    res.json(cpuTime);
  } catch (err) {
    console.error('Error fetching CPU time:', err);
    res.status(500).send('Error fetching CPU time');
  }
});


// MongoDB V-Memory (가상메모리) 내용 가져오는 API 엔드포인트
app.get('/api/V-memory', async (req, res) => {
  try {
    const vMemory = await userDb
      .collection('VMemory')
      .find({ hour: { $gte: 1, $lte: 24 } })
      .toArray();

    res.json(vMemory);
  } catch (err) {
    console.error('Error fetching VMemory data:', err);
    res.status(500).send('Error fetching VMemory data');
  }
});

// MongoDB SMemory 데이터 가져오는 API 엔드포인트
app.get('/api/S-memory', async (req, res) => {
  try {
    const sMemory = await userDb
      .collection('SMemory')
      .find({ hour: { $gte: 1, $lte: 24 } })
      .toArray();

    res.json(sMemory);
  } catch (err) {
    console.error('Error fetching SMemory data:', err);
    res.status(500).send('Error fetching SMemory data');
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
    const { title, content, password, author, status } = req.body; // status 추가
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    await db.collection('Posts').insertOne({
      title,
      content,
      password: hashedPassword,
      author,
      status, // status 저장
      createdAt: new Date(),
    });
    res.status(201).send('Post created');
  } catch (err) {
    res.status(500).send('Error creating post');
  }
});


// 상태 변경 엔드포인트
app.patch('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await db.collection('Posts').updateOne(
      { _id: new mongodb.ObjectId(id) }, // _id를 ObjectId로 변환
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Post not found');
    }

    res.status(200).send('Post status updated');
  } catch (err) {
    console.error('Error updating status:', err); // 에러 로그 추가
    res.status(500).send('Error updating status');
  }
});



// 특정 게시물 가져오는 엔드포인트
app.get('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send('Invalid post ID format');
    }
    const post = await db
      .collection('Posts')
      .findOne({ _id: new ObjectId(id) });
    if (post) {
      res.json(post);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    res.status(500).send('Error fetching post');
  }
});



app.put('/posts/:id', upload.array('files'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, password } = req.body;
    const files = req.files ? req.files.map((file) => ({
      filename: file.filename,
      downloadUrl: `${req.protocol}://${req.get('host')}/download/${file.filename}`
    })) : [];

    // 기존 게시물 가져오기
    const existingPost = await db.collection('Posts').findOne({ _id: new ObjectId(id) });
    if (!existingPost) {
      return res.status(404).send('Post not found');
    }

    // 비밀번호 해시 처리
    let hashedPassword = existingPost.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateData = {
      ...(title && { title }),
      ...(content && { content }),
      ...(author && { author }),
      ...(files.length > 0 && { files }), // 업로드된 파일 정보 저장
      password: hashedPassword,
    };

    const result = await db.collection('Posts').updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount > 0) {
      res.json({ message: 'Post updated', files }); // 파일 다운로드 URL 반환
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).send('Error updating post');
  }
});

// 파일만 업로드 처리 (게시물에 추가하지 않음)
app.post('/posts/:id/upload', upload.array('files'), (req, res) => {
  const { id } = req.params;
  const files = req.files;

  if (!files) {
    return res.status(400).send('No files were uploaded.');
  }

  files.forEach(file => {
    console.log('Uploaded file:', file.path);
  });

  // 파일 이름을 응답으로 반환
  res.status(200).json({ files: files.map(file => file.filename) });
});

// 파일 다운로드 처리
app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  // 파일이 존재하는지 확인
  if (fs.existsSync(filePath)) {
    res.download(filePath); // 파일 다운로드 처리
  } else {
    res.status(404).send('File not found');
  }
});






// 게시물 삭제 엔드포인트
app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send('Invalid post ID format');
    }
    const result = await db
      .collection('Posts')
      .deleteOne({ _id: new ObjectId(id) });
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
      return res
        .status(400)
        .json({ valid: false, message: 'Invalid post ID format' });
    }

    const post = await db
      .collection('Posts')
      .findOne({ _id: new ObjectId(postId) });

    if (post) {
      if (post.password) {
        const isMatch = await bcrypt.compare(password, post.password);
        if (isMatch) {
          res.json({ valid: true });
        } else {
          res.json({ valid: false });
        }
      } else {
        res.status(400).json({
          valid: false,
          message: 'This post does not require a password.',
        });
      }
    } else {
      res.status(404).json({ valid: false, message: 'Post not found' });
    }
  } catch (err) {
    console.error('Error checking password:', err);
    res.status(500).json({
      valid: false,
      message: 'Internal server error while checking password',
    });
  }
});

// 게시물 비밀번호 확인 후 게시물 가져오는 엔드포인트
app.post('/posts/:id', async (req, res) => {
  const { password } = req.body;
  try {
    // 게시물 조회
    const post = await db
      .collection('Posts')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!post) {
      return res.status(404).send('Post not found');
    }

    // 비밀번호가 설정된 게시물인지 확인
    if (post.password) {
      const isMatch = await bcrypt.compare(password, post.password);
      if (!isMatch) {
        return res
          .status(403)
          .json({ valid: false, message: 'Incorrect password.' });
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
  const { userId } = req.user;

  try {
    const userDb = client.db(userId);

    const [chartData, cpuData, cpuTime, vMemory, sMemory, solutions, textData] =
      await Promise.all([
        userDb.collection('ChartData').findOne({ _id: new ObjectId(objectId) }),
        userDb.collection('CpuData').findOne({ _id: new ObjectId(objectId) }),
        userDb.collection('CpuTime').findOne({ _id: new ObjectId(objectId) }),
        userDb.collection('VMemory').findOne({ _id: new ObjectId(objectId) }),
        userDb.collection('SMemory').findOne({ _id: new ObjectId(objectId) }),
        userDb.collection('TextData').findOne({ _id: new ObjectId(objectId) }),
        userDb.collection('Solutions').findOne({ _id: new ObjectId(objectId) }),
      ]);

    if (
      !chartData ||
      !cpuData ||
      !cpuTime ||
      !vMemory ||
      !sMemory ||
      !solutions ||
      !textData
    ) {
      return res.status(404).send('Data not found');
    }

    res.render('diagnosis-results', {
      chartData,
      cpuData,
      cpuTime,
      vMemory,
      sMemory,
      solutions,
      textData,
      title: 'Diagnosis Results',
    });
  } catch (err) {
    console.error('Error fetching diagnosis results:', err);
    res.status(500).send('Error fetching diagnosis results');
  }
});

// 업로드 폴더 존재 여부 확인 및 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// JSON 파일을 데이터베이스에 저장하는 라우트
app.post('/upload/:userId', upload.none(), async (req, res) => {
  const { userId } = req.params;

  try {
    // 현재 연결된 데이터베이스가 설정된 사용자 아이디와 일치하는지 확인
    const admin = client.db().admin();
    const databases = await admin.listDatabases();
    const dbExists = databases.databases.some((db) => db.name === userId);

    if (!dbExists) {
      return res
        .status(404)
        .json({ message: '해당 데이터베이스가 존재하지 않습니다.' });
    }

    const database = client.db(userId); // 사용자 데이터베이스 선택
    const collections = [
      'ChartData',
      'CpuData',
      'CpuTime',
      'VMemory',
      'SMemory',
      'TextData',
      'Solutions',
    ];

    const files = fs.readdirSync(path.join(__dirname, 'uploads'));

    for (const file of files) {
      const filePath = path.join(__dirname, 'uploads', file);
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const collectionName = path.basename(file, path.extname(file));
      const matchingCollection = collections.find(
        (col) => col.toLowerCase() === collectionName.toLowerCase()
      );

      if (matchingCollection) {
        const collection = database.collection(matchingCollection);
        // 기존 데이터를 삭제한 후 새로운 데이터 삽입
        await collection.deleteMany({}); // 기존 데이터 삭제
        await collection.insertMany(
          Array.isArray(jsonData) ? jsonData : [jsonData]
        );
      }
    }

    res
      .status(200)
      .json({ message: '파일이 성공적으로 업로드되고 저장되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error });
  }
});

// 페이지네이션과 검색을 지원하는 API
app.get('/api/search-text-data', async (req, res) => {
  const { page = 1, limit = 4, query = '' } = req.query;
  const skip = (page - 1) * limit;

  try {
    const collection = db.collection('TextData');
    const [data, total] = await Promise.all([
      collection.find({ $text: { $search: query } }).skip(parseInt(skip)).limit(parseInt(limit)).toArray(),
      collection.countDocuments({ $text: { $search: query } })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data,
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ error: '데이터를 불러오는 중 오류가 발생했습니다.' });
  }
});

app.put('/posts/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const post = await db.collection('Posts').findOne({ _id: new ObjectId(id) });
    if (!post) {
      return res.status(404).send('Post not found');
    }

    // 상태 업데이트
    await db.collection('Posts').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
    
    res.send({ success: true, status });
  } catch (error) {
    console.error('Error updating status:', error); // 상세 오류 로그
    res.status(500).send('Server error');
  }
});

app.post('/reset-database-values', async (req, res) => {
  try {
    // 유저의 database 정보만 리셋
    userDb = null;
    console.log('Database values have been reset.');

    res.status(200).json({ message: 'Database values have been reset.' });
  } catch (err) {
    console.error('Error resetting database values:', err);
    res.status(500).json({ message: 'Error resetting database values' });
  }
});
