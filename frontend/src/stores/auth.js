import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const token = ref(localStorage.getItem('token') || null);

  // --- Getters ---
  const isLoggedIn = computed(() => !!token.value);
  const preferredClubId = computed(() => user.value?.preferred_club_id);
  const preferredClubName = computed(() => user.value?.preferred_club_name);

  // --- Actions ---
  function setUserAndToken(userData, accessToken) {
    user.value = userData;
    token.value = accessToken;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    isLoggedIn,
    preferredClubId,
    preferredClubName,
    setUserAndToken,
    logout,
  };
});
