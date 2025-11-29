const express = require("express");
const router = express.Router();
const Parser = require("rss-parser");
const NodeCache = require("node-cache");

// 뉴스 캐시는 15분(900초)으로 짧게 설정
const cache = new NodeCache({ stdTTL: 900 });
const parser = new Parser();

const BBC_NEWS_URL = "http://feeds.bbci.co.uk/sport/football/rss.xml";

router.get("/", async (req, res) => {
  const cacheKey = "bbc-football-news";

  if (cache.has(cacheKey)) {
    console.log("[Cache HIT] /news");
    return res.json(cache.get(cacheKey));
  }
  console.log("[Cache MISS] /news");

  try {
    const feed = await parser.parseURL(BBC_NEWS_URL);

    // 프론트엔드에서 사용하기 좋은 형태로 데이터를 간소화
    const items = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      snippet: item.contentSnippet,
      thumbnail: item.enclosure?.url || null // 썸네일 이미지가 있는 경우
    }));

    cache.set(cacheKey, items);
    res.json(items);

  } catch (err) {
    console.error("Failed to parse RSS feed:", err);
    res.status(500).json({ error: "Failed to get news feed" });
  }
});

module.exports = router;
