<template>
  <div class="table-box">
    <h2>리그별 순위표</h2>
    <div class="controls">
      <select v-model="selectedLeague" @change="onLeagueChange">
        <option v-for="league in leagues" :key="league.id" :value="league.id">
          {{ league.name }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading">불러오는 중...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <table v-else-if="standings" class="ranking-table">
      <thead>
        <tr>
          <th>순위</th>
          <th class="team-header">팀</th>
          <th>경기</th>
          <th>승</th>
          <th>무</th>
          <th>패</th>
          <th>득실</th>
          <th>승점</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in standings" :key="team.team.id">
          <td>{{ team.rank }}</td>
          <td class="team-cell">
            <img :src="team.team.logo" alt="team logo" class="team-logo" />
            <span>{{ team.team.name }}</span>
          </td>
          <td>{{ team.all.played }}</td>
          <td>{{ team.all.win }}</td>
          <td>{{ team.all.draw }}</td>
          <td>{{ team.all.lose }}</td>
          <td>{{ team.goalsDiff }}</td>
          <td><strong>{{ team.points }}</strong></td>
        </tr>
      </tbody>
    </table>

    <div v-else class="no-data">순위 정보를 불러올 수 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const standings = ref(null);
const loading = ref(true);
const error = ref(null);

const leagues = ref([
  { id: 'PL', name: 'Premier League (잉글랜드)' },
  { id: 'PD', name: 'La Liga (스페인)' },
  { id: 'SA', name: 'Serie A (이탈리아)' },
  { id: 'BL1', name: 'Bundesliga (독일)' },
  { id: 'FL1', name: 'Ligue 1 (프랑스)' },
]);

// 시즌 목록은 API에서 가져온 최신 시즌을 포함해 동적으로 구성됨
const seasons = ref([]);

const selectedLeague = ref('PL');
const selectedSeason = ref(null); // 동적 설정(기본값 없음)

// 1) league 변경 시 최신 시즌 다시 불러오기
const onLeagueChange = async () => {
  await loadCurrentSeason();
};

// 2) 현재 시즌 & 시즌 목록 가져오기
const loadCurrentSeason = async () => {
  loading.value = true;

  try {
    const res = await fetch(
      `http://localhost:7070/api/soccer/competition?league=${selectedLeague.value}`
    );

    if (!res.ok) throw new Error("현재 시즌 정보를 가져오지 못했습니다.");

    const data = await res.json();

    // 현재 시즌 연도 추출
    const startYear = Number(data.currentSeason.startDate.split("-")[0]);


    // 자동으로 최신 시즌 선택
    selectedSeason.value = startYear;

    // 최신 시즌에 맞춰 standings 불러오기
    fetchStandings();

  } catch (err) {
    console.error(err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// 3) 실제 순위표 불러오기
const fetchStandings = async () => {
  if (!selectedSeason.value) return; // 시즌 선택 전이면 실행 막기

  loading.value = true;
  error.value = null;

  try {
    const res = await fetch(
      `http://localhost:7070/api/soccer/standings?league=${selectedLeague.value}&season=${selectedSeason.value}`
    );

    if (!res.ok) throw new Error("순위 정보를 가져오지 못했습니다.");

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("해당 시즌의 순위 정보가 없습니다.");
    }

    standings.value = data;

  } catch (err) {
    console.error(err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// 4) 페이지 로드시 실행
onMounted(async () => {
  await loadCurrentSeason(); // 최신 시즌 자동 설정
});
</script>

<style scoped>
.table-box {
    background-color: #1e1e1e;
    padding: 20px;
    border-radius: 8px;
    color: white;
}
.controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}
select {
    padding: 8px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #444;
    background-color: #333;
    color: white;
}
.loading, .error, .no-data {
    text-align: center;
    padding: 40px;
    font-size: 1.2em;
    color: #aaa;
}
.ranking-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
    text-align: center;
}
.ranking-table th,
.ranking-table td {
    border: 1px solid #444;
    padding: 12px 8px;
}
.ranking-table th {
    background-color: #2a2a2a;
    color: #42f57b;
    font-weight: bold;
}
.team-header {
    text-align: left;
}
.team-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
}
.team-logo {
    width: 24px;
    height: 24px;
}
</style>
