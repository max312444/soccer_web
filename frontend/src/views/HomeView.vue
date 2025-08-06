<script setup>
import SideRanking from '../components/home_components/SideRanking.vue'
import Login from '../components/home_components/Login.vue'

const dummyNews = [
  '손흥민, LAFC  Here we go!',
  '모드리치 인터 밀란 Here we go!',
  '곤살루 게드스 레알 소시에다드 Here we go!',
  '비르츠, 리버풀 Here we go!',
  'A.아놀드 레알마드리드 Here we go!',
  '바르셀로나FC VS 대구FC 7 : 3 로 종료',
  '토트넘, 손흥민의 7번 등번호 당분간 공백 유지 결정',
  '이삭, 리버풀 이적희망, 하지만 합의 불발',
  '리버풀, 알힐랄 누녜스 이적 합의'
]
</script>

<template>
  <div class="home-wrapper">
    <aside class="left-panel">
      <Login />
    </aside>

    <main class="main-panel">
      <h2>뉴스 목록</h2>
      <ul>
        <li v-for="n in dummyNews" :key="n">{{ n }}</li>
      </ul>
    </main>

    <aside class="right-panel">
      <SideRanking />
    </aside>
  </div>
</template>

<style scoped>
.home-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.left-panel,
.right-panel {
  width: 25%;
  background-color: #222;
  padding: 10px;
  border-radius: 8px;
}

.main-panel {
  width: 50%;
  background-color: #1a1a1a;
  padding: 10px;
  border-radius: 8px;
}

/* 버튼 그룹 */
.btn-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.btn-group button {
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-group button:first-of-type {
  background-color: #50fa7b;
  color: #111;
}

.signup-btn {
  background-color: #444;
  color: white;
}
.signup-btn:hover {
  background-color: #666;
}
</style>
