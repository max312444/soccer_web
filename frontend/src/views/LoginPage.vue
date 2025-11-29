<template>
  <div>
    <!-- If logged in, show Profile -->
    <ProfileView v-if="isLoggedIn" />
    
    <!-- If not logged in, show Login or Signup -->
    <template v-else>
      <LoginView 
        v-if="!showSignup"
        @show-signup="showSignup = true"
      />
      <SignupView
        v-if="showSignup"
        @close="showSignup = false"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import LoginView from '../components/home_components/Login.vue';
import SignupView from '../components/home_components/SignupForm.vue';
import ProfileView from '../components/ProfileView.vue';

const authStore = useAuthStore();
const showSignup = ref(false);

const isLoggedIn = computed(() => authStore.isLoggedIn);
</script>
