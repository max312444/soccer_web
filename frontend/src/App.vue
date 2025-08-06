<template>
  <div id="app">
    <header>
      <nav class="nav">
        <router-link to="/">홈</router-link>
        <router-link to="/search">선수 검색</router-link>
        <router-link to="/rank">순위표</router-link>
        <router-link to="/guide">가이드</router-link>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.nav {
  display: flex;
  gap: 1rem;
  background-color: #222;
  padding: 1rem;
}

.nav a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}

.nav a.router-link-active {
  text-decoration: underline;
}

.main-content {
  padding: 2rem;
}
</style>