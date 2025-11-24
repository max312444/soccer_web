<template>
  <div style="color:white; padding:20px;">
    <h2>선수 상세 정보</h2>
    <p>선수 ID: {{ id }}</p>

    <div v-if="loading">데이터 불러오는 중...</div>

    <div v-if="player && !loading">

      <!-- 기본 정보 -->
      <h3>{{ player.player.name }}</h3>
      <img
        :src="player.player.photo"
        alt="player photo"
        width="120"
        style="margin:20px 0; border-radius:10px;"
      />
      <p>국가: {{ player.player.nationality }}</p>
      <p>출생: {{ player.player.birth.date }} ({{ player.player.birth.place }})</p>
      <p>나이: {{ player.player.age }}세</p>
      <p>키: {{ player.player.height }}</p>
      <p>몸무게: {{ player.player.weight }}</p>

      <hr />

      <!-- 시즌 스탯 -->
      <h3>2023 시즌 기록</h3>
      <p>포지션: {{ stats.games.position }}</p>
      <p>출전 경기수: {{ stats.games.appearences }}</p>
      <p>선발: {{ stats.games.lineups }}</p>
      <p>득점: {{ stats.goals.total }}</p>
      <p>도움: {{ stats.goals.assists }}</p>

      <hr />

      <!-- 클럽 이력(커리어) -->
      <h3>클럽 커리어</h3>
      <div v-if="career.length === 0">
        <p>커리어 정보가 없습니다.</p>
      </div>

      <ul v-else>
        <li v-for="(c, index) in career" :key="index">
          {{ c.date }}  
          → {{ c.teams.out?.name ?? "?" }}  
          → {{ c.teams.in?.name ?? "?" }}  
          ({{ c.type }})
        </li>
      </ul>
    </div>

    <div v-if="!player && !loading">
      <p>선수 정보를 찾을 수 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id

const player = ref(null)
const stats = ref(null)
const career = ref([])

const loading = ref(true)

onMounted(async () => {
  const res = await fetch(`http://localhost:7070/soccer/player/${id}`)
  const data = await res.json()

  const detail = data.response?.[0] ?? null

  if (detail) {
    player.value = detail
    stats.value = detail.statistics[0]
    career.value = detail.transfers ?? []
  }

  loading.value = false
})
</script>
