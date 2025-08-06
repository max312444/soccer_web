<template>
  <div class="side-ranking">
    <h3>🏆 리그 순위표</h3>
    <ul>
      <li v-for="team in rankings" :key="team.name">
        {{ team.rank }}위 - {{ team.name }} ({{ team.points }}점)
      </li>
    </ul>
  </div>
</template>

<script setup>
const rankings = [
  { rank: 1, name: "맨시티", points: 85 },
  { rank: 2, name: "아스널", points: 83 },
  { rank: 3, name: "리버풀", points: 79 },
];
</script>

<style scoped>
.side-ranking {
  padding: 1rem;
  background: #fafafa;
  border: 1px solid #ddd;
}
ul {
  padding-left: 1rem;
}
li {
  margin-bottom: 0.3rem;
}
</style>
