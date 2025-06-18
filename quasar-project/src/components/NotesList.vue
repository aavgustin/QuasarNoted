<template>
  <div>
    <div class="text-h6 q-mb-md">Recently Edited</div>
    <q-card
      v-for="note in notes"
      :key="note.id"
      class="q-mb-sm"
      @click="$emit('select-note', note)"
      :class="{ 'bg-primary text-white': note.id === selectedNote?.id }"
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
defineProps(['notes', 'selectedNote'])
defineEmits(['select-note'])
</script>
