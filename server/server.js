// dotenv 라이브러리를 사용하여 환경 변수 로드
require("dotenv").config();

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
const app = express();
const PORT = process.env.PORT || 3002; // 포트 설정

// 미들웨어 설정
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: false })); // URL 인코딩 사용

// 세션 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET, // 세션 암호화에 사용될 시크릿 키
    resave: false,
    saveUninitialized: false,
  })
);

// Passport 초기화 및 세션 설정
app.use(passport.initialize());
app.use(passport.session());

// MongoDB 연결
const url = process.env.DB_URL; // .env 파일에서 DB_URL 가져옴
let db; // 데이터베이스 클라이언트

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (client) => {
    // 콜백 함수를 async로 변경
    console.log("DB connected");
    db = client.db("Login"); // 데이터베이스 선택

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Passport 설정
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const { name, companyEmail } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("Member").insertOne({
          name,
          email,
          companyEmail,
          password: hashedPassword,
        });
        return done(null, { email, name });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await db.collection("Member").findOne({ email });

        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Passport 직렬화 및 역직렬화
passport.serializeUser((user, done) => {
  done(null, { email: user.email, name: user.name }); // 세션에 사용자의 이메일과 이름을 저장
});

passport.deserializeUser(async (userData, done) => {
  try {
    const user = await db.collection("Member").findOne({ email: userData.email });
    if (user) {
      done(null, { email: user.email, name: user.name }); // 세션에서 사용자 정보를 복원
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
});

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

// 로그인 라우트
app.post("/login", passport.authenticate("local-login"), (req, res) => {
  res.send({ name: req.user.name });
});

// 로그아웃 라우트
app.post("/logout", (req, res) => {
  req.logout();
  res.send("Logged out");
});

// 게시물 생성 엔드포인트
app.post("/posts", async (req, res) => {
  const { title, content, author } = req.body;

  try {
    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    await db.collection("Posts").insertOne({
      title,
      content,
      author: author || "Unknown",
      createdAt: new Date(),
    });
    res.status(201).send("Post created successfully");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Error creating post");
  }
});

// 게시물 목록 가져오기 엔드포인트
app.get("/posts", async (req, res) => {
  try {
    const posts = await db.collection("Posts").find().toArray();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error fetching posts");
  }
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});

// 차트 데이터 (주통기반취약점) 가져오는 API 엔드포인트
app.get("/api/data", async (req, res) => {
  try {
    const data = await db.collection("ChartData").find().toArray();
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
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODE_MAILER_ID, // 발신자 이메일 주소
    pass: process.env.NODE_MAILER_PASSWORD, // 발신자 이메일 비밀번호
  },
});

// 인증번호 생성 함수
function generateRandomNumber() {
  return Math.floor(100000 + Math.random() * 900000); // 6자리의 랜덤 숫자 생성
}

// 회사 이메일 인증 요청 핸들러
app.post("/verify-company-email", async (req, res) => {
  const { companyEmail } = req.body;

  try {
    // 랜덤한 6자리 숫자 생성
    const verificationCode = generateRandomNumber();

    // MongoDB에 회사 이메일과 인증번호 저장
    await db.collection("TempData").insertOne({
      email: companyEmail,
      verificationCode: verificationCode.toString(),
    });

    // 이메일 전송 옵션 설정
    const mailOptions = {
      from: "cofl3890@gmail.com", // 발신자 이메일 주소
      to: companyEmail, // 수신자 이메일 주소
      subject: "Verification Code for Company Email", // 이메일 제목
      text: `Your verification code is: ${verificationCode}`, // 이메일 내용
    };

    // 이메일 전송
    await transporter.sendMail(mailOptions);

    res.status(200).send("Verification code sent successfully");
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).send("Error sending verification code");
  }
});

// 인증 코드 검증 핸들러
app.post("/verify-code", async (req, res) => {
  const { companyEmail, verificationCode } = req.body;

  try {
    const tempData = await db
      .collection("TempData")
      .findOne({ email: companyEmail, verificationCode });
    if (tempData) {
      // 인증 코드가 일치하면 TempData에서 해당 데이터 삭제
      await db
        .collection("TempData")
        .deleteOne({ email: companyEmail, verificationCode });
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).send("Error verifying code");
  }
});