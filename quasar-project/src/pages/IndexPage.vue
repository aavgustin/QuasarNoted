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
async function DohvatiNotebooks(){
  const querySnapshot = await getDocs(collection(db, "notebooks"));
  const result=[]
  //loop kroz sve notebook dokumente
  for (const doc of querySnapshot.docs){
    const notebookId= doc.id
    const notebookPodaci= doc.data()
    // || notebookId je tu ako ne postoji ime filea
    const notebookName= notebookPodaci.NotebookName || notebookId
    
    //dohvat Notes iz Notebookova
    //pohrana svih notes iz svake iteracija novog notebooka
    const notesVarijabla = await getDocs(collection(db, `notebooks/${notebookId}/notes`))
    const notes = notesVarijabla.docs.map(TrenutniDokument => ({
      //mapiranje podataka dokumenta u array
      id: TrenutniDokument.id,
      title: TrenutniDokument.data().NoteName,
      content: TrenutniDokument.data().NoteContent,
      notebook: notebookName,
      date: '-'
    }))
    //stvaranje i guranje objekta u variablu const notebooks
    result.push({
      id: notebookId,
      name: notebookName,
      notes
    })
  }

  notebooks.value = result
  console.log("Notebooks loaded:", result)

}
onMounted(DohvatiNotebooks)
//onMounted(DohvatiNotes)

const filteredNotes = computed(() => {
  if (selectedNotebook.value) {
    console.log("Selected notebook:", selectedNotebook.value)
    console.log("Filtered notes:", filteredNotes.value)
    const notebook = notebooks.value.find(n => n.name === selectedNotebook.value)
    return notebook ? notebook.notes : []
  } else {
    // spoji sve bilješke iz svih notesa
    return notebooks.value.flatMap(n => n.notes)
    
  }
})



function handleSelectNotebook(name) {
  selectedNotebook.value = name
  selectedNote.value = null
}

function handleSelectNote(note) {
  selectedNote.value = note
}

function handleUpdateNote(updatedNote) {
  const notebook = notebooks.value.find(n => n.id === selectedNotebook.value)
  if (!notebook) return
  const index = notebook.notes.findIndex(n => n.id === updatedNote.id)
  if (index !== -1) notebook.notes[index] = updatedNote
}

</script>
