<template>
  <div>
    <div class="text-h6 q-mb-md">Notes</div>
    <q-card
      v-for="note in notes"
      :key="note.id"
      class="q-mb-sm"
      @click="$emit('select-note', note)"
      :class="{ 'text-white': note.id === ActiveNote?.id }"
      :style="{backgroundColor: notebook === ActiveNotebook ? '#2d2d2d' : '#2b2b2b',color:'white'}"
    >
      <q-card-section>
        <div class="text-subtitle1">{{ note.title }}</div>
        <div class="text-caption text-grey">
          {{ note.date }} - In notebook: {{ note.notebook }}
        </div>
        <div class="ellipsis">{{ note.content.slice(0, 100) }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
defineProps(['notes', 'ActiveNote'])
defineEmits(['select-note'])
</script>
