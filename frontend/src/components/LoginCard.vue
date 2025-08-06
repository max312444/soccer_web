<template>
  <div class="login-card">
    <button v-if="!isLoggedIn" @click="login">로그인 / 회원가입</button>
    <div v-else>
      <p>환영합니다, {{ username }}님</p>
      <button @click="logout">로그아웃</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isLoggedIn = ref(false);
const username = ref("홍길동"); // 임시 사용자명

const login = () => {
  isLoggedIn.value = true;
};

const logout = () => {
  if (confirm("로그아웃 하시겠습니까?")) {
    isLoggedIn.value = false;
  }
};
</script>

<style scoped>
.login-card {
  padding: 1rem;
  border: 1px solid #ccc;
  background: #fff;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
  font-weight: bold;
}
</style>
