const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 3600 }); // 1시간 캐시
console.log("soccerRouter loaded with caching!");

const API_TOKEN = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = "https://api.football-data.org/v4";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "X-Auth-Token": API_TOKEN },
});

const COMMON_LEAGUE_CODES = ["PL", "BL1", "SA", "PD", "FL1"];

// =======================================
// 1) 팀 검색 (디버깅 로그 추가)
// =======================================
router.get("/teams", async (req, res) => {
  const name = req.query.name ? req.query.name.toLowerCase() : "";
  // 디버깅을 위해 일시적으로 캐시 비활성화
  // const cacheKey = `teams-search-v2-${name}`;
  // if (cache.has(cacheKey)) { ... }

  console.log(`[DEBUG] /teams?name=${name}`);

  if (!API_TOKEN) {
    return res.status(500).json({ error: "API key is not set for football-data.org" });
  }

  try {
    let allTeams = [];
    for (const leagueCode of COMMON_LEAGUE_CODES) {
      const response = await api.get(`/competitions/${leagueCode}/teams`);
      if (response.data && response.data.teams) {
        allTeams = allTeams.concat(response.data.teams);
      }
    }

    // =================================================================
    // =========== 디버깅을 위한 로그: API에서 가져온 전체 팀 목록 출력 ==========
    // =================================================================
    console.log("=========== ALL TEAMS FROM API (DEBUG) ===========");
    console.log(JSON.stringify(allTeams, null, 2));
    console.log("==================================================");


    const filteredTeams = allTeams.filter(team => 
      team.name.toLowerCase().includes(name) || (team.shortName && team.shortName.toLowerCase().includes(name))
    );

    const uniqueTeams = Array.from(new Map(filteredTeams.map(team => [team.id, {
      id: team.id,
      name: team.name,
      logo: team.crest,
    }])).values());

    // cache.set(cacheKey, uniqueTeams);
    res.json(uniqueTeams);
  } catch (err) {
    console.error("Team API ERROR (football-data.org):", err.response?.data || err.message);
    res.status(500).json({ error: "Team API error" });
  }
});

// ... (이하 나머지 코드는 동일) ...
// =======================================
// 2) 선수 검색 (지원 안함)
// =======================================
router.get("/players", (req, res) => {
  res.status(501).json({ error: "Player search is not supported." });
});

// =======================================
// 3) 팀 상세 정보 (단순화된 응답 구조)
// =======================================
router.get("/team/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `team-detail-v2-${id}`;

  if (cache.has(cacheKey)) {
    console.log(`[Cache HIT] /team/${id}`);
    return res.json(cache.get(cacheKey));
  }
  console.log(`[Cache MISS] /team/${id}`);

  if (!API_TOKEN) {
    return res.status(500).json({ error: "API key is not set for football-data.org" });
  }

  try {
    const response = await api.get(`/teams/${id}`);
    const teamData = {
      id: response.data.id,
      name: response.data.name,
      logo: response.data.crest,
      // ... 기타 필요한 정보 추가
    };
    cache.set(cacheKey, teamData);
    res.json(teamData); // 바로 팀 객체 반환
  } catch (err) {
    console.error("Team Detail ERROR (football-data.org):", err.response?.data || err.message);
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
// 5) 팀 소속 선수 목록 (단순화된 응답 구조)
// =======================================
router.get("/team/:id/players", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `team-players-v2-${id}`;

  if (cache.has(cacheKey)) {
    console.log(`[Cache HIT] /team/${id}/players`);
    return res.json(cache.get(cacheKey));
  }
  console.log(`[Cache MISS] /team/${id}/players`);

  if (!API_TOKEN) {
    return res.status(500).json({ error: "API key is not set" });
  }

  try {
    const response = await api.get(`/teams/${id}`); // squad 정보는 team 상세에 포함됨
    const players = response.data.squad.map(player => ({
      id: player.id,
      name: player.name,
      position: player.position,
      nationality: player.nationality,
    }));
    cache.set(cacheKey, players);
    res.json(players); // 바로 선수 배열 반환
  } catch (err) {
    console.error("Team Players ERROR (football-data.org):", err.response?.data || err.message);
    res.status(500).json({ error: "Team players error" });
  }
});


// =======================================
// 6) 리그 순위 정보
// =======================================
router.get("/standings", async (req, res) => {
  const { league, season } = req.query;
  const cacheKey = `standings-v2-${league}-${season}`;

  if (!league || !season) {
    return res.status(400).json({ error: "League and season are required" });
  }
  
  if (cache.has(cacheKey)) {
    console.log(`[Cache HIT] /standings?league=${league}&season=${season}`);
    return res.json(cache.get(cacheKey));
  }
  console.log(`[Cache MISS] /standings?league=${league}&season=${season}`);

  if (!API_TOKEN) {
    return res.status(500).json({ error: "API key is not set for football-data.org" });
  }

  try {
    const response = await api.get(`/competitions/${league}/standings`);
    const currentStandings = response.data.standings.find(s => s.type === 'TOTAL');
    
    const transformedStandings = currentStandings.table.map(teamStanding => ({
        rank: teamStanding.position,
        team: {
            id: teamStanding.team.id,
            name: teamStanding.team.name,
            logo: teamStanding.team.crest,
        },
        all: {
            played: teamStanding.playedGames,
            win: teamStanding.won,
            draw: teamStanding.draw,
            lose: teamStanding.lost,
        },
        goalsDiff: teamStanding.goalDifference,
        points: teamStanding.points,
    }));

    cache.set(cacheKey, transformedStandings);
    res.json(transformedStandings);
  } catch (err) {
    console.error("Standings API ERROR (football-data.org):", err.response?.data || err.message);
    res.status(500).json({ error: "Standings API error" });
  }
});

module.exports = router;
