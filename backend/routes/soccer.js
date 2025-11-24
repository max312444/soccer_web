const express = require("express");
const router = express.Router();
const axios = require("axios");

// 확인용 로그
console.log("soccerRouter loaded!");

// 환경변수
const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = process.env.API_FOOTBALL_BASE_URL;

// axios 기본 설정
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-apisports-key": API_KEY,
  },
});

// =======================================
// 1) 팀 검색
// =======================================
router.get("/teams", async (req, res) => {
  const name = req.query.name;

  try {
    const response = await api.get("/teams", {
      params: { search: name },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Team API ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Team API error" });
  }
});

// =======================================
// 2) 선수 검색 (league + season 필수)
// =======================================
router.get("/players", async (req, res) => {
  const name = req.query.name;

  try {
    const response = await api.get("/players", {
      params: {
        search: name,
        league: 39,
        season: 2023,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Player API ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Player API error" });
  }
});

// =======================================
// 3) 팀 상세 정보
// =======================================
router.get("/team/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await api.get("/teams", {
      params: { id },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Team Detail ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Team detail error" });
  }
});

// =======================================
// 4) 선수 상세 정보
// =======================================
router.get("/player/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await api.get("/players", {
      params: {
        id,
        league: 39,
        season: 2023,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Player Detail ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Player detail error" });
  }
});

// =======================================
// 5) 팀 소속 선수 목록
// =======================================
router.get("/team/:id/players", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await api.get("/players", {
      params: {
        team: id,
        league: 39,      // 프리미어리그 (팀 따라 자동조정 가능)
        season: 2023,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Team Players ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Team players error" });
  }
});


module.exports = router;
