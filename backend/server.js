require("dotenv").config(); // 반드시 최상단

const express = require("express");
const cors = require("cors");

// 라우터 임포트
const authRouter = require("./routes/auth");
const favoritesRouter = require("./routes/favorites");
const meRouter = require("./routes/me");
const soccerRouter = require("./routes/soccer");

const app = express();

// 포트 충돌 방지 → 7070 고정
const PORT = 7070;

// 미들웨어
app.use(cors());
app.use(express.json());

// 루트 테스트용 엔드포인트 (서버 살아있는지 확인하기 위해 추가)
app.get("/", (req, res) => {
  res.send("OK");
});

// API 라우트 설정
app.use("/api/auth", authRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/me", meRouter);
app.use("/soccer", soccerRouter);

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
