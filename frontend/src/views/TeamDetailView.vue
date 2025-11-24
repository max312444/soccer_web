<template>
  <div style="color:white; padding:20px;">
    <h2>팀 상세 정보</h2>
    <p>팀 ID: {{ id }}</p>

    <div v-if="loading">데이터 불러오는 중...</div>

    <div v-if="team && !loading">
      <h3>{{ team.team.name }}</h3>
      <img :src="team.team.logo" alt="logo" width="120" style="margin:20px 0;" />
      <p>국가: {{ team.team.country }}</p>
      <p>설립: {{ team.team.founded }}</p>
      <p>홈구장: {{ team.venue.name }} ({{ team.venue.city }})</p>

      <hr style="margin:30px 0;" />

      <h3>소속 선수 목록</h3>

      <div v-if="players.length === 0">
        <p>선수 정보가 없습니다.</p>
      </div>

      <div v-for="p in players" :key="p.player.id" class="player-card">
        <img :src="p.player.photo" width="50" style="border-radius:50%;" />
        <strong>{{ p.player.name }}</strong>
        <span>({{ p.statistics[0].games.position }})</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id

const team = ref(null)
const players = ref([])
const loading = ref(true)

onMounted(async () => {
  // 1) 팀 기본 정보
  const teamRes = await fetch(`http://localhost:7070/soccer/team/${id}`)
  const teamData = await teamRes.json()

  team.value = teamData.response?.[0] ?? null

  // 2) 팀 선수 목록
  const playerRes = await fetch(`http://localhost:7070/soccer/team/${id}/players`)
  const playerData = await playerRes.json()

  players.value = playerData.response ?? []

  loading.value = false
})
</script>

<style>
.player-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #333;
}
</style>
