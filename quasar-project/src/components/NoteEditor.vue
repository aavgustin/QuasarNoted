<template>
  <div>
    <q-input v-model="editable.title" label="Title" class="q-mb-sm" />
    <q-input v-model="editable.notebook" label="Notebook" class="q-mb-sm" />
    <q-editor
      v-model="editable.content"
      height="300px"
      class="bg-white text-black"
    />
    <q-btn
      color="positive"
      icon="check"
      label="Save"
      class="q-mt-md"
      @click="$emit('update-note', editable)"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['note'])
const emit = defineEmits(['update-note'])

const editable = ref({ ...props.note })

watch(() => props.note, (newVal) => {
  editable.value = { ...newVal }
})
</script>
