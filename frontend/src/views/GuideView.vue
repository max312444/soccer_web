<template>
    <div class="guide-wrapper">
        <aside class="guide-list">
            <ul>
                <li v-for="(post, index) in posts" 
                :key="index" :class="{ active: selectedPostIndex == index }" 
                @click="selectPost(index)"
                > 
                {{ post.title }}
                </li>
            </ul>
        </aside>

        <main class="guide-content" v-if="selectedPost">
            <h2>{{ selectedPost.titel }}</h2>
            <p v-html="selectedPost.content"></p>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const posts = ref([
    { title: '가이드 1 - 팀 검색 방법', content: '팀 이름을 검색창에 입력하고 입력완료 버튼을 누르면 선수 검색과 같이 정보가 나옵니다.'},
    { title: '가이드 2 - 하이라이트 확인 방법', content: '하이라이트를 보고 싶은 선수를 검색한 다음 프로필에 있는 하이라이트 링크를 눌러 유튜브로 이동합니다.'},
    { title: '가이드 3 - 경기 일정 확인 방법', content: '메뉴 있는 경기 일정 메뉴로 이동한 다음 원하는 날짜가 있는 주로 변경하면 경기 일정을 확인 할 수 있습니다.'},
])

const selectedPostIndex = ref(0)
const selectedPost = ref(posts.value[selectedPostIndex.value])

const selectPost = (index) => {
    selectedPostIndex.value = index
    selectedPost.value = posts.value[index]
}
</script>

<style scoped>
.guide-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 80vh; 
}

/* 왼쪽 목록 */
.guide-list {
  width: 30%;
  background: #1a1a1a;
  border-right: 1px solid #333;
}
.guide-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.guide-list li {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #333;
}
.guide-list li:hover,
.guide-list li.active {
  background: #333;
}

/* 오른쪽 내용 */
.guide-content {
  width: 70%;
  padding: 20px;
  overflow-y: auto;
}
</style>