<template>
  <div class="profile-container">
    <h3>내 프로필</h3>

    <div v-if="loading" class="loading">
      프로필 정보를 불러오는 중...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="profile-content">
      <div class="profile-item">
        <span class="label">아이디:</span>
        <span>{{ user.username }}</span>
      </div>

      <div class="profile-item">
        <span class="label">이름:</span>
        <span>{{ user.name }}</span>
      </div>

      <div class="profile-item club-item">
        <span class="label">선호 구단:</span>

        <div v-if="teamLogo" class="club-info">
          <img
            :src="teamLogo"
            alt="club logo"
            class="club-logo"
          />
          <span>{{ user.preferred_club_name }}</span>
        </div>

        <div v-else class="club-info">
          <span>구단 정보 없음</span>
        </div>
      </div>

      <button @click="handleLogout" class="logout-btn">
        로그아웃
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)
const isLoggedIn = computed(() => authStore.isLoggedIn)
const token = computed(() => authStore.token)

const teamLogo = ref('')
const loading = ref(true)
const error = ref(null)

const fetchTeamLogo = async () => {
  if (!isLoggedIn.value || !token.value) {
    loading.value = false
    return
  }

  if (!user.value?.preferred_club_id) {
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = null

    const res = await fetch(
      `/api/soccer/team/profile?id=${user.value.preferred_club_id}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    )

    if (!res.ok) {
      throw new Error('구단 정보를 불러오지 못했습니다.')
    }

    const data = await res.json()
    teamLogo.value = data?.logo || ''
  } catch (err) {
    console.error('Profile team fetch error:', err)
    error.value = err.message
    teamLogo.value = ''
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  teamLogo.value = ''
  router.push('/')
}

onMounted(() => {
  if (isLoggedIn.value && token.value) {
    fetchTeamLogo()
  }
})

watch(token, (newToken) => {
  if (newToken && isLoggedIn.value) {
    fetchTeamLogo()
  } else {
    teamLogo.value = ''
    loading.value = false
  }
})
</script>

<style scoped>
.profile-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  background-color: #2a2a2a;
  border-radius: 8px;
  color: white;
  text-align: center;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
  margin-top: 20px;
}

.profile-item {
  display: flex;
  align-items: center;
  font-size: 1.1em;
}

.label {
  font-weight: bold;
  color: #888;
  width: 100px;
}

.club-item .label {
  align-self: flex-start;
  margin-top: 5px;
}

.club-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.club-logo {
  width: 30px;
  height: 30px;
}

.logout-btn {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: #f44336;
  color: white;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}

.loading,
.error {
  padding: 20px;
  color: #aaa;
}
</style>
