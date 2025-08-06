<template>
  <div class="signup-form">
    <h3>회원가입</h3>
    <input type="text" v-model="username" placeholder="아이디" />
    <input type="password" v-model="password" placeholder="비밀번호" />
    <input type="text" v-model="team" placeholder="선호 구단" />
    <button @click="signup">가입하기</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const team = ref('')

const signup = () => {
  console.log('회원가입 정보:', username.value, password.value, team.value)
  // 나중에 axios.post('/signup', { username, password, team }) 붙이면 됨
}
</script>

<style scoped>
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #222;
  padding: 16px;
  border-radius: 8px;
  color: white;
}
.signup-form input,
.signup-form button {
  padding: 10px;
  border-radius: 4px;
  border: none;
}
.signup-form button {
  background-color: #42f57b;
  color: #111;
  font-weight: bold;
  cursor: pointer;
}
</style>
