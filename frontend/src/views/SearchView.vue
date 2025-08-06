<template>
    <div class="search-container">
        <h2>팀 / 선수 검색</h2>

        <input v-model="query" @input="search" type="text" placeholder="팀명 혹은 선수명을 입력하세요" class="search-input"/>

        <div class="results">
            <div class="result-card" v-for="result in results" :key="result.id">
                <h3>{{ result.name }}</h3>
                <p>{{ result.type }} - {{ result.team }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const query = ref('')

const mockData = [
    { id: 1, name: '손흥민', type: '선수', team: '토트넘'},
    { id: 2, name: '박지성', type: '선수', team: '맨유'},
    { id: 3, name: '비르츠', type: '선수', team: '리버풀'},
]

const result = ref([])

const search = () => {
    if(!query.value.trim()) {
        results.value = []
        return
    }
    const lower = query.value.toLowerCase()
    results.value = mockData.filter(
        item =>
            item.name.toLowerCase().includes(lower) ||
            item.team.toLowerCase().includes(lower)
    )
}
</script>

<style scoped>
.search-container {
    padding: 20px;
    color: white;
    text-align: center;
}
.search-input {
    padding: 10px;
    width: 60%;
    border-radius: 8px;
    border: none;
    font-size: 16px;
    margin: 20px 0;
}
.results {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}
.result-card {
    background: #222;
    border: 1px solid #42f57b;
    border-radius: 10px;
    padding: 12px 20px;
    width: 60%;
}
</style>