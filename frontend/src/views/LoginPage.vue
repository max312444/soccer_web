<template>
  <LoginView 
    v-if="!showSignup"
    @show-signup="showSignup = true"
  />

  <SignupView
    v-if="showSignup"
    @close="showSignup = false"
  />
</template>

<script setup>
import { ref } from 'vue'
import LoginView from '../components/Login.vue'
import SignupView from '../components/SignupForm.vue'

const showSignup = ref(false)
</script>
