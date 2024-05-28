const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { MongoClient } = require("mongodb");
const cors = require('cors'); 

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: '세션 비밀번호',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../client/dist")));

const url = "mongoDB URL을 입력하세요";
let db;

new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("Login");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('Member').insertOne({ email, password: hashedPassword });
    return done(null, { email });
  } catch (err) {
    return done(err);
  }
}));

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const user = await db.collection('Member').findOne({ email });

    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

app.post('/register', passport.authenticate('local-signup'), (req, res) => {
  res.status(201).send('User registered');
});

app.post('/login', passport.authenticate('local-login'), (req, res) => {
  res.send('Logged in');
});

passport.serializeUser((user, done) => {
  done(null, user.email); // 사용자의 이메일을 세션에 저장
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await db.collection('Member').findOne({ email });
    done(null, user); // 세션에서 사용자를 가져옴
  } catch (err) {
    done(err);
  }
});
