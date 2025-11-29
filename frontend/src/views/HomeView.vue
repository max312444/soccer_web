<script setup>
import { ref, computed } from 'vue'
import SideRanking from '../components/home_components/SideRanking.vue'
import Login from '../components/home_components/Login.vue'
import SignupForm from '../components/home_components/SignupForm.vue'
import ProfileView from '../components/ProfileView.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showSignup = ref(false)

const isLoggedIn = computed(() => authStore.isLoggedIn)

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

    <!-- 왼쪽 프로필 또는 로그인/회원가입 박스 -->
    <aside class="left-panel">
      <!-- 로그인 상태일 때 프로필 표시 -->
      <ProfileView v-if="isLoggedIn" />

      <!-- 로그아웃 상태일 때 로그인/회원가입 표시 -->
      <template v-else>
        <Login 
          v-if="!showSignup" 
          @show-signup="showSignup = true" 
        />
        <SignupForm 
          v-if="showSignup" 
          @close="showSignup = false" 
        />
      </template>
    </aside>

    <!-- 중앙 뉴스 패널 -->
    <main class="main-panel">
      <h2>뉴스 목록</h2>
      <ul>
        <li v-for="n in dummyNews" :key="n">{{ n }}</li>
      </ul>
    </main>

    <!-- 오른쪽 패널 -->
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
</style>
