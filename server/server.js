// 필요한 모듈 가져오기
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const cors = require("cors");

// Express 애플리케이션 생성
const app = express();

// 포트 설정
const PORT = process.env.PORT || 3001;

// CORS 미들웨어 추가
app.use(cors());

// JSON 파싱 및 URL 인코딩 미들웨어 추가
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 세션 설정
app.use(
  session({
    secret: "", // 세션 암호화에 사용될 시크릿 키
    resave: false,
    saveUninitialized: false,
  })
);

// Passport 초기화 및 세션 사용 설정
app.use(passport.initialize());
app.use(passport.session());

// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, "../client/dist")));

// MongoDB 연결
const url =
  "몽고DB 주소";
let db;

new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("Login");
    // 서버 시작
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// 회원가입 설정
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email", // 이메일을 사용자명으로 설정
      passwordField: "password", // 패스워드를 패스워드로 설정
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);
        // 사용자 정보 저장
        await db
          .collection("Member")
          .insertOne({ email, password: hashedPassword });
        return done(null, { email });
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 로그인 설정
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
        // 이메일로 사용자 찾기
        const user = await db.collection("Member").findOne({ email });

        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        // 비밀번호 비교
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

// 사용자 이메일을 기준으로 사용자 정보를 찾는 과정 → 신원확인 과정

// 사용자 직렬화
passport.serializeUser((user, done) => {
  done(null, user.email); // 사용자의 이메일을 세션에 저장
});

// 사용자 역직렬화
passport.deserializeUser(async (email, done) => {
  try {
    // 이메일로 사용자 찾기
    const user = await db.collection("Member").findOne({ email });
    done(null, user); // 세션에서 사용자를 가져옴
  } catch (err) {
    done(err);
  }
});
