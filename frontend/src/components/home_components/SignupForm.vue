<template>
  <div class="overlay">
    <div class="signup-form">
      <h3>회원가입</h3>

      <input type="text" v-model="username" placeholder="아이디" />
      <input type="text" v-model="name" placeholder="이름" />
      <input type="password" v-model="password" placeholder="비밀번호" />

      <div class="club-search-container">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="선호 구단 검색 (예: Chelsea)"
          @input="debouncedSearchTeams"
        />

        <div v-if="preferred_club_name" class="selected-club">
          선택된 구단: {{ preferred_club_name }} (ID: {{ preferred_club_id }})
          <button @click="clearSelectedClub" class="clear-club-btn">X</button>
        </div>

        <ul v-if="searchTerm && searchResults.length > 0" class="search-results">
          <li
            v-for="team in searchResults"
            :key="team.id"
            @click="selectTeam(team)"
          >
            {{ team.name }}
          </li>
        </ul>

        <div
          v-else-if="searchTerm && searchResults.length === 0"
          class="no-results"
        >
          검색 결과 없음
        </div>
      </div>

      <button class="signup-btn" @click="signup">가입하기</button>
      <button class="close-btn" @click="$emit('close')">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { apiFetch } from "@/utils/apiFetch";

const username = ref("");
const password = ref("");
const name = ref("");
const preferred_club_id = ref(null);
const preferred_club_name = ref("");

const searchTerm = ref("");
const searchResults = ref([]);

let debounceTimer = null;

const emit = defineEmits(["close"]);

/* =========================
   선호 구단 검색 (회원가입 전용)
========================= */
const searchTeams = async () => {
  if (searchTerm.value.length < 2) {
    searchResults.value = [];
    return;
  }

  try {
    const data = await apiFetch(
      `/soccer/teams?name=${encodeURIComponent(
        searchTerm.value
      )}&context=signup`
    );

    searchResults.value = data;
  } catch (err) {
    console.error("팀 검색 오류:", err);
    searchResults.value = [];
  }
};

/* 안정적인 debounce */
const debouncedSearchTeams = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchTeams();
  }, 500);
};

const selectTeam = (team) => {
  preferred_club_id.value = team.id;
  preferred_club_name.value = team.name;
  searchTerm.value = "";
  searchResults.value = [];
};

const clearSelectedClub = () => {
  preferred_club_id.value = null;
  preferred_club_name.value = "";
};

/* =========================
   회원가입
========================= */
const signup = async () => {
  if (
    !username.value ||
    !password.value ||
    !name.value ||
    !preferred_club_id.value ||
    !preferred_club_name.value
  ) {
    alert("모든 필드를 입력하고 선호 구단을 선택해주세요.");
    return;
  }

  try {
    const data = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        name: name.value,
        preferred_club_id: preferred_club_id.value,
        preferred_club_name: preferred_club_name.value,
      }),
    });

    console.log("회원가입 결과:", data);
    alert("회원가입 성공!");
    emit("close");
  } catch (err) {
    console.error(err);
    alert(err.message || "서버 오류가 발생했습니다.");
  }
};

onUnmounted(() => {
  clearTimeout(debounceTimer);
});
</script>

<style scoped>
/* 배경 어둡게 (팝업 효과) */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
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
  width: calc(100% - 20px);
}

/* Club Search */
.club-search-container {
  position: relative;
  width: 100%;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #333;
  border: 1px solid #555;
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-results li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #444;
  text-align: left;
}

.search-results li:last-child {
  border-bottom: none;
}

.search-results li:hover {
  background-color: #555;
}

.no-results {
  padding: 10px;
  color: #aaa;
  text-align: center;
  font-size: 0.9em;
  background-color: #333;
  border: 1px solid #555;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.selected-club {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #444;
  padding: 8px 10px;
  border-radius: 4px;
  margin-top: 5px;
  font-size: 0.9em;
}

.clear-club-btn {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 1.1em;
}

.clear-club-btn:hover {
  color: #fff;
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
