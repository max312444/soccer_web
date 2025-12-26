<template>
    <div class="match-events">
      <h2>경기 주요 이벤트</h2>
      <div v-if="events.length === 0" class="no-events">
        <p>이벤트 정보가 없습니다.</p>
      </div>
      <div v-else>
        <div v-for="event in events" :key="event.time.elapsed" class="event">
          <div class="event-time">{{ event.time.elapsed }}'</div>
          <div class="event-details">
            <span class="event-type">{{ event.type }}</span>
            <span class="event-player">{{ event.player.name }}</span>
            <span v-if="event.assist.name" class="event-assist">(도움: {{ event.assist.name }})</span>
            <p class="event-detail">{{ event.detail }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    events: {
      type: Array,
      required: true
    }
  });
  </script>
  
  <style scoped>
  .match-events {
    margin-top: 20px;
  }
  
  .no-events {
    text-align: center;
    color: #888;
  }
  
  .event {
    display: flex;
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  
  .event-time {
    font-weight: bold;
    margin-right: 15px;
    min-width: 40px;
  }
  
  .event-details {
    display: flex;
    flex-direction: column;
  }
  
  .event-type {
    font-weight: bold;
    color: #333;
  }
  
  .event-player {
    font-size: 1.1em;
    color: #0056b3;
  }
  
  .event-assist {
    font-size: 0.9em;
    color: #555;
  }
  
  .event-detail {
    margin: 5px 0 0;
    color: #666;
  }
  </style>
  