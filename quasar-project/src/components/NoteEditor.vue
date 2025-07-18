<template>
  <div>
    <div class="top-padding row justify-center">
      <q-input v-model="ContentVarijabla.title" label="Title" class="note-title-input" />
    </div>
    <div class="row justify-center notebook-label">Notebook: {{ ContentVarijabla.notebook }}</div>
    <q-editor
      v-model="ContentVarijabla.content"
      height="420px"
      class="text-white note-editor"
      :toolbar="[
        ['bold', 'italic', 'underline'],
        ['unordered', 'ordered'],
        ['undo', 'redo'],
        ['fullscreen']
      ]"
    />
  </div>
  <div class="fixed-submit-btn">
    <q-btn
      color="yellow"
      round
      text-color="black"
      label="✔"
      @click="$emit('update-note', ContentVarijabla)"
    />
  </div>
</template>


<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['note'])
const emit = defineEmits(['update-note', 'refresh'])

const ContentVarijabla = ref({ ...props.note })


watch(() => props.note, (nova) => {
  ContentVarijabla.value = { ...nova }
})

</script>
