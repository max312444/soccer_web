<template>
  <div class="table-box">
    <h2>리그별 순위표</h2>
    <div class="controls">
      <select v-model="selectedLeague" @change="fetchStandings">
        <option v-for="league in leagues" :key="league.id" :value="league.id">
          {{ league.name }}
        </option>
      </select>
      <select v-model="selectedSeason" @change="fetchStandings">
        <option v-for="season in seasons" :key="season" :value="season">
          {{ season }}
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

// Common leagues with their IDs from API-FOOTBALL
const leagues = ref([
  { id: 'PL', name: 'Premier League (잉글랜드)' },
  { id: 'PD', name: 'La Liga (스페인)' },
  { id: 'SA', name: 'Serie A (이탈리아)' },
  { id: 'BL1', name: 'Bundesliga (독일)' },
  { id: 'FL1', name: 'Ligue 1 (프랑스)' },
  // K League 1은 football-data.org에 직접적인 코드 없음.
  // 추후 다른 API 연동 또는 수동 관리 필요
  { id: 'KOR', name: 'K League 1 (대한민국) - 지원되지 않음' }, // placeholder for K League
]);

// Available seasons
const seasons = ref([2023, 2022, 2021, 2020]);

const selectedLeague = ref('PL'); // Default to Premier League (PL)
const selectedSeason = ref(2023); // Default to 2023 season

const fetchStandings = async () => {
  loading.value = true;
  error.value = null;
  standings.value = null;

  try {
    const res = await fetch(`http://localhost:7070/api/soccer/standings?league=${selectedLeague.value}&season=${selectedSeason.value}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "서버에서 순위 정보를 가져오는데 실패했습니다.");
    }
    const data = await res.json();
    
    if (Array.isArray(data) && data.length > 0) {
      standings.value = data;
    } else {
      throw new Error("해당 리그의 순위 정보가 없습니다.");
    }

  } catch (err) {
    console.error("순위 정보 로딩 실패:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Fetch standings when the component is first mounted
onMounted(fetchStandings);
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
