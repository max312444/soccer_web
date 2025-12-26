<template>
  <div class="container">
    <header>
      <div class="header-top">
        <h1 class="title" @click="$router.push('/')">Football in one</h1>
        <div class="user-actions">
          <div v-if="isLoggedIn" class="user-info">
            <span>{{ userName }}님, 환영합니다!</span>
            <button @click="handleLogout" class="auth-btn">로그아웃</button>
          </div>
          <router-link v-else to="/login" class="auth-btn">로그인</router-link>
        </div>
      </div>
      <nav class="main-nav">
        <router-link to="/" class="nav-btn" exact-active-class="active">홈</router-link>
        <router-link to="/rank" class="nav-btn" active-class="active">순위표</router-link>
        <router-link to="/search" class="nav-btn" active-class="active">팀 검색</router-link>
        <router-link to="/match" class="nav-btn" active-class="active">경기 일정</router-link>
        <router-link to="/guide" class="nav-btn" active-class="active">가이드</router-link>
      </nav>
    </header>

    <router-view /> <!-- 이거 없으면 불러올 수 없으니 반드시 넣을 것 -->

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isLoggedIn);
const userName = computed(() => authStore.user?.name);

const handleLogout = () => {
  authStore.logout();
  alert('로그아웃 되었습니다.');
  router.push('/');
};
</script>

<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 1px;
  width: 100%;
  max-width: 1200px;
  text-align: center;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 48px;
  color: white;
  cursor: pointer;
  margin: 0;
}

.user-actions {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  font-size: 16px;
}

.auth-btn {
  background: #444;
  color: #ddd;
  border: 1px solid #555;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
}

.auth-btn:hover {
  background: #555;
}

.main-nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.nav-btn {
  background: transparent;
  border: 2px solid #42f57b;
  color: #42f57b;
  font-weight: bold;
  font-size: 18px;
  padding: 10px 22px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
  text-decoration: none;
}

.nav-btn:hover {
  background: #42f57b;
  color: #111;
}

.nav-btn.active {
  background: #42f57b;
  color: #111;
}

.main-content {
  font-size: 20px;
  color: white;
}
</style>
