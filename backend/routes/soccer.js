const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 3600 });
console.log("soccerRouter loaded with caching!");

// =======================================
// API KEY 로딩
// =======================================
const API_TOKEN =
  process.env.FOOTBALL_DATA_API_KEY ||
  process.env.FOOTBALL_API_KEY ||
  process.env.API_TOKEN ||
  process.env.SOCCER_API_TOKEN;

if (!API_TOKEN) {
  console.error("[ERROR] Football Data API KEY is missing (.env 확인 필요)");
}

const BASE_URL = "https://api.football-data.org/v4";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "X-Auth-Token": API_TOKEN },
});

// =======================================
// API-FOOTBALL 추가 (라인업/스쿼드용)
// =======================================
const apiFootball = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: {
    "x-apisports-key": process.env.API_FOOTBALL_KEY,
  },
});


// 조회할 주요 리그 Code
const COMMON_LEAGUE_CODES = ["PL", "BL1", "SA", "PD", "FL1"];

// =======================================
// 0) 리그 정보 (현재 시즌 확인용)
// =======================================
router.get("/competition", async (req, res) => {
  const { league } = req.query;

  if (!league) {
    return res.status(400).json({ error: "League is required" });
  }

  try {
    const response = await api.get(`/competitions/${league}`);
    res.json(response.data);
  } catch (err) {
    console.error("Competition API ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Competition API error" });
  }
});

// =======================================
// 1) 팀 검색 (고효율 캐싱 적용)
// =======================================
router.get("/teams", async (req, res) => {
  const name = req.query.name ? req.query.name.toLowerCase() : "";
  const searchCacheKey = `teams-search-${name}`;

  if (!API_TOKEN) {
    return res.status(500).json({ error: "API key is missing" });
  }

  if (cache.has(searchCacheKey)) {
    return res.json(cache.get(searchCacheKey));
  }

  try {
    let allTeams = [];
    const leagueCacheKey = "all-leagues-team-list";

    if (cache.has(leagueCacheKey)) {
      allTeams = cache.get(leagueCacheKey);
    } else {
      for (const code of COMMON_LEAGUE_CODES) {
        const response = await api.get(`/competitions/${code}/teams`);
        if (response.data?.teams) {
          allTeams = allTeams.concat(response.data.teams);
        }
      }
      cache.set(leagueCacheKey, allTeams, 60 * 60 * 6);
    }

    const filtered = allTeams.filter((team) =>
      team.name.toLowerCase().includes(name) ||
      (team.shortName && team.shortName.toLowerCase().includes(name))
    );

    const result = Array.from(
      new Map(
        filtered.map((team) => [
          team.id,
          { id: team.id, name: team.name, logo: team.crest },
        ])
      ).values()
    );

    cache.set(searchCacheKey, result, 60 * 30);
    res.json(result);
  } catch (err) {
    console.error("Team API ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Team API error" });
  }
});

// =======================================
// 2) 선수 검색 (지원 안함)
// =======================================
router.get("/players", (req, res) => {
  res.status(501).json({ error: "Player search is not supported." });
});

// =======================================
// 3) 팀 상세 정보
// =======================================
router.get("/team/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `team-detail-${id}`;

  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    const response = await api.get(`/teams/${id}`);
    const team = {
      id: response.data.id,
      name: response.data.name,
      logo: response.data.crest,
    };
    cache.set(cacheKey, team);
    res.json(team);
  } catch (err) {
    console.error("Team Detail ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Team detail error" });
  }
});

// =======================================
// 4) 선수 상세 정보 (지원 안함)
// =======================================
router.get("/player/:id", (req, res) => {
  res.status(501).json({ error: "Player detail is not supported." });
});

// =======================================
// 5) 팀 소속 선수 목록
// =======================================
router.get("/team/:id/players", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `team-players-${id}`;

  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    const response = await api.get(`/teams/${id}`);
    const players = response.data.squad.map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      nationality: p.nationality,
    }));

    cache.set(cacheKey, players);
    res.json(players);
  } catch (err) {
    console.error("Team Players ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Team players error" });
  }
});

// =======================================
// 6) 리그 순위
// =======================================
router.get("/standings", async (req, res) => {
  const { league, season } = req.query;
  const cacheKey = `standings-${league}-${season}`;

  if (!league || !season) {
    return res.status(400).json({ error: "League and season are required" });
  }

  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    const response = await api.get(`/competitions/${league}/standings`);

    const total = response.data.standings.find((s) => s.type === "TOTAL");

    const standings = total.table.map((t) => ({
      rank: t.position,
      team: {
        id: t.team.id,
        name: t.team.name,
        logo: t.team.crest,
      },
      all: {
        played: t.playedGames,
        win: t.won,
        draw: t.draw,
        lose: t.lost,
      },
      goalsDiff: t.goalDifference,
      points: t.points,
    }));

    cache.set(cacheKey, standings);
    res.json(standings);
  } catch (err) {
    console.error("Standings ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Standings error" });
  }
});

// =======================================
// 7) 팀 스쿼드 (포지션별)
// =======================================
router.get("/team/:id/squad", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `team-squad-${id}`;

  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    const response = await api.get(`/teams/${id}`);
    const squad = response.data.squad;

    const grouped = { GK: [], DF: [], MF: [], FW: [], UNKNOWN: [] };

    squad.forEach((p) => {
      const pos = p.position || "UNKNOWN";
      const photo = `https://media.api-sports.io/football/players/${p.id}.png`;

      const info = {
        id: p.id,
        name: p.name,
        position: pos,
        nationality: p.nationality,
        photo,
      };

      if (grouped[pos]) grouped[pos].push(info);
      else grouped.UNKNOWN.push(info);
    });

    cache.set(cacheKey, grouped);
    res.json(grouped);
  } catch (err) {
    console.error("Squad API ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Squad fetch error" });
  }
});

// =======================================
// 8) 날짜 범위 + 리그 필터 포함 경기 일정
// =======================================
router.get("/matches", async (req, res) => {
  const { from, to, league } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      error: "from, to 날짜가 필요합니다. 예: /matches?from=2024-02-01&to=2024-02-07",
    });
  }

  const cacheKey = `matches-${from}-${to}-${league || "ALL"}`;

  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    const url = `/matches?dateFrom=${from}&dateTo=${to}`;
    const response = await api.get(url);

    let matchList = response.data.matches;

    if (league) {
      matchList = matchList.filter((m) => m.competition?.code === league);
    }

    const matches = matchList.map((m) => ({
      fixture: { id: m.id, date: m.utcDate },
      teams: {
        home: {
          id: m.homeTeam.id,
          name: m.homeTeam.name,
          logo: m.homeTeam.crest,       // ← 공식 로고 사용 (로고 정상화)
        },
        away: {
          id: m.awayTeam.id,
          name: m.awayTeam.name,
          logo: m.awayTeam.crest,       // ← 공식 로고 사용
        },
      },
      goals: {
        home: m.score.fullTime.home,
        away: m.score.fullTime.away,
      },
    }));

    cache.set(cacheKey, matches, 60 * 10);
    res.json(matches);
  } catch (err) {
    console.error("Matches API ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to load matches" });
  }
});

// =======================================
// 9) API-Football 라인업 가져오기
// =======================================
router.get("/lineup/:fixtureId", async (req, res) => {
  const { fixtureId } = req.params;
  const cacheKey = `lineup-${fixtureId}`;

  if (cache.has(cacheKey)) {
    console.log("[CACHE HIT] 라인업:", fixtureId);
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await apiFootball.get(`/fixtures/lineups?fixture=${fixtureId}`);
    const data = response.data.response;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "라인업이 아직 제공되지 않았습니다." });
    }

    cache.set(cacheKey, data, 60 * 30); // 30분 캐시
    res.json(data);

  } catch (err) {
    console.error("Lineup API ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to load lineup" });
  }
});

module.exports = router;
