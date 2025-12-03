require("dotenv").config(); // .env 로딩 (최상단 필수)

const express = require("express");
const cors = require("cors");
const app = express();

// ---------------------
// 환경 변수
// ---------------------
const PORT = process.env.PORT || 7070;

// ---------------------
// 미들웨어
// ---------------------
app.use(cors());
app.use(express.json());

// ---------------------
// 라우터
// ---------------------
const authRouter = require("./routes/auth");
const favoritesRouter = require("./routes/favorites");
const meRouter = require("./routes/me");
const soccerRouter = require("./routes/soccer");
const newsRouter = require("./routes/news");

// 상태 체크용 엔드포인트
app.get("/", (req, res) => {
  res.send("OK");
});

// ---------------------
// 실제 API 경로 설정
// ---------------------
app.use("/api/auth", authRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/me", meRouter);
app.use("/soccer", soccerRouter);
app.use("/api/news", newsRouter);

// ---------------------
// 서버 시작
// ---------------------
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
