const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 3600 });
console.log("soccerRouter loaded with caching!");

/* =======================================
   1) FOOTBALL-DATA (무료 경기 일정)
======================================= */
const API_TOKEN =
  process.env.FOOTBALL_DATA_API_KEY ||
  process.env.FOOTBALL_API_KEY ||
  process.env.API_TOKEN ||
  process.env.SOCCER_API_TOKEN;

if (!API_TOKEN) {
  console.error("[ERROR] Football-Data API KEY is missing!");
}

const api = axios.create({
  baseURL: "https://api.football-data.org/v4",
  headers: { "X-Auth-Token": API_TOKEN },
});

/* 리그 코드(무료 경기일정 필터용) */
const COMMON_LEAGUE_CODES = ["PL", "BL1", "SA", "PD", "FL1"];

/* =======================================
   2) 리그 정보 조회
======================================= */
router.get("/competition", async (req, res) => {
  const { league } = req.query;

  if (!league) return res.status(400).json({ error: "League is required" });

  try {
    const response = await api.get(`/competitions/${league}`);
    res.json(response.data);
  } catch (err) {
    console.error("Competition ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Competition API error" });
  }
});

/* =======================================
   3) 팀 검색
======================================= */
router.get("/teams", async (req, res) => {
  const name = (req.query.name || "").toLowerCase();
  const cacheKey = `teams-${name}`;
  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    let allTeams = [];

    for (const code of COMMON_LEAGUE_CODES) {
      const r = await api.get(`/competitions/${code}/teams`);
      if (r.data?.teams) allTeams.push(...r.data.teams);
    }

    const filtered = allTeams.filter(
      (t) =>
        t.name.toLowerCase().includes(name) ||
        (t.shortName && t.shortName.toLowerCase().includes(name))
    );

    const result = filtered.map((t) => ({
      id: t.id,
      name: t.name,
      logo: t.crest,
    }));

    cache.set(cacheKey, result, 1800);
    res.json(result);
  } catch (err) {
    console.error("Team search ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Team search failed" });
  }
});

/* =======================================
   4) 팀 상세 정보
======================================= */
router.get("/team/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `team-${id}`;

  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    const r = await api.get(`/teams/${id}`);
    const team = {
      id: r.data.id,
      name: r.data.name,
      logo: r.data.crest,
    };

    cache.set(cacheKey, team);
    res.json(team);
  } catch (err) {
    console.error("Team detail ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Team detail failed" });
  }
});

/* =======================================
   5) 팀 스쿼드 (이건 유지)
======================================= */
router.get("/team/:id/squad", async (req, res) => {
  const { id } = req.params;

  try {
    const r = await api.get(`/teams/${id}`);
    const squad = r.data.squad;

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

    res.json(grouped);
  } catch (err) {
    console.error("Squad ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Squad fetch failed" });
  }
});

/* =======================================
   6) 리그 순위
======================================= */
router.get("/standings", async (req, res) => {
  const { league, season } = req.query;

  if (!league || !season)
    return res.status(400).json({ error: "league, season required" });

  try {
    const r = await api.get(`/competitions/${league}/standings`);
    const total = r.data.standings.find((s) => s.type === "TOTAL");

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

    res.json(standings);
  } catch (err) {
    console.error("Standings ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Standings fetch failed" });
  }
});

/* =======================================
   7) 경기 일정 (무료 Football-Data)
======================================= */
router.get("/matches", async (req, res) => {
  const { from, to, league } = req.query;

  if (!from || !to)
    return res.status(400).json({ error: "from, to required" });

  const cacheKey = `matches-${from}-${to}-${league || "ALL"}`;
  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    const url = `/matches?dateFrom=${from}&dateTo=${to}`;
    const r = await api.get(url);

    let list = r.data.matches;

    if (league) {
      list = list.filter((m) => m.competition?.code === league);
    }

    const matches = list.map((m) => ({
      fixture: { id: m.id, date: m.utcDate },
      league: {
        id: m.competition?.id,
        name: m.competition?.name,
        code: m.competition?.code,
      },
      teams: {
        home: {
          id: m.homeTeam.id,
          name: m.homeTeam.name,
          logo: m.homeTeam.crest,
        },
        away: {
          id: m.awayTeam.id,
          name: m.awayTeam.name,
          logo: m.awayTeam.crest,
        },
      },
      goals: {
        home: m.score.fullTime.home,
        away: m.score.fullTime.away,
      },
    }));

    cache.set(cacheKey, matches, 600);
    res.json(matches);
  } catch (err) {
    console.error("Matches ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Matches load failed" });
  }
});

/* ======================================= */
module.exports = router;
