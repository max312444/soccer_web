const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const newsRouter = require("./routes/news");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/news", newsRouter);

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
