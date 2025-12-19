const express = require("express");
const router = express.Router();
const Parser = require("rss-parser");
require("dotenv").config();

const authenticate = require("../lib/auth");

const parser = new Parser();

const TTL = 30 * 60 * 1000; // 30분

let newsCache = {
  data: null,
  fetchedAt: 0,
};

// BBC Football RSS
const RSS_URL = "https://feeds.bbci.co.uk/sport/football/rss.xml";

const fetchRssNews = async () => {
  const feed = await parser.parseURL(RSS_URL);

  return feed.items.map(item => ({
    title: item.title,
    url: item.link,
    publishedAt: item.pubDate,
    description: item.contentSnippet || "",
  }));
};

// 🔥 authenticate 제거
router.get("/", async (req, res) => {
  try {
    const now = Date.now();

    // 캐시
    if (!newsCache.data || now - newsCache.fetchedAt > TTL) {
      const articles = await fetchRssNews();
      newsCache = {
        data: articles,
        fetchedAt: now,
      };
    }

    // 🔥 토큰이 있으면 사용자 정보만 선택적으로 파싱
    let user = null;
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const fakeReq = { headers: { authorization: authHeader } };
        authenticate(fakeReq, {}, () => {
          user = fakeReq.user;
        });
      } catch {
        user = null;
      }
    }

    const favoriteTeam = user?.favorite_team;

    let pinned = [];
    let rest = [...newsCache.data];

    // 선호 팀 뉴스 필터링 (로그인 한 경우만)
    if (favoriteTeam) {
      const keyword = favoriteTeam.toLowerCase();

      pinned = rest
        .filter(article =>
          article.title.toLowerCase().includes(keyword) ||
          article.description.toLowerCase().includes(keyword)
        )
        .slice(0, 3);

      rest = rest.filter(article => !pinned.includes(article));
    }

    const list = rest.slice(0, 10);

    return res.json({
      pinned,
      list,
    });

  } catch (err) {
    console.error("RSS 뉴스 에러:", err.message);
    return res.status(500).json({
      error: "뉴스를 불러오는 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
