<template>
  <div class="formation">
    <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="line-row">
      <div v-for="player in row" :key="player.id" class="player-box">
        <img :src="player.photo" class="player-photo" />
        <div class="player-name">{{ player.name }}</div>
        <div class="player-pos">{{ player.pos }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  formation: String,   // example: "4-3-3"
  players: Array       // startXI
})

const rows = computed(() => {
  if (!props.formation || !props.players) return []

  const structure = props.formation.split("-").map(Number)
  let index = 0

  return structure.map(count => {
    const rowPlayers = props.players.slice(index, index + count)
    index += count
    return rowPlayers
  })
})
</script>

<style scoped>
.formation {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 16px;
}

.line-row {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.player-box {
  text-align: center;
  color: white;
}

.player-photo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}

.player-name {
  font-size: 0.85rem;
  margin-top: 4px;
}

.player-pos {
  font-size: 0.7rem;
  opacity: 0.7;
}
</style>
