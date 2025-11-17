<template>
  <div style="color:white; padding:20px;">
    <h2>팀 상세 정보</h2>
    <p>팀 ID: {{ id }}</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
</script>
