const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");  // ← mysql2 연결 파일
require("dotenv").config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// 1. 회원가입
router.post("/signup", async (req, res) => {
  const { username, password, name, preferred_club_id, preferred_club_name } = req.body;
  const clubId = preferred_club_id ? parseInt(preferred_club_id, 10) : null;

  try {
    // 아이디 중복 체크
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "이미 존재하는 아이디입니다." });
    }

    // 비밀번호 해시
    const hashed = await bcrypt.hash(password, 10);

    // DB 저장
    await pool.query(
      "INSERT INTO users (username, password, name, preferred_club_id, preferred_club_name) VALUES (?, ?, ?, ?, ?)",
      [username, hashed, name, clubId, preferred_club_name]
    );

    return res.json({ message: "회원가입 성공" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "서버 오류" });
  }
});


// 2. 로그인
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0)
      return res.status(400).json({ error: "존재하지 않는 아이디입니다." });

    const user = rows[0];

    // 비밀번호 검증
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ error: "비밀번호가 틀렸습니다." });

    // JWT 발급
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        name: user.name,
        preferred_club_id: user.preferred_club_id,
        preferred_club_name: user.preferred_club_name
      },
      JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "로그인 성공",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        preferred_club_id: user.preferred_club_id,
        preferred_club_name: user.preferred_club_name
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
