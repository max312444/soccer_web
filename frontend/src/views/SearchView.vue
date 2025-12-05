<template>
  <div class="search-container">
    <h2>팀 / 선수 검색</h2>

    <div class="search-bar">
      <!-- 검색 타입 선택 -->
      <select v-model="searchType" class="select-box">
        <option value="team">팀 검색</option>
        <option value="player">선수 검색</option>
      </select>

      <!-- 검색 입력 -->
      <input
        v-model="query"
        type="text"
        placeholder="팀명 또는 선수명을 입력하세요"
        class="search-input"
      />

      <!-- 검색 버튼 -->
      <button class="search-btn" @click="search">
        🔍
      </button>
    </div>

    <!-- 결과 없음 -->
    <p v-if="results.length === 0 && searched" class="no-results">
      검색 결과가 없습니다.
    </p>

    <!-- 검색 결과 -->
    <div class="results">
      <div 
        class="result-card" 
        v-for="item in results" 
        :key="item.key"
        @click="goDetail(item)"
      >
        <img :src="item.logo" width="50" />
        <h3>{{ item.name }}</h3>
        <p>{{ item.sub }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const BASE = "http://localhost:7070/api";

const router = useRouter();

const query = ref("");
const results = ref([]);
const searched = ref(false);

// 전체 검색 삭제 → 팀 or 선수만 남긴다
const searchType = ref("team");

/* =======================
   검색 함수
======================= */
const search = async () => {
  searched.value = true;

  if (!query.value.trim()) {
    results.value = [];
    return;
  }

  let finalResults = [];

  /* =======================
     1) 팀 검색
  ======================= */
  if (searchType.value === "team") {
    const teamRes = await fetch(
      `${BASE}/soccer/teams?name=${encodeURIComponent(query.value)}`
    );
    
    const teamData = await teamRes.json();
    const list = Array.isArray(teamData) ? teamData : teamData.response || [];

    const teamResults = list.map(t => ({
      key: "team-" + t.id,
      id: t.id,
      name: t.name,
      logo: t.logo,
      sub: `팀`,
      type: "team"
    }));

    finalResults.push(...teamResults);
  }

  /* =======================
     2) 선수 검색
  ======================= */
  if (searchType.value === "player") {
    const playerRes = await fetch(
      `${BASE}/soccer/players?name=${encodeURIComponent(query.value)}`
    );
    
    const playerData = await playerRes.json();
    const list = Array.isArray(playerData) ? playerData : playerData.response || [];

    finalResults.push(
      ...list.map(p => ({
        key: "player-" + p.id,
        id: p.id,
        name: p.name,
        logo: p.logo,
        sub: `선수 | ${p.team || "소속팀 없음"}`,
        type: "player"
      }))
    );
  }

  results.value = finalResults;
};

/* ===========================
   상세 페이지 이동
=========================== */
const goDetail = (item) => {
  if (item.type === "team") {
    router.push(`/team/${item.id}`);
  } else {
    router.push(`/player/${item.id}`);
  }
};
</script>

<style scoped>
.search-container {
  padding: 20px;
  color: white;
  text-align: center;
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.select-box {
  padding: 10px;
  border-radius: 8px;
  font-size: 16px;
}

.search-input {
  padding: 10px;
  width: 45%;
  border-radius: 8px;
  border: none;
  font-size: 16px;
}

.search-btn {
  padding: 10px 15px;
  background: #42f57b;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.no-results {
  margin-top: 20px;
  color: #aaa;
}

.results {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.result-card {
  background: #222;
  border: 1px solid #42f57b;
  border-radius: 10px;
  padding: 12px 20px;
  width: 60%;
  text-align: left;
  cursor: pointer;
}

.result-card img {
  border-radius: 6px;
  margin-bottom: 8px;
}
</style>
