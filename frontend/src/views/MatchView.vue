<template>
  <div class="match-wrapper">

    <!-- 중앙: 경기 리스트 -->
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

      <!-- 주차 이동 -->
      <div class="week-selector">
        <button class="arrow-btn" @click="prevWeek">◀ 이전 주</button>
        <span class="date-range">{{ formatDateRange(currentWeek) }}</span>
        <button class="arrow-btn" @click="nextWeek">다음 주 ▶</button>
      </div>

      <!-- 경기 카드 목록 -->
      <div
        v-for="match in matches"
        :key="match.fixture.id"
        class="match-card"
      >
        <div class="match-date">
          {{ formatMatchTime(match.fixture.date) }}
        </div>

        <div class="match-teams">
          <div class="team">
            <img :src="resolvePhoto(match.teams.home.logo)" class="team-logo" />
            <span>{{ match.teams.home.name }}</span>
          </div>

          <span class="vs">
            <template v-if="match.goals.home !== null">
              {{ match.goals.home }} : {{ match.goals.away }}
            </template>
            <template v-else>vs</template>
          </span>

          <div class="team">
            <img :src="resolvePhoto(match.teams.away.logo)" class="team-logo" />
            <span>{{ match.teams.away.name }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const API_BASE = "http://localhost:7070";

/* 이미지 URL 처리 */
const resolvePhoto = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
};

/* 상태값 */
const matches = ref([]);
const currentWeek = ref(new Date());
const selectedLeague = ref("");

/* 날짜 처리 */
const formatDate = (d) => d.toISOString().split("T")[0];

const formatMatchTime = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")} ${String(
    d.getHours()
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const formatDateRange = (d) => {
  const start = new Date(d);
  const end = new Date(d);
  end.setDate(end.getDate() + 6);
  return `${formatDate(start)} ~ ${formatDate(end)}`;
};

/* 주차 이동 */
const prevWeek = () => {
  currentWeek.value = new Date(
    currentWeek.value.setDate(currentWeek.value.getDate() - 7)
  );
  fetchMatches();
};

const nextWeek = () => {
  currentWeek.value = new Date(
    currentWeek.value.setDate(currentWeek.value.getDate() + 7)
  );
  fetchMatches();
};

/* 경기 일정 로딩 */
const fetchMatches = async () => {
  matches.value = [];
  
  const start = new Date(currentWeek.value);
  const end = new Date(currentWeek.value);
  end.setDate(end.getDate() + 6);

  const from = formatDate(start);
  const to = formatDate(end);

  try {
    const url = selectedLeague.value
      ? `${API_BASE}/api/soccer/matches?from=${from}&to=${to}&league=${selectedLeague.value}`
      : `${API_BASE}/api/soccer/matches?from=${from}&to=${to}`;

    const res = await fetch(url);
    matches.value = await res.json();
  } catch (err) {
    console.error("경기 일정 로딩 실패:", err);
  }
};

/* 초기 실행 */
onMounted(fetchMatches);
</script>

<style scoped>
/* 전체 중앙 정렬 */
.match-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #111;
}

/* 중앙 패널만 존재하므로 width를 적절히 설정 */
.match-list-panel {
  width: 60%;
  max-width: 900px;
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

/* 주차 이동 */
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

/* 경기 카드 */
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
