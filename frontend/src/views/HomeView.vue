<script setup>
import { ref, computed } from 'vue'
import SideRanking from '../components/home_components/SideRanking.vue'
import Login from '../components/home_components/Login.vue'
import SignupForm from '../components/home_components/SignupForm.vue'
import ProfileView from '../components/ProfileView.vue'
import HomeNews from '../components/home_components/HomeNews.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showSignup = ref(false)

const isLoggedIn = computed(() => authStore.isLoggedIn)
</script>

<template>
  <div class="home-wrapper">

    <!-- 왼쪽 -->
    <aside class="left-panel">
      <ProfileView v-if="isLoggedIn" />

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

    <!-- 중앙 -->
    <main class="main-panel">
      <template v-if="isLoggedIn">
        <HomeNews />
      </template>

      <template v-else>
        <div class="login-required">
          <p>로그인이 필요한 서비스입니다.</p>
          <p class="sub">
            로그인 후 최신 축구 뉴스와 리그 정보를 확인하세요.
          </p>
        </div>
      </template>
    </main>

    <!-- 오른쪽 -->
    <aside class="right-panel">
      <template v-if="isLoggedIn">
        <SideRanking />
      </template>

      <template v-else>
        <div class="login-required">
          <p>로그인 후 확인 가능합니다.</p>
        </div>
      </template>
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
