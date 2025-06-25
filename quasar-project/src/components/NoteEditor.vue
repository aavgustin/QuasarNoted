<template>
  <div>
    <div style="padding-top: 5%;" class="row justify-center">
    <q-input v-model="editable.title" label="Title" style="background-color: white; width: 80%;" />
    </div>
    <div class="row justify-center" style="color:#f8d02e">Notebook: {{ editable.notebook }}</div>
    <q-editor
      v-model="editable.content"
      height="420px"
      class="text-white"
      style="background-color: #242424;"
      :toolbar="[
    ['bold', 'italic', 'underline'],
    ['unordered', 'ordered'],
    ['undo', 'redo'],
    ['fullscreen']]"/>
    </div>
    <div style="position: fixed; bottom: 20px; right: 20px;">
    <q-btn
      color="yellow"
      round
      text-color="black"
      label="✔"
      @click="$emit('update-note', editable)"/>
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
