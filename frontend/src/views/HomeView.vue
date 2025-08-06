<template>
  <div class="home-container">
    <aside class="left-panel">
      <LoginCard />
      <SideRanking />
    </aside>

    <section class="main-panel">
      <NewsList />
    </section>

    <aside class="right-panel">
      <RightPanel />
    </aside>
  </div>
</template>

<script setup>
import LoginCard from '../components/LoginCard.vue'
import SideRanking from '../components/SideRanking.vue'
import NewsList from '../components/NewsList.vue'
import RightPanel from '../components/RightPanel.vue'
</script>

<style scoped>
.home-container {
  display: flex;
  gap: 1rem;
}

.left-panel, .right-panel {
  width: 20%;
  min-width: 180px;
}

.main-panel {
  flex: 1;
}
</style>
