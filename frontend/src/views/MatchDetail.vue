<script setup>
import { ref, onMounted } from 'vue'

/**
 * router에서 props: true 로 넘긴 fixtureId
 * /match/:id
 */
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const API_BASE = 'http://localhost:7070'

/* 상태 */
const loading = ref(true)
const events = ref([])
const error = ref(null)

/* 경기 이벤트 불러오기 */
const fetchMatchEvents = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await fetch(
      `${API_BASE}/api/soccer/match/${props.id}/events`
    )

    if (!res.ok) {
      throw new Error('이벤트 데이터를 불러오지 못했습니다')
    }

    events.value = await res.json()
  } catch (e) {
    console.error(e)
    error.value = '경기 이벤트를 불러오는 중 오류가 발생했습니다'
  } finally {
    loading.value = false
  }
}

onMounted(fetchMatchEvents)
</script>

<template>
  <div class="match-detail-wrapper">

    <h2 class="title">경기 상세</h2>

    <!-- 로딩 -->
    <div v-if="loading" class="status-text">
      이벤트 불러오는 중...
    </div>

    <!-- 에러 -->
    <div v-else-if="error" class="status-text error">
      {{ error }}
    </div>

    <!-- 이벤트 타임라인 -->
    <ul v-else class="event-list">
      <li
        v-for="(event, index) in events"
        :key="index"
        class="event-item"
      >
        <span class="minute">
          {{ event.minute }}'
        </span>

        <span
          class="type"
          :class="event.type.toLowerCase()"
        >
          {{ event.type }}
        </span>

        <span class="player">
          {{ event.player || 'Unknown' }}
        </span>

        <span class="team">
          ({{ event.team }})
        </span>
      </li>

      <li v-if="events.length === 0" class="status-text">
        이벤트 정보가 없습니다.
      </li>
    </ul>

  </div>
</template>

<style scoped>
.match-detail-wrapper {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
  color: #f0f0f0;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.status-text {
  text-align: center;
  color: #aaa;
  margin-top: 20px;
}

.status-text.error {
  color: #ff6b6b;
}

/* 이벤트 리스트 */
.event-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #333;
}

.minute {
  width: 40px;
  font-weight: bold;
}

/* 이벤트 타입 */
.type {
  min-width: 90px;
  text-align: center;
  font-size: 0.85rem;
  padding: 2px 6px;
  border-radius: 6px;
  background: #333;
}

.type.goal {
  background: #2ecc71;
  color: #111;
}

.type.yellow_card {
  background: #f1c40f;
  color: #111;
}

.type.red_card {
  background: #e74c3c;
  color: #fff;
}

.player {
  font-weight: 500;
}

.team {
  color: #aaa;
  font-size: 0.85rem;
}
</style>
