<template>
  <div>
    <div class="row">
    <div div style="font-size: 20px;">Notes</div>
    <q-btn
    class="q-ml-auto"
    label="+"
    color="yellow"
    text-color="black"
    @click="showDialog = true"/>
    </div>
    <!--dialog-->
    <q-dialog v-model="showDialog">
    <q-card style="height: 500px; width: 500px;">
      <q-card-section>
        <div class="text-h6">Create Note</div>
        <q-select
          v-model="selectedNotebookId"
          :options="notebooks.map(n => n.id)"
          :option-label="val => notebooks.find(n => n.id === val)?.name || val"
          label="Select Notebook"
          dense
          outlined
          class="q-mb-sm"
        />
        <q-input
          v-model="newNoteName"
          label="Note Title"
          dense
          outlined
          class="q-mb-sm"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Cancel" v-close-popup />
        <q-btn label="Create" color="primary" @click="addNote" />
      </q-card-actions>
    </q-card>
  </q-dialog>

    <!--notes-->
    <q-card
      v-for="note in notes"
      :key="note.id"
      class="q-mb-sm"
      @click="$emit('select-note', note)"
      :class="{ 'text-white': note.id === ActiveNote?.id }"
      :style="{ backgroundColor: note.notebook === ActiveNotebook ? '#2d2d2d' : '#2b2b2b', color: 'white' }">


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
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from 'src/firebase/firebase'

const props = defineProps(['notes', 'ActiveNote', 'notebooks', 'ActiveNotebook']) // <-- Add notebooks as a prop
const emit = defineEmits(['select-note', 'refresh-data']) // <-- optional emit to reload notes

const showDialog = ref(false)
const selectedNotebookId = ref('')
const newNoteName = ref('')

async function addNote() {
  console.log("addNote triggered")
  console.log("Notebook ID:", selectedNotebookId.value)
  console.log("Note Name:", newNoteName.value)

  if (!selectedNotebookId.value || !newNoteName.value) {
    console.warn("Missing required fields")
    return
  }

  try {
    const docRef = await addDoc(collection(db, `notebooks/${selectedNotebookId.value}/notes`), {
      NoteName: newNoteName.value,
      NoteContent: "" // optional, but needed to avoid Firebase schema issues
    })

    console.log("Note successfully created with ID:", docRef.id)
    
    showDialog.value = false
    newNoteName.value = ''
    
    // emit event to refresh data from Firebase (if parent listens to it)
    emit('refresh-data')
  } catch (error) {
    console.error("Error adding note:", error)
  }
}

</script>

