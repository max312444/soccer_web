<template>
  <div>
    <h2>최신 축구 뉴스</h2>
    <div class="news-grid">
      <div v-for="(article, index) in articles" :key="index" class="news-card">
        <a :href="article.url" target="_blank">
          <img :src="article.image" alt="thumbnail" v-if="article.image" />
          <h3>{{ article.title }}</h3>
          <p>{{ article.description }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const articles = ref([]);

onMounted(async () => {
  const res = await fetch("http://localhost:5001/api/news");
  const data = await res.json();
  articles.value = data.articles || [];
});
</script>

<style scoped>
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.news-card {
  border: 1px solid #ccc;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
}
.news-card img {
  width: 100%;
  max-height: 120px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
