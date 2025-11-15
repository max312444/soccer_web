const express = require('express');
const router = express.Router();
const axios = require("axios");

// 환경변수 로드
const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = process.env.API_FOOTBALL_BASE_URL;

// 디버그 로그 (값 확인)
console.log("API_KEY =", JSON.stringify(API_KEY));
console.log("BASE_URL =", BASE_URL);

// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-apisports-key": API_KEY,
  },
});

// 팀 검색 API
router.get("/teams", async (req, res) => {
  try {
    const name = req.query.name;
    const response = await api.get("/teams", { params: { search: name } });
    res.json(response.data);
  } catch (err) {
    console.error("API ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "API error" });
  }
});

// 선수 검색 API
router.get("/players", async (req, res) => {
  try {
    const name = req.query.name;
    const response = await api.get("/players", {
      params: { search: name, season: 2023 },
    });
    res.json(response.data);
  } catch (err) {
    console.error("API ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "API error" });
  }
});

module.exports = router;
