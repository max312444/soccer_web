<template>
  <div class="signup-form">
    <h3>로그인</h3>

    <input type="text" v-model="username" placeholder="아이디" />
    <input type="password" v-model="password" placeholder="비밀번호" />

    <button @click="login">로그인</button>

    <!-- 회원가입 버튼 -->
    <button class="sub-btn" @click="$emit('show-signup')">
      회원가입
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const login = () => {
  console.log('로그인 정보:', username.value, password.value)
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

/* 회원가입 버튼 (보조 버튼) */
.sub-btn {
  background-color: #444;
  color: #ddd;
  font-weight: normal;
  margin-top: 5px;
}
</style>
