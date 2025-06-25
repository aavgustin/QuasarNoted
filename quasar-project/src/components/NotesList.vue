<template>
  <div>
    <div class="row" style="padding-left:60px;padding-top: 115px;">
    <q-input style="padding-left: 20px; width: 270px;"
      v-model="searchNotes"
      outlined
      bg-color="white"
      label="Notes:"
      class="q-my-sm"/>
    <div style="padding-top: 15px; padding-left: 20px;">
    <q-btn
    label="+"
    round
    color="yellow"
    text-color="black"
    @click="showDialog = true"/>
    </div>
    </div>
    <!--dialog za novi note-->
    <q-dialog v-model="showDialog">
    <q-card style="height: 500px; width: 500px;">
      <q-card-section>
        <div>Create Note</div>
        <q-select
          v-model="selectedNotebookId"
          :options="notebooks.map(n => n.id)"
          :option-label="val => notebooks.find(n => n.id === val)?.name || val"
          label="Select Notebook"/>
        <q-input
          v-model="newNoteName"
          label="Note Title"/>
      </q-card-section>
      <q-card-actions>
        <q-btn label="Cancel" v-close-popup />
        <q-btn label="Create" color="primary" @click="addNote" />
      </q-card-actions>
    </q-card>
  </q-dialog>

    <!--q-card za kartice notea-->
<q-card
  v-for="note in filteredNotes"
  :key="note.id"
  class="q-mb-sm"
  :class="{ 'text-white': note.id === ActiveNote?.id }"
  :style="{ backgroundColor: note.notebook === ActiveNotebook ? '#2d2d2d' : '#2b2b2b', color: 'white' }"
>
  <q-card-section class="row items-center">
    <div class="col" @click="$emit('OdabranNote', note)" style="cursor: pointer;">
      <div class="text-subtitle1">{{ note.title }}</div>
      <div class="text-caption text-grey">
        {{ note.date }} - In notebook: {{ note.notebook }}
      </div>
      <div class="ellipsis">{{ note.content.slice(0, 100) }}</div>
    </div>
    
    <!-- button za brisanje notea -->
    <div class="col-auto">
      <q-btn
        flat
        dense
        @click.stop="deleteNote(note)"
        style="padding: 4px;">
        <img src="../delete.png" style="height: 20px;" />
      </q-btn>
    </div>
  </q-card-section>
</q-card>
<q-dialog v-model="deleteDialogVisible">
  <q-card>
    <q-card-section class="text-h6">
      Are you sure you want to delete this note?
    </q-card-section>

    <q-card-actions>
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn flat label="Delete" color="negative" @click="confirmDeleteNote" />
    </q-card-actions>
  </q-card>
</q-dialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from 'src/firebase/firebase'

const props = defineProps(['notes', 'ActiveNote', 'notebooks', 'ActiveNotebook'])
const emit = defineEmits(['OdabranNote', 'refresh'])

const showDialog = ref(false)
const selectedNotebookId = ref('')
const newNoteName = ref('')

//preraga noteova
const searchNotes = ref('');
const filteredNotes = computed(() => {
  const term = searchNotes.value.toLowerCase()
  return props.notes.filter(n =>
    n.title.toLowerCase().includes(term)
  )
})

// provjera ako se zeli izbrisati
const deleteDialogVisible = ref(false)
const noteToDelete = ref(null)

async function addNote() {
  if (!selectedNotebookId.value || !newNoteName.value) return

  try {
    await addDoc(collection(db, `notebooks/${selectedNotebookId.value}/notes`), {
      NoteName: newNoteName.value,
      NoteContent: ""
    })
    showDialog.value = false
    newNoteName.value = ''
    emit('refresh')
  } catch (error) {
    console.error("Error adding note:", error)
  }
}

function deleteNote(note) {
  noteToDelete.value = note
  deleteDialogVisible.value = true
}

async function confirmDeleteNote() {
  const note = noteToDelete.value
  if (!note) return

  const notebook = props.notebooks.find(n => n.name === note.notebook)
  if (!notebook) return

  try {
    await deleteDoc(doc(db, `notebooks/${notebook.id}/notes/${note.id}`))
    deleteDialogVisible.value = false
    noteToDelete.value = null
    emit('refresh')
  } catch (error) {
    console.error("Error", error)
  }
}
</script>

