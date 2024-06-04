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

// Express 애플리케이션 생성
const app = express();
const PORT = process.env.PORT || 3001; // 포트 설정

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
        return done(null, { email });
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

// 회원가입 라우트
app.post("/register", passport.authenticate("local-signup"), (req, res) => {
  res.status(201).send("User registered");
});

// 로그인 라우트
app.post("/login", passport.authenticate("local-login"), (req, res) => {
  res.send("Logged in");
});

// Passport 직렬화 및 역직렬화
passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await db.collection("Member").findOne({ email });
    done(null, user);
  } catch (err) {
    done(err);
  }
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
