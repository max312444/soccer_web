const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");

// 환경 변수
const DB_PATH = process.env.DB_PATH;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// DB 연결
const db = new Database(DB_PATH);

// 유저 테이블 없으면 생성
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  )
`).run();

// 1. 회원 가입
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 이메일 중복 체크
    const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(mail);
    if (existing) {
      return res.status(400).json({ error: "이미 존재하는 이메일입니다."});
    }
    // 비밀번호 해시
    const hashed = await bcrypt.hash(password, 10);

    // DB 저장
    db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)")
      .run(email, hashed, name)

    return res.json({ message: "회원가입 성공" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "서버 오류" });
  }
});

// 2. 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user) return res.status(400).json({ error: "존재하지 않는 이메일입니다." });

    // 비밀번호 검증
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "비밀번호가 틀렸습니다." });

    // JWT 발급
    const accessToken = jwt.sign({ id: user.id }, JWT_ACCESS_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

    return res.json({
      message: "로그인 성공",
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      accessToken,
      refreshToken,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;