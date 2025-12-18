<script setup>
import { ref, onMounted } from 'vue'

const rankings = ref([])
const loading = ref(false)
const errorMsg = ref('')

const fetchSideRankings = async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    const res = await fetch("http://localhost:7070/api/soccer/side-rankings")
    if (!res.ok) {
      throw new Error('사이드 랭킹 요청 실패')
    }

    rankings.value = await res.json()
  } catch (err) {
    console.error(err)
    errorMsg.value = '랭킹을 불러오지 못했습니다.'
    rankings.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSideRankings()
})
</script>

<template>
  <div class="ranking-box">
    <h3>리그별 1위 팀</h3>

    <p v-if="loading">랭킹 불러오는 중...</p>
    <p v-if="errorMsg">{{ errorMsg }}</p>

    <ul v-if="!loading && rankings.length">
      <li v-for="item in rankings" :key="item.leagueName">
        <div class="league">{{ item.leagueName }}</div>
        <div class="team">
          <img :src="item.teamLogo" alt="" />
          <span>{{ item.teamName }}</span>
        </div>
        <div class="points">{{ item.points }} pts</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ranking-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: #1a1a1a;
  border-radius: 6px;
}

.league {
  font-size: 13px;
  color: #aaa;
}

.team {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team img {
  width: 20px;
  height: 20px;
}

.points {
  font-size: 12px;
  color: #4caf50;
}
</style>
