<template>
  <div class="detail-container" v-if="player && statistics">
    <div class="header">
      <img :src="player.photo" class="player-photo" />
      <h1>{{ player.name }}</h1>
      <p>{{ player.nationality }} | {{ player.birth.date }}</p>
    </div>

    <div class="info-box">
      <p>포지션: {{ statistics.games.position }}</p>
      <p>키: {{ player.height || "정보 없음" }}</p>
      <p>체중: {{ player.weight || "정보 없음" }}</p>
    </div>

    <h2>소속 팀</h2>
    <div class="team-box" @click="goTeam(statistics.team.id)">
      <img :src="statistics.team.logo" class="team-logo" />
      <p>{{ statistics.team.name }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const player = ref(null);
const statistics = ref(null);

onMounted(async () => {
  const id = route.params.id;

  const res = await fetch(`/soccer/player?id=${id}`);
  const data = await res.json();

  const first = data.response[0];

  player.value = first.player;
  statistics.value = first.statistics[0];
});

const goTeam = (id) => {
  router.push(`/team/${id}`);
};
</script>

<style scoped>
.detail-container {
  padding: 20px;
  color: white;
}

.player-photo {
  width: 140px;
  border-radius: 10px;
}

.team-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #222;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 20px;
}

.team-logo {
  width: 50px;
}
</style>
