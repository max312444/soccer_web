<template>
  <div v-if="team" class="detail-container">
    <!-- 헤더 -->
    <div class="header">
      <img
        v-if="team.logo"
        :src="team.logo"
        class="team-logo"
        alt="team logo"
      />
      <h1>{{ team.name }}</h1>
      <p class="country">{{ team.country || "정보 없음" }}</p>
    </div>

    <!-- 팀 기본 정보 -->
    <div class="info-box">
      <p>
        <strong>창단:</strong>
        {{ team.founded || "정보 없음" }}
      </p>

      <p>
        <strong>홈 구장:</strong>
        {{ team.venue?.name || "정보 없음" }}
      </p>

      <p v-if="team.clubColors">
        <strong>클럽 컬러:</strong>
        {{ team.clubColors }}
      </p>

      <p v-if="team.website">
        <strong>공식 웹사이트:</strong>
        <a :href="team.website" target="_blank" rel="noopener">
          {{ team.website }}
        </a>
      </p>
    </div>

    <!-- 참가 중인 리그 -->
    <div
      v-if="team.competitions && team.competitions.length"
      class="info-box"
    >
      <h3>참가 리그</h3>
      <ul class="competition-list">
        <li v-for="c in team.competitions" :key="c.id">
          {{ c.name }}
        </li>
      </ul>
    </div>

    <div class="bottom-actions">
      <button class="back-btn" @click="goBack">
        ← 뒤로가기
      </button>

      <button class="search-btn" @click="goSearch">
        팀 다시 검색하기
      </button>
    </div>
  </div>

  <!-- 로딩 상태 -->
  <div v-else class="loading">
    팀 정보를 불러오는 중입니다...
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const team = ref(null);

const goBack = () => {
  router.back();
};

const goSearch = () => {
  router.push("/search");
};

onMounted(async () => {
  try {
    const id = route.params.id;
    if (!id) throw new Error("team id가 없습니다");

    const res = await fetch(`/api/soccer/team/detail?id=${id}`);
    if (!res.ok) throw new Error("팀 정보 요청 실패");

    const data = await res.json();

    team.value = {
      ...data.team,
      venue: data.venue,
      competitions: data.competitions || [],
    };
  } catch (err) {
    console.error("Team detail fetch ERROR:", err);
    team.value = null;
  }
});
</script>

<style scoped>
.detail-container {
  padding: 24px;
  color: #ffffff;
  max-width: 720px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

.team-logo {
  width: 120px;
  height: auto;
  margin-bottom: 12px;
}

.country {
  opacity: 0.8;
}

.info-box {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px 20px;
  line-height: 1.8;
  margin-bottom: 16px;
}

.info-box h3 {
  margin-bottom: 8px;
}

.competition-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.competition-list li {
  padding: 4px 0;
}

/* 하단 버튼 스타일 */
.bottom-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
}

.back-btn,
.search-btn {
  background: transparent;
  border: 1px solid #7cf2b3;
  color: #7cf2b3;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.back-btn:hover,
.search-btn:hover {
  background: rgba(124, 242, 179, 0.1);
}

.loading {
  padding: 40px;
  text-align: center;
  color: #ccc;
}

a {
  color: #7cf2b3;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
