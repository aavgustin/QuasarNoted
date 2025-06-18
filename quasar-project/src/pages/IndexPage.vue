<template>
  <q-page class="q-pa-sm bg-grey-10 text-white">
    <div class="row full-height no-wrap">
      <!-- Sidebar -->
      <div class="col-3" style="background-color: grey;">
        <!--(liejva)komponenta za prikaz Notes  src>components-->
        <SidebarPanel
          :notebooks="notebooks"
          :selectedNotebook="selectedNotebook"
          @select-notebook="handleSelectNotebook"
        />
      </div>

      <!-- Notes List -->
      <div class="col-4 q-pa-sm bg-grey-8">
        <NotesList
          :notes="filteredNotes"
          :selectedNote="selectedNote"
          @select-note="handleSelectNote"
        />
      </div>

      <!-- Editor -->
      <div class="col-5 q-pa-sm bg-grey-7">
        <NoteEditor
          v-if="selectedNote"
          :note="selectedNote"
          @update-note="handleUpdateNote"
        />
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from 'src/firebase/firebase'
import SidebarPanel from 'components/SidebarPanel.vue'
import NotesList from 'components/NotesList.vue'
import NoteEditor from 'components/NoteEditor.vue'

// Fake demo data
const notebooks = ref([])
const notes = ref([])

const selectedNotebook = ref(null)
const selectedNote = ref(null)

async function DohvatiNotes() {
  const querySnapshot = await getDocs(collection(db, 'notes'))
  const allNotes = []
  const uniqueNotebooks = new Set()
querySnapshot.forEach(doc => {
    const data = doc.data()
    allNotes.push({
      id: doc.id,
      title: data.Naslov,
      content: data.Content,
      notebook: data.notebook || 'Uncategorized',
      date: '—' // you can replace this with a timestamp if stored
    })
    uniqueNotebooks.add(data.notebook || 'Uncategorized')
  })

  notes.value = allNotes
  notebooks.value = Array.from(uniqueNotebooks)
}

onMounted(DohvatiNotes)

const filteredNotes = computed(() =>
  selectedNotebook.value
    ? notes.value.filter(n => n.notebook === selectedNotebook.value)
    : notes.value
)

function handleSelectNotebook(name) {
  selectedNotebook.value = name
  selectedNote.value = null
}

function handleSelectNote(note) {
  selectedNote.value = note
}

function handleUpdateNote(updatedNote) {
  const index = notes.value.findIndex(n => n.id === updatedNote.id)
  if (index !== -1) notes.value[index] = updatedNote
}
</script>
