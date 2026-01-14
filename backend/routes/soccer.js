const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");

const authenticate = require("../lib/auth");

const cache = new NodeCache({ stdTTL: 3600 });
console.log("soccerRouter loaded with caching!");

router.use(authenticate);

/* =======================================
   FOOTBALL-DATA API 설정
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

/* =======================================
   API-Football 설정 (경기 이벤트용)
======================================= */
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;

if (!API_FOOTBALL_KEY) {
  console.error("[ERROR] API-Football API KEY is missing!");
}

const apiFootball = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: {
    "x-apisports-key": API_FOOTBALL_KEY,
  },
});

/* 무료 제공되는 주요 리그 코드 */
const COMMON_LEAGUE_CODES = ["PL", "BL1", "SA", "PD", "FL1"];

/* =======================================
   1) 리그 정보 조회 (CACHE 추가)
======================================= */
router.get("/competition", async (req, res) => {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "League is required" });

  const cacheKey = `competition-${league}`;
  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    const response = await api.get(`/competitions/${league}`);
    cache.set(cacheKey, response.data, 3600);
    res.json(response.data);
  } catch (err) {
    console.error("Competition ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Competition API error" });
  }
});

/* =======================================
   2) 팀 검색
======================================= */
router.get("/teams", async (req, res) => {
  const name = (req.query.name || "").toLowerCase();
  const context = req.query.context;

  // 로그인 예외는 회원가입 컨텍스트에서만 허용
  if (!req.user && context !== "signup") {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }

  // 회원가입 컨텍스트 제한 (리소스 보호)
  if (context === "signup" && name.length < 2) {
    return res.status(400).json({
      error: "검색어는 2자 이상 입력해주세요.",
    });
  }

  const cacheKey = `teams-${context || "auth"}-${name}`;
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    let allTeams = [];

    for (const code of COMMON_LEAGUE_CODES) {
      const r = await api.get(`/competitions/${code}/teams`);
      if (r.data?.teams) {
        allTeams.push(...r.data.teams);
      }
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
   3) 팀 상세 조회 (football-data)
======================================= */
router.get("/team/detail", async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "team id is required" });
  }

  const cacheKey = `detail-team-${id}`;
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const r = await api.get(`/teams/${id}`);
    const t = r.data;

    const detail = {
      team: {
        id: t.id,
        name: t.name,
        shortName: t.shortName,
        logo: t.crest,
        country: t.area?.name,
        founded: t.founded,
        website: t.website,
        clubColors: t.clubColors,
      },
      venue: {
        name: t.venue,
      },
      competitions: t.runnigCompetitions?.map(c => ({
        id: c.id,
        name: c.name,
        code: c.code,
      })),
    };

    cache.set(cacheKey, detail, 1800);
    res.json(detail);
  } catch (err) {
    console.error("Team detail ERROR:", err.response?.data || err.message);
    res.status(404).json({ error: "team not found" });
  }
});

/* =======================================
   3-1) 프로필용 팀 조회 (football-data)
======================================= */
router.get("/team/profile", async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "team id is required" });
  }

  const cacheKey = `profile-team-${id}`;
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const r = await api.get(`/teams/${id}`);
    const t = r.data;

    const team = {
      id: t.id,
      name: t.name,
      logo: t.crest,
      country: t.area?.name,
      founded: t.founded,
    };

    cache.set(cacheKey, team, 3600);
    res.json(team);
  } catch (err) {
    console.error("Profile team ERROR:", err.response?.data || err.message);
    res.status(404).json({ error: "team not found" });
  }
});

/* =======================================
   4) 순위표
======================================= */
router.get("/standings", async (req, res) => {
  const { league, season } = req.query;
  if (!league || !season)
    return res.status(400).json({ error: "league, season required" });

  const cacheKey = `standings-${league}-${season}`;
  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

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

    cache.set(cacheKey, standings, 300);
    res.json(standings);
  } catch (err) {
    console.error("Standings ERROR:", err);
    res.status(500).json({ error: "Standings fetch failed" });
  }
});

/* =======================================
   5) 경기 일정
======================================= */
router.get("/matches", async (req, res) => {
  const { from, to, league } = req.query;
  if (!from || !to)
    return res.status(400).json({ error: "from, to required" });

  const cacheKey = `matches-${from}-${to}-${league || "ALL"}`;
  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    const r = await api.get(`/matches?dateFrom=${from}&dateTo=${to}`);
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
    console.error("Matches ERROR:", err);
    res.status(500).json({ error: "Matches load failed" });
  }
});

/* =======================================
   6) 사이드바용 리그별 1위
======================================= */
const POPULAR_LEAGUES = [
  { code: "PL", name: "Premier League" },
  { code: "PD", name: "La Liga" },
  { code: "SA", name: "Serie A" },
  { code: "BL1", name: "Bundesliga" },
  { code: "FL1", name: "Ligue 1" },
];

router.get("/side-rankings", async (req, res) => {
  const cacheKey = "side-rankings";
  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    const result = [];

    for (const league of POPULAR_LEAGUES) {
      try {
        const r = await api.get(`/competitions/${league.code}/standings`);
        const total = r.data.standings.find((s) => s.type === "TOTAL");
        if (!total || !total.table.length) continue;

        const first = total.table[0];
        result.push({
          leagueName: league.name,
          teamName: first.team.name,
          teamLogo: first.team.crest,
          points: first.points,
        });
      } catch {
        continue;
      }
    }

    cache.set(cacheKey, result, 600);
    res.json(result);
  } catch (err) {
    console.error("Side rankings ERROR:", err);
    res.status(500).json({ error: "Side rankings failed" });
  }
});

/* =======================================
   7) 경기 이벤트 (API-Football)
======================================= */
router.get("/match/:id/events", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `match-events-bridge-${id}`;

  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    // 1. football-data.org에서 경기 정보 가져오기
    const matchDetails = await api.get(`/matches/${id}`);
    const match = matchDetails.data;
    const matchDate = match.utcDate.split("T")[0]; // YYYY-MM-DD 형식
    
    const homeTeamName = match.homeTeam.name;
    const awayTeamName = match.awayTeam.name;

    // 2. api-football에서 팀 ID 찾기 (캐시 활용)
    const findTeamId = async (teamName) => {
      const teamNameMapping = {
        "FC": "",
        "AFC": "",
        "United": "",
        "Hotspur": "Tottenham"
      };

      let mappedTeamName = teamName;
      for (const key in teamNameMapping) {
        if (teamName.includes(key)) {
          mappedTeamName = teamNameMapping[key] || teamName.replace(key, "").trim();
        }
      }

      const teamCacheKey = `apifootball-team-id-${mappedTeamName.replace(/\s/g, "")}`;
      if (cache.has(teamCacheKey)) return cache.get(teamCacheKey);
      
      const r = await apiFootball.get("/teams", { params: { name: mappedTeamName } });
      const teams = r.data.response;
      if (!teams || teams.length === 0) {
        throw new Error(`Could not find team ID for ${mappedTeamName} on api-football`);
      }

      const exactMatch = teams.find(t => t.team.name.toLowerCase() === mappedTeamName.toLowerCase());
      const team = exactMatch ? exactMatch.team : teams[0]?.team;

      if (!team) throw new Error(`Could not find team ID for ${mappedTeamName} on api-football`);
      
      cache.set(teamCacheKey, team.id);
      return team.id;
    };

    const homeTeamId = await findTeamId(homeTeamName);
    const awayTeamId = await findTeamId(awayTeamName);

    // 3. api-football에서 경기(fixture) ID 찾기
    const fixtureCacheKey = `apifootball-fixture-${homeTeamId}-${awayTeamId}-${matchDate}`;
    let fixtureId;

    if (cache.has(fixtureCacheKey)) {
      fixtureId = cache.get(fixtureCacheKey);
    } else {
      // api-football에서 해당 날짜에 열린 경기를 모두 가져와서 home/away team id가 일치하는 경기를 찾는다.
      // 이렇게 하면 유스팀 경기 등 관련 없는 경기를 필터링할 수 있다.
      const fixturesResponse = await apiFootball.get("/fixtures", {
        params: { date: matchDate, team: homeTeamId },
      });
      
      const foundFixture = fixturesResponse.data.response.find(
        (f) => f.teams.home.id === homeTeamId && f.teams.away.id === awayTeamId
      );

      if (foundFixture) {
        fixtureId = foundFixture.fixture.id;
      } else {
        // 만약 homeTeamId로 찾았는데도 경기가 없다면, awayTeamId로 다시 한번 찾아본다.
        // 데이터 소스에 따라 홈/어웨이가 다르게 기록될 수 있는 엣지 케이스를 대비.
         const fixturesResponseAway = await apiFootball.get("/fixtures", {
            params: { date: matchDate, team: awayTeamId },
         });
         const foundFixtureAway = fixturesResponseAway.data.response.find(
            (f) => f.teams.home.id === homeTeamId && f.teams.away.id === awayTeamId
         );
         if(foundFixtureAway) {
            fixtureId = foundFixtureAway.fixture.id;
         }
      }
      
      if (!fixtureId) {
        throw new Error(`Could not find fixture on api-football for ${homeTeamName} vs ${awayTeamName} on ${matchDate}`);
      }
      cache.set(fixtureCacheKey, fixtureId);
    }

    // 4. api-football에서 경기 이벤트 가져오기
    const eventsResponse = await apiFootball.get("/fixtures/events", {
      params: { fixture: fixtureId },
    });

    const events = eventsResponse.data.response.map((e) => ({
      minute: e.time.elapsed,
      extra: e.time.extra,
      type: e.type,
      detail: e.detail,
      team: e.team.name,
      player: e.player.name,
      assist: e.assist?.name || null,
    }));

    cache.set(cacheKey, events, 600); // 최종 결과 캐시
    res.json(events);

  } catch (err) {
    console.error("Match events bridge ERROR:", err.message);
    res.status(500).json({ error: "Match events fetch failed. " + err.message });
  }
});

module.exports = router;
