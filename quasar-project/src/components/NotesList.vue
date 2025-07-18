<template>
  <div>
    <div class="title-section">
      {{ props.ActiveNotebook 
      ? (props.notebooks.find(n => n.id === props.ActiveNotebook)?.name) 
      : 'Recently edited' 
      }}
    </div>

    <div class="row search-create-section">
      <q-input
        class="search-input"
        v-model="searchNotes"
        outlined
        bg-color="white"
        label="Notes:" />
      <div class="add-button-wrapper">
        <q-btn
          label="+"
          round
          color="yellow"
          text-color="black"
          @click="CreateDialog = true" />
      </div>
    </div>

    <!--dialog za novi note-->
    <q-dialog v-model="CreateDialog">
      <q-card class="note-dialog">
        <q-card-section>
          <div>Create Note</div>
          <q-select
            v-model="selectedNotebookId"
            :options="notebooks.map(n => n.id)"
            :option-label="val => notebooks.find(n => n.id === val)?.name || val"
            label="Select Notebook" />
          <q-input
            v-model="newNoteName"
            label="Note Title" />
        </q-card-section>
        <q-card-actions>
          <q-btn label="Cancel" v-close-popup />
          <q-btn label="Create" color="primary" @click="addNote" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--q-card za kartice notea-->
    <div class="notes-scroll" style="padding-top: 20px;">
      <q-card
        v-for="note in filteredNotes"
        :key="note.id"
        class="note-card"
        :class="{ 'text-white': note.id === ActiveNote?.id }"
        :style="{ backgroundColor: note.notebook === ActiveNotebook ? '#2d2d2d' : '#2b2b2b', color: 'white' }"
      >
        <q-card-section class="row items-center">
          <div class="col" @click="$emit('OdabranNote', note)" style="cursor: pointer;">
            <div class="note-title">{{ note.title }}</div>
            <div class="ellipsis">{{ note.content }}</div>
            <div class="note-notebook">
              In notebook: {{ note.notebook }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn flat dense @click.stop="deleteNote(note)" class="delete-btn">
              <img src="../delete.png" class="delete-icon" />
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="DeleteDialog">
      <q-card class="dialog-card">
        <q-card-section>
          delete?
        </q-card-section>

        <q-card-actions>
          <q-btn label="Exit" v-close-popup />
          <q-btn label="Delete" color=primary @click="confirmDeleteNote" />
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

const CreateDialog = ref(false)
const selectedNotebookId = ref('')
const newNoteName = ref('')

//preraga noteova
const searchNotes = ref('');
const filteredNotes = computed(() => {
const term = searchNotes.value.toLowerCase()

  // notes iz aktivnog notebooak
  if (props.ActiveNotebook) {
    return props.notes.filter(n =>
      props.notebooks.find(nb => nb.id === props.ActiveNotebook)?.name === n.notebook &&
      n.title.toLowerCase().includes(term)
    )
  }

  // recentlyedited
  return [...props.notes]
    .filter(n => n.title.toLowerCase().includes(term))
    .sort((a, b) => {
      const aTime = new Date(a.lastEdited || 0)
      const bTime = new Date(b.lastEdited || 0)
      return bTime - aTime
    })
})

// provjera ako se zeli izbrisati
const DeleteDialog = ref(false)
const noteToDelete = ref(null)

async function addNote() {
  if (!selectedNotebookId.value || !newNoteName.value) return

  try {
    await addDoc(collection(db, `notebooks/${selectedNotebookId.value}/notes`), {
      NoteName: newNoteName.value,
      NoteContent: "",
      DateEdited: new Date().toISOString()
    })
    CreateDialog.value = false
    newNoteName.value = ''
    emit('refresh')
  } catch (error) {
    console.error("Error adding note:", error)
  }
}

function deleteNote(note) {
  noteToDelete.value = note
  DeleteDialog.value = true
}

async function confirmDeleteNote() {
  const note = noteToDelete.value
  if (!note) return

  const notebook = props.notebooks.find(n => n.name === note.notebook)
  if (!notebook) return

  try {
    await deleteDoc(doc(db, `notebooks/${notebook.id}/notes/${note.id}`))
    DeleteDialog.value = false
    noteToDelete.value = null
    emit('refresh')
  } catch (error) {
    console.error("Error", error)
  }
}
</script>

