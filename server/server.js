const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: '', // 세션 암호화에 사용될 시크릿 키
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../client/dist")));

const url =
  "";
let db;

new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB connected");
    db = client.db("Login");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

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

app.post("/register", passport.authenticate("local-signup"), (req, res) => {
  res.status(201).send("User registered");
});

app.post("/login", passport.authenticate("local-login"), (req, res) => {
  res.send("Logged in");
});

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

app.get("/api/data", async (req, res) => {
  try {
    const data = await db.collection("ChartData").find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 이메일 전송을 위한 transporter 생성
const transporter = nodemailer.createTransport({
  service: "Gmail", // Gmail을 사용하려면 해당 계정의 아이디와 비밀번호를 입력해야 합니다.
  auth: {
    user: "", // 발신자 이메일 주소
    pass: "", // 발신자 이메일 비밀번호
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
      from: "", // 발신자 이메일 주소
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
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).send("Error verifying code");
  }
});
