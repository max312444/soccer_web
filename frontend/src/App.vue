<template>
  <div class="container">
    <header>
      <h1 class="title">Football in one</h1>
      <nav class="main-nav">
        <router-link to="/" class="nav-btn" exact-active-class="active">홈</router-link>
        <router-link to="/rank" class="nav-btn" active-class="active">순위표</router-link>
        <router-link to="/search" class="nav-btn" active-class="active">팀 / 선수 검색</router-link>
        <router-link to="/schedule" class="nav-btn" active-class="active">경기 일정</router-link>
        <router-link to="/guide" class="nav-btn" active-class="active">가이드</router-link>
      </nav>
    </header>

    <router-view />

  </div>
</template>

<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 1px;
  width: 100%;
  max-width: 1200px; 
  text-align: center;
}

.title {
  font-size: 48px;
  color: white;
  margin-bottom: 20px;
}

.main-nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.nav-btn {
  background: transparent;
  border: 2px solid #42f57b;
  color: #42f57b;
  font-weight: bold;
  font-size: 18px;
  padding: 10px 22px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

.nav-btn:hover {
  background: #42f57b;
  color: #111;
}

.nav-btn.active {
  background: #42f57b;
  color: #111;
}

.main-content {
  font-size: 20px;
  color: white;
}
</style>
