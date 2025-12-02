<template>
  <div class="match-wrapper">
    <!-- 왼쪽: 홈팀 라인업 -->
    <div class="lineup-panel">
      <h3>홈팀 라인업</h3>
      <div v-if="selectedMatch">
        <p class="team-name">{{ selectedMatch.teams.home.name }}</p>

        <ul>
          <li v-for="player in homeLineup" :key="player.id" class="player-item">
            <img :src="player.photo" class="face" />
            <span class="name">{{ player.name }}</span>
            <span class="pos">{{ player.pos }}</span>
          </li>
        </ul>
      </div>
      <p v-else>경기를 선택해주세요</p>
    </div>

    <!-- 중앙: 경기 일정 -->
    <div class="match-list-panel">

      <!-- 리그 선택 -->
      <div class="league-selector">
        <select v-model="selectedLeague" @change="fetchMatches">
          <option value="">전체 리그</option>
          <option value="PL">프리미어리그</option>
          <option value="PD">라리가</option>
          <option value="SA">세리에 A</option>
          <option value="BL1">분데스리가</option>
          <option value="FL1">리그 1</option>
          <option value="CL">챔피언스리그</option>
        </select>
      </div>

      <!-- 주차 이동 버튼 -->
      <div class="week-selector">
        <button class="arrow-btn" @click="prevWeek">◀ 이전 주</button>
        <span class="date-range">{{ formatDateRange(currentWeek) }}</span>
        <button class="arrow-btn" @click="nextWeek">다음 주 ▶</button>
      </div>

      <!-- 경기 리스트 -->
      <div 
        v-for="match in matches" 
        :key="match.fixture.id" 
        class="match-card"
        @click="selectMatch(match)"
      >
        <!-- 경기 날짜/시간 -->
        <div class="match-date">
          {{ formatMatchTime(match.fixture.date) }}
        </div>

        <!-- 팀 vs 팀 -->
        <div class="match-teams">
          <div class="team">
            <img :src="match.teams.home.logo" class="team-logo" />
            <span>{{ match.teams.home.name }}</span>
          </div>

          <span class="vs">
            <template v-if="match.goals.home !== null">
              {{ match.goals.home }} : {{ match.goals.away }}
            </template>
            <template v-else>
              vs
            </template>
          </span>

          <div class="team">
            <img :src="match.teams.away.logo" class="team-logo" />
            <span>{{ match.teams.away.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 오른쪽: 원정팀 라인업 -->
    <div class="lineup-panel">
      <h3>원정팀 라인업</h3>
      <div v-if="selectedMatch">
        <p class="team-name">{{ selectedMatch.teams.away.name }}</p>

        <ul>
          <li v-for="player in awayLineup" :key="player.id" class="player-item">
            • {{ player.name }}
          </li>
        </ul>
      </div>
      <p v-else>경기를 선택해주세요</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const selectedMatch = ref(null)
const matches = ref([])

const currentWeek = ref(new Date())

const selectedLeague = ref("")   // 추가된 상태 (리그 선택)

const homeLineup = ref([])
const awayLineup = ref([])

const formatDate = d => d.toISOString().split("T")[0]

const formatMatchTime = (isoString) => {
  const d = new Date(isoString)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}
  ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

const formatDateRange = (d) => {
  const start = new Date(d)
  const end = new Date(d)
  end.setDate(end.getDate() + 6)
  return `${formatDate(start)} ~ ${formatDate(end)}`
}

// 주차 이동
const prevWeek = () => {
  currentWeek.value = new Date(currentWeek.value.setDate(currentWeek.value.getDate() - 7))
  fetchMatches()
}

const nextWeek = () => {
  currentWeek.value = new Date(currentWeek.value.setDate(currentWeek.value.getDate() + 7))
  fetchMatches()
}

const selectMatch = async (match) => {
  selectedMatch.value = match;

  const fixtureId = match.fixture.id;

  try {
    const res = await fetch(`http://localhost:7070/api/soccer/lineup/${fixtureId}`);
    const lineup = await res.json();

    if (!Array.isArray(lineup) || lineup.length === 0) {
      homeLineup.value = [];
      awayLineup.value = [];
      return;
    }

    // lineup[0] = 홈팀, lineup[1] = 원정팀
    const home = lineup[0];
    const away = lineup[1];

    homeLineup.value = home.startXI.map(p => ({
      id: p.player.id,
      name: p.player.name,
      number: p.player.number,
      pos: p.player.pos,
      photo: p.player.photo
    }));

    awayLineup.value = away.startXI.map(p => ({
      id: p.player.id,
      name: p.player.name,
      number: p.player.number,
      pos: p.player.pos,
      photo: p.player.photo
    }));

  } catch (e) {
    console.error("라인업 로딩 실패:", e);
  }
};

// API 연동
const fetchMatches = async () => {
  const start = new Date(currentWeek.value)
  const end = new Date(currentWeek.value)
  end.setDate(end.getDate() + 6)

  const from = formatDate(start)
  const to = formatDate(end)

  console.log("요청 날짜 범위:", from, to)

  const leagueParam = selectedLeague.value ? `&league=${selectedLeague.value}` : ""

  try {
    const res = await fetch(
      `http://localhost:7070/api/soccer/matches?from=${from}&to=${to}${leagueParam}`
    )
    const data = await res.json()
    matches.value = data
  } catch (err) {
    console.error("경기 일정 로딩 실패:", err)
    matches.value = []
  }
}

onMounted(fetchMatches)
</script>

<style scoped>
.match-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  background: #111;
}

/* 공통 패널 */
.lineup-panel {
  width: 25%;
  background: #1d1d1d;
  padding: 16px;
  border-radius: 10px;
  color: #e0e0e0;
}

/* 리그 선택 */
.league-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.league-selector select {
  background: #1d1d1d;
  color: white;
  border: 1px solid #444;
  padding: 6px 10px;
  border-radius: 6px;
}

.week-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
}

.arrow-btn {
  background: #222;
  border: 1px solid #444;
  padding: 6px 12px;
  color: #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
}

.match-list-panel {
  width: 50%;
}

/* 경기 카드 UI */
.match-card {
  background: #1d1d1d;
  padding: 14px;
  margin-bottom: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.match-card:hover {
  background: #2a2a2a;
}

.match-date {
  font-size: 0.9rem;
  color: #a0a0a0;
  margin-bottom: 6px;
}

.match-teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team {
  display: flex;
  align-items: center;
  gap: 6px;
}

.team-logo {
  width: 22px;
  height: 22px;
}

.vs {
  font-weight: bold;
  font-size: 1.1rem;
}

</style>
