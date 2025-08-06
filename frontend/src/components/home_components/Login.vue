<template>
  <div class="login-form">
    <div class="team-logo"></div>
    <h3>로그인</h3>
    <input type="text" v-model="username" placeholder="아이디" />
    <input type="password" v-model="password" placeholder="비밀번호" />
    <button class="login-btn">로그인</button>
    <p class="switch-text">
      <button @click="$emit('show-signup')" class="link-btn">회원가입</button>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const login = () => {
  console.log('로그인 시도:', username.value, password.value)
  // 나중에 axios.post('/login', { username, password }) 붙이면 됨
}
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #333;
  padding: 16px;
  border-radius: 8px;
  color: white;
}

.login-form input {
  padding: 8px;
  border: none;
  border-radius: 4px;
}

.login-form button {
  padding: 10px;
  border: none;
  background-color: #42f57b;
  color: #111;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
}
.team-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #888;
  margin: 0 auto;
}
</style>
