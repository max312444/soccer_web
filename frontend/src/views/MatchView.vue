<template>
  <div class="match-wrapper">
    <!-- 왼쪽: 홈 팀 라인업 -->
    <div class="lineup-panel">
      <h3>홈팀 라인업</h3>
      <div v-if="selectedMatch">
        <p>{{ selectedMatch.teams.home.name }}</p>
        <ul>
          <li v-for="player in homeLineup" :key="player.id">{{ player.name }}</li>
        </ul>
      </div>
      <p v-else>경기를 선택해주세요</p>
    </div>

    <!-- 중앙: 경기 일정 -->
    <div class="match-list-panel">
      <div class="week-selector">
        <button @click="prevWeek">←</button>
        <span>{{ formatDateRange(currentWeek) }}</span>
        <button @click="nextWeek">→</button>
      </div>

      <div v-for="match in matches" :key="match.fixture.id" class="match-card" @click="selectMatch(match)">
        <div class="team">
          <img :src="match.teams.home.logo" class="team-logo" />
          <span>{{ match.teams.home.name }}</span>
        </div>
        <span class="vs">
          <template v-if="match.goals.home !== null && match.goals.away !== null">
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

    <!-- 오른쪽: 어웨이 팀 라인업 -->
    <div class="lineup-panel">
      <h3>원정팀 라인업</h3>
      <div v-if="selectedMatch">
        <p>{{ selectedMatch.teams.away.name }}</p>
        <ul>
          <li v-for="player in awayLineup" :key="player.id">{{ player.name }}</li>
        </ul>
      </div>
      <p v-else>경기를 선택해주세요</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 상태
const selectedMatch = ref(null)
const matches = ref([])

// 현재 주차 날짜 기준
const currentWeek = ref(new Date())

// 라인업
const homeLineup = ref([])
const awayLineup = ref([])

// 날짜 포맷
const formatDate = (d) => d.toISOString().split('T')[0]
const formatDateRange = (d) => {
  const start = new Date(d)
  const end = new Date(d)
  end.setDate(end.getDate() + 6)
  return `${formatDate(start)} ~ ${formatDate(end)}`
}

// 주차 이동
const prevWeek = () => {
  currentWeek.value.setDate(currentWeek.value.getDate() - 7)
  fetchMatches()
}
const nextWeek = () => {
  currentWeek.value.setDate(currentWeek.value.getDate() + 7)
  fetchMatches()
}

// 경기 선택
const selectMatch = (match) => {
  selectedMatch.value = match
  // 임시 라인업 (API 연동 시 바꿔야 함)
  homeLineup.value = [
    { id: 1, name: '모하메드 살라' },
    { id: 2, name: '버질 반다이크' },
    { id: 3, name: '비르츠' }
  ]
  awayLineup.value = [
    { id: 4, name: '리스 제임스' },
    { id: 5, name: '엔조 페르난데스' },
    { id: 6, name: '콜파머' }
  ]
}

// API에서 일정 가져오기 (임시 하드코딩)
const fetchMatches = () => {
  // 나중에 여기에 실제 API 요청 넣기
  matches.value = [
    {
      fixture: { id: 1 },
      teams: {
        home: { name: '리버풀', logo: 'https://media.api-sports.io/football/teams/40.png' },
        away: { name: '첼시', logo: 'https://media.api-sports.io/football/teams/49.png' }
      },
      goals: { home: 2, away: 1 } // 또는 null/null
    },
    {
      fixture: { id: 2 },
      teams: {
        home: { name: '토트넘', logo: 'https://media.api-sports.io/football/teams/47.png' },
        away: { name: '아스날', logo: 'https://media.api-sports.io/football/teams/42.png' }
      },
      goals: { home: null, away: null }
    }
  ]
}
fetchMatches()
</script>

<style scoped>
.match-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  background: #111; /* 기존 배경색 유지 */
}

.lineup-panel {
  width: 25%;
  background: #1d1d1d; /* 어두운 회색 */
  padding: 16px;
  border-radius: 10px;
  color: #e0e0e0;
}

.match-list-panel {
  width: 50%;
}

.match-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1d1d1d; /* 매치 카드도 어두운 배경으로 */
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #f0f0f0;
}

.match-card:hover {
  background: #2a2a2a; /* 살짝 더 밝은 hover 효과 */
}

.team {
  display: flex;
  align-items: center;
  gap: 6px;
}

.team-logo {
  width: 20px;
  height: 20px;
}

.vs {
  font-weight: bold;
}

</style>
