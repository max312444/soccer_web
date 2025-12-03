<template>
  <div class="detail-container" v-if="team">
    <div class="header">
      <img :src="team.logo" class="team-logo" />
      <h1>{{ team.name }}</h1>
      <p>{{ team.country }}</p>
    </div>

    <div class="info-box">
      <p>감독: {{ team.coach || "정보 없음" }}</p>
      <p>창단: {{ team.founded || "정보 없음" }}</p>
      <p>스타디움: {{ team.venue?.name || "정보 없음" }}</p>
      <p>도시: {{ team.venue?.city || "정보 없음" }}</p>
    </div>

    <h2>소속 선수</h2>
    <div class="players">
      <div 
        class="player-card" 
        v-for="p in players" 
        :key="p.player.id"
        @click="goPlayer(p.player.id)"
      >
        <img :src="p.player.photo" />
        <p>{{ p.player.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const team = ref(null);
const players = ref([]);

onMounted(async () => {
  const id = route.params.id;

  // 팀 정보
  const teamRes = await fetch(`/soccer/team?id=${id}`);
  const teamData = await teamRes.json();
  team.value = teamData.response[0].team;
  
  // 소속 선수 정보
  const squadRes = await fetch(`/soccer/players?team=${id}`);
  const squadData = await squadRes.json();
  players.value = squadData.response;
});

const goPlayer = (id) => {
  router.push(`/player/${id}`);
};
</script>

<style scoped>
.detail-container {
  padding: 20px;
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.team-logo {
  width: 120px;
  margin-bottom: 10px;
}

.players {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.player-card {
  width: 120px;
  cursor: pointer;
  text-align: center;
}

.player-card img {
  width: 100%;
  border-radius: 8px;
}
</style>
