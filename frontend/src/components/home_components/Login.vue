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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const emit = defineEmits(['show-signup']);

const login = async () => {
  if (!username.value || !password.value) {
    alert("아이디와 비밀번호를 입력해주세요.");
    return;
  }

  try {
    const res = await fetch("http://localhost:7070/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "로그인에 실패했습니다.");
      return;
    }

    // Pinia 스토어에 사용자 정보와 토큰 저장
    authStore.setUserAndToken(data.user, data.accessToken);

    alert("로그인 되었습니다.");

    // 홈으로 이동
    router.push('/');

  } catch (err) {
    console.error("로그인 중 에러 발생:", err);
    alert("로그인 중 서버에 문제가 발생했습니다.");
  }
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
