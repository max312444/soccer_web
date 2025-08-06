<template>
  <div class="ranking-box">
    <h3>리그별 1위 팀</h3>
    <ul>
      <li v-for="team in topTeams" :key="team.league">
        <strong>{{ team.league }}:</strong> {{ team.team }}
      </li>
    </ul>
    <p class="note">상세 순위는 순위표를 참고해 주세요.</p>
  </div>
</template>

<script setup>
const topTeams = [
  { league: 'EPL', team: '리버풀' },
  { league: '라리가', team: '바르셀로나' },
  { league: '분데스리가', team: '레버쿠젠' },
  { league: '세리에 A', team: '인터 밀란' },
  { league: '프랑스 리그1', team: 'PSG'},
  { league: '에레디비시', team: '에인트호번'},
  { league: 'K 리그1', team: '전북 현대'},
];
</script>

<style scoped>
.note {
  margin-top: 12px;
  font-size: 13px;
  color: #aaa;
  text-align: center;
}

.ranking-box {
  padding: 10px;
  background: #1a1a1a;
  border: 2px solid #42f57b;
  border-radius: 16px;
  color: white;
  width: 100%;
}

h3 {
  color: #42f57b;
  margin-bottom: 12px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 8px;
  position: relative;
  padding-left: 10px;
}

li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: white;
}
</style>
