require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const nodemailer = require('nodemailer');

<<<<<<< HEAD
=======
// Express 애플리케이션 및 필요한 모듈 가져오기
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const nodemailer = require("nodemailer");
const jsonData = require("./data3.json"); // data.json 파일 가져오기
const { Client } = require("ssh2"); // ssh2 모듈 가져오기

// Express 애플리케이션 생성
>>>>>>> main
const app = express();
const PORT = process.env.PORT || 3001;

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

const url = process.env.DB_URL;
let db;

<<<<<<< HEAD
MongoClient.connect(url, {
  tls: true,
  tlsInsecure: true, // 추가: TLS 검사를 비활성화합니다.
})
  .then((client) => {
    console.log('DB connected');
    db = client.db('Login'); // 데이터베이스 선택
=======
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (client) => {
    // 콜백 함수를 async로 변경
    console.log("DB connected");
    db = client.db("Login"); // 데이터베이스 선택

>>>>>>> main
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

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

<<<<<<< HEAD
app.post('/register', passport.authenticate('local-signup'), (req, res) => {
  res.status(201).send('User registered');
=======
// SSH 연결 및 명령어 실행
app.get("/ssh-test", (req, res) => {
  const conn = new Client();
  const sudoPassword = process.env.LINUX_PASSWORD;

  conn.on('ready', () => {
    console.log("SSH connection established");

    // 실행할 스크립트들
    const scripts = [
      "/home/kang/다운로드/test.sh",
      "/home/kang/다운로드/test2.sh",
      "/home/kang/다운로드/monitering2.py"
    ];

    // 각 스크립트를 차례대로 실행
    executeScripts(conn, sudoPassword, scripts, 0, (err) => {
      if (err) {
        console.error("Error executing scripts:", err);
        res.status(500).send(`Error executing scripts: ${err}`);
        conn.end();
      } else {
        res.send("All scripts executed successfully");
        conn.end();
      }
    });
  }).connect({
    host: process.env.VM_HOST,
    port: 22,
    username: process.env.VM_USERNAME,
    privateKey: require("fs").readFileSync(process.env.VM_PRIVATE_KEY_PATH),
  });

  conn.on('error', (err) => {
    console.error("SSH connection error:", err);
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

    let scriptOutput = "";

    stream
      .on('close', (code, signal) => {
        console.log(`Script ${scriptPath} executed :: code: ${code}, signal: ${signal}`);

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



// 회원가입 라우트
app.post("/register", passport.authenticate("local-signup"), (req, res) => {
  res.status(201).send("User registered");
>>>>>>> main
});

app.post('/login', passport.authenticate('local-login'), (req, res) => {
  res.send('Logged in');
});

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

<<<<<<< HEAD
app.get('/api/data', async (req, res) => {
=======
// 차트 데이터 (주통기반취약점) 가져오는 API 엔드포인트
app.get("/api/data", async (req, res) => {
>>>>>>> main
  try {
    const data = await db.collection('ChartData').find().toArray();
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

<<<<<<< HEAD
=======
// MongoDB CpuData(모니터링 CPU 부분) 내용 가져오는 API 엔드포인트
app.get("/api/cpu-data", async (req, res) => {
  try {
    const cpuData = await db
      .collection("CpuData")
      .find({ hour: { $gte: 1, $lte: 24 } })
      .toArray();
    res.json(cpuData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// MongoDB CpuTime(모니터링 CPU 부분) 내용 가져오는 API 엔드포인트
app.get("/api/cpu-time", async (req, res) => {
  try {
    const cpuData = await db
      .collection("CpuTime")
      .find({ hour: { $gte: 1, $lte: 24 } })
      .toArray();
    res.json(cpuData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// MongoDB V-Memory (가상메모리) 내용 가져오는 API 엔드포인트
app.get("/api/v-memory", async (req, res) => {
  try {
    const cpuData = await db
      .collection("V-Memory")
      .find({ hour: { $gte: 1, $lte: 24 } })
      .toArray();
    res.json(cpuData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// MongoDB S-Memory (스왑메모리) 내용 가져오는 API 엔드포인트
app.get("/api/S-memory", async (req, res) => {
  try {
    const cpuData = await db
      .collection("S-Memory")
      .find({ hour: { $gte: 1, $lte: 24 } })
      .toArray();
    res.json(cpuData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 이메일 전송을 위한 transporter 생성
>>>>>>> main
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

// 로그인 상태 확인 API
app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.logout();
  res.send('Logged out');
});
