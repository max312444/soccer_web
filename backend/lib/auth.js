const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

module.exports = function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  // ✅ 회원가입 컨텍스트 예외 허용
  // 선호 구단 검색에서만 사용
  if (!authHeader && req.query.context === "signup") {
    return next();
  }

  if (!authHeader) {
    return res.status(401).json({ error: "토큰이 없습니다." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "토큰 형식이 올바르지 않습니다." });
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    req.user = {
      username: decoded.username,
      id: decoded.id,
      email: decoded.email,
      favorite_team: decoded.favorite_team,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
};
