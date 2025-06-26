<template>
  <div>
    <div class="top-padding row justify-center">
      <q-input v-model="editable.title" label="Title" class="note-title-input" />
    </div>
    <div class="row justify-center notebook-label">Notebook: {{ editable.notebook }}</div>
    <q-editor
      v-model="editable.content"
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
      @click="$emit('update-note', editable)"
    />
  </div>
</template>


<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['note'])
const emit = defineEmits(['update-note', 'refresh'])

const editable = ref({ ...props.note })
//const currentDate = new Date().toLocaleDateString()

watch(() => props.note, (newVal) => {
  editable.value = { ...newVal }
})

</script>
