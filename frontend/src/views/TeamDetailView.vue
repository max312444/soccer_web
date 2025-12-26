<template>
  <div class="detail-container" v-if="team">
    <!-- 헤더 영역 -->
    <div class="header">
      <img :src="team.logo" class="team-logo" alt="team logo" />
      <h1>{{ team.name }}</h1>
      <p class="country">{{ team.country }}</p>
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
      <p>
        <strong>도시:</strong>
        {{ team.venue?.city || "정보 없음" }}
      </p>
      <p>
        <strong>수용 인원:</strong>
        {{ team.venue?.capacity?.toLocaleString() || "정보 없음" }}
      </p>
    </div>
  </div>

  <!-- 로딩 or 에러 대비 -->
  <div v-else class="loading">
    팀 정보를 불러오는 중입니다...
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const team = ref(null);

onMounted(async () => {
  try {
    const id = route.params.id;

    const res = await fetch(`/soccer/team?id=${id}`);
    if (!res.ok) {
      throw new Error("팀 정보 요청 실패");
    }

    const data = await res.json();

    if (data.response && data.response.length > 0) {
      // API-Football 구조 기준
      team.value = {
        ...data.response[0].team,
        venue: data.response[0].venue,
      };
    }
  } catch (err) {
    console.error(err);
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
}

.loading {
  padding: 40px;
  text-align: center;
  color: #ccc;
}
</style>
