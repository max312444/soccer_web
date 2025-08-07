<template>
    <div class="table-box">
        <h2>리그별 순위표</h2>
        <select v-model="selectedLeague">
            <option v-for="league in leagues" :key="league" :value="league">
                {{ league }}
            </option>
        </select>

        <table class="ranking-table">
            <thead>
                <tr>
                    <th>순위</th>
                    <th>팀</th>
                    <th>경기수</th>
                    <th>승</th>
                    <th>무</th>
                    <th>패</th>
                    <th>승점</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(team, index) in leagueTable[selectedLeague]" :key="team.name">
                    <td>{{ index + 1 }}</td>
                    <td>{{ team.name }}</td>
                    <td>{{ team.played }}</td>
                    <td>{{ team.win }}</td>
                    <td>{{ team.draw }}</td>
                    <td>{{ team.lose }}</td>
                    <td>{{ team.points }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const leagues = ['EPL', '라리가', '세리에A', '분데스리가', '프랑스 리그1', '에레디비시', 'K 리그1']
const selectedLeague = ref('EPL')

const leagueTable = {
  EPL: [
    { name: '맨시티', played: 38, win: 28, draw: 6, lose: 4, points: 90 },
    { name: '아스날', played: 38, win: 26, draw: 7, lose: 5, points: 85 },
  ],
  라리가: [
    { name: '레알 마드리드', played: 38, win: 30, draw: 4, lose: 4, points: 94 },
  ],
  세리에A: [
    { name: '인터 밀란', played: 38, win: 29, draw: 6, lose: 3, points: 93 },
  ],
  분데스리가: [
    { name: '레버쿠젠', played: 34, win: 28, draw: 6, lose: 0, points: 90 },
  ],
}
</script>

<style scoped>
.rank-container {
    color: white;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}
select {
    margin: 16px 0;
    padding: 8px;
    font-size: 16px;
}
.ranking-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
}
.ranking-table td {
    border: 1px solid #42f57b;
    padding: 8px;
}
.ranking-table th {
    border: 1px solid #42f57b;
    padding: 8px;
    background-color: #222;
    color: #42f57b;
}
</style>