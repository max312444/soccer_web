const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// 라우터 임포트
const authRouter = require("./routes/auth");
const favoritesRouter = require("./routes/favorites");
const meRouter = require("./routes/me");
const soccerRouter = require("./routes/soccer");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API 라우트 설정
app.use("/api/auth", authRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/me", meRouter);
app.use("/api/soccer", soccerRouter);

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
