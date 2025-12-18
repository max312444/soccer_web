const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const authenticate = require("../lib/auth");

const TTL = 30 * 60 * 1000; // 30분

let newsCache = {
  data: null,
  fetchedAt: 0,
};

const fetchNewsFromAPI = async () => {
  const response = await axios.get(
    "https://newsapi.org/v2/everything",
    {
      params: {
        q: `
          football OR soccer OR
          Premier League OR La Liga OR Serie A OR Bundesliga OR Ligue 1 OR
          Champions League OR Europa League
        `,
        language: "en",
        sortBy: "popularity",
        pageSize: 30,
        apiKey: process.env.NEWS_API_KEY,
      },
    }
  );

  return response.data.articles || [];
};

router.get("/", authenticate, async (req, res) => {
  try {
    const now = Date.now();

    // 캐시 확인
    if (!newsCache.data || now - newsCache.fetchedAt > TTL) {
      const articles = await fetchNewsFromAPI();
      newsCache = {
        data: articles,
        fetchedAt: now,
      };
    }

    // 로그인 유저 선호 팀 (JWT payload에서 옴)
    const favoriteTeam = req.user?.favorite_team;

    let pinned = [];
    let rest = [...newsCache.data];

    // 선호 팀 뉴스 상단 고정
    if (favoriteTeam) {
      pinned = rest
        .filter(article =>
          article.title &&
          article.title.toLowerCase().includes(
            favoriteTeam.toLowerCase()
          )
        )
        .slice(0, 3);

      rest = rest.filter(article => !pinned.includes(article));
    }

    // 일반 뉴스
    const list = rest.slice(0, 10);

    return res.json({
      pinned,
      list,
    });

  } catch (err) {
    console.error("뉴스 API 에러:", err);
    return res.status(500).json({
      error: "뉴스를 불러오는 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
