<template>
  <div>
    <div class="row">
    <div class="col-11"> Preview</div>
    <div class="col-1">
      <q-btn
        flat
        @click="$emit('refresh')"
        style="padding: 0; min-width: 0;">
      <img src="../syncimg.png" style="height: 40px;">
      </q-btn>
    </div>
    </div>
    <q-input v-model="editable.title" label="Title" class="q-mb-sm" style="background-color: white;" />
    <div style="color:#f8d02e">Notebook: {{ editable.notebook }}</div>
    <q-editor
      v-model="editable.content"
      height="420px"
      class="text-white"
      style="background-color: #242424;"/>
    <div style="padding-left: 90%;">
    <q-btn
      color="yellow"
      round
      text-color="black"
      label="✔"
      class="q-mt-md"
      @click="$emit('update-note', editable)"/>
  </div></div>


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
