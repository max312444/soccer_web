const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY = process.env.GNEWS_API_KEY;
const NEWS_API_URL = `https://gnews.io/api/v4/top-headlines?lang=ko&max=6&token=${API_KEY}`;

router.get("/", async (req, res) => {
    try {
        const response = await axios.get(NEWS_API_URL);
        res.json(response.data);
    } catch (error) {
        console.error("뉴스 API 호출 오류:", error.message);
        res.status(500).json({ error: "뉴스를 불러오지 못했습니다." });
    }
});

module.exports = router;
