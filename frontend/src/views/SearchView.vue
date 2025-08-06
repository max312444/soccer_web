<template>
  <div class="search">
    <h2>선수 검색</h2>
    <input v-model="query" placeholder="선수 이름을 입력하세요" />
    <button @click="search">검색</button>

    <div v-if="results.length">
      <h3>검색 결과</h3>
      <ul>
        <li v-for="player in results" :key="player.name">
          {{ player.name }} - {{ player.team }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const query = ref("");
const results = ref([]);

const search = () => {
  // 목 데이터
  const dummyData = [
  { name: "손흥민", team: "토트넘" },
  { name: "김민재", team: "뮌헨" },
];

  results.value = dummyData.filter(player =>
    player.name.includes(query.value)
  );
};
</script>

<style scoped>
.search {
  padding: 1rem;
}
input {
  margin-right: 0.5rem;
  padding: 0.5rem;
}
</style>