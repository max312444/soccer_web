<template>
  <div class="overlay">
    <div class="signup-form">
      <h3>회원가입</h3>

      <input type="text" v-model="username" placeholder="아이디" />
      <input type="password" v-model="password" placeholder="비밀번호" />
      <input type="text" v-model="team" placeholder="선호 구단" />

      <button class="signup-btn" @click="signup">가입하기</button>
      <button class="close-btn" @click="$emit('close')">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const username = ref("")
const password = ref("")
const team = ref("")

const signup = () => {
  console.log("회원가입:", username.value, password.value, team.value)
}
</script>

<style scoped>
/* 배경 어둡게 (팝업 효과) */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 회원가입 박스 */
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #222;
  padding: 24px;
  border-radius: 10px;
  width: 320px;
  color: white;
}

.signup-form input {
  padding: 10px;
  border-radius: 4px;
  border: none;
}

.signup-btn {
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: #42f57b;
  font-weight: bold;
  cursor: pointer;
}

.close-btn {
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: #444;
  color: #ddd;
  cursor: pointer;
}
</style>
