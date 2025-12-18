<template>
  <div class="guide-wrapper">
    <aside class="guide-list">
      <ul>
        <li
          v-for="(post, index) in posts"
          :key="index"
          :class="{ active: selectedPostIndex == index }"
          @click="selectPost(index)"
        >
          {{ post.title }}
        </li>
      </ul>
    </aside>

    <main class="guide-content" v-if="selectedPost">
      <h2>{{ selectedPost.title }}</h2>
      <p v-html="selectedPost.content"></p>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const posts = ref([
  { title: '가이드 1 - 팀 검색 방법', content: '팀 이름을 검색창에 입력하고 입력완료 버튼을 누르면 선수 검색과 같이 정보가 나옵니다.' },
  { title: '가이드 2 - 리그 순위표 확인 방법', content: '상단 메뉴의 ‘순위표’를 클릭하면 각 리그의 현재 시즌 순위를 확인할 수 있습니다. 홈 화면 오른쪽에는 리그별 1위 팀이 요약되어 표시됩니다.' },
  { title: '가이드 3 - 경기 일정 확인 방법', content: '메뉴 있는 경기 일정 메뉴로 이동한 다음 원하는 날짜가 있는 주로 변경하면 경기 일정을 확인 할 수 있습니다.' },
  { title: '가이드 4 - 선호 팀 설정 방법', content: '로그인 후 선호 팀을 설정하면 홈 화면에서 해당 팀의 관련 뉴스가 최상단에 표시 됩니다.' },
  { title: '가이드 5 - 홈 화면 구성 안내', content: '홈 화면에서는 왼쪽에서 프로필 및 로그인 상태를 확인하고, 중앙에서 뉴스, 오른쪽에서 리그별 1위 팀을 확인할 수 있습니다.' },
])

const selectedPostIndex = ref(0)
const selectedPost = ref(posts.value[selectedPostIndex.value])

const selectPost = (index) => {
  selectedPostIndex.value = index
  selectedPost.value = posts.value[index]
}
</script>

<style scoped>

.guide-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  max-width: 1000px;
  margin: 32px auto;
  padding: 0 16px;
}

.guide-list {
  flex: 0 0 320px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
}
.guide-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.guide-list li {
  padding: 14px 16px;
  cursor: pointer;
  border-bottom: 1px solid #333;
  text-align: center;
}
.guide-list li:last-child { border-bottom: none; }
.guide-list li:hover,
.guide-list li.active {
  background: #2a2a2a;
  color: #a8ffb6;
}

.guide-content {
  flex: 1;
  background: #161616;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 24px;
  min-height: 240px;
  text-align: center;
}
.guide-content h2 {
  margin: 0 0 12px;
  font-size: 20px;
}
.guide-content p {
  line-height: 1.6;
  color: #cfcfcf;
}

@media (max-width: 720px) {
  .guide-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  .guide-list { flex: 1 1 auto; }
}
</style>
