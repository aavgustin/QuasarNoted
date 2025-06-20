<template>
  <q-page class="q-pa-sm bg-grey-10 text-white">
    <div class="row full-height no-wrap">
      <!-- Sidebar -->
      <div class="col-3 full-height" style="background-color: #393939;">
        <!--(liejva)komponenta za prikaz Notes  src>components-->
        <SidebarPanel
          :notebooks="notebooks"
          :ActiveNotebook="ActiveNotebook"
          @odabirKnjige="handleSelectNotebook"
        />
      </div>

      <!-- Notes List -->
      <div class="col-4 q-pa-sm" style="background-color: #2d2d2d;">
        <NotesList
          :notes="filteredNotes"
          :ActiveNote="ActiveNote"
          @select-note="handleSelectNote"
        />
      </div>

      <!-- Editor -->
      <div class="col-5 q-pa-sm" style="background-color: #242424;">
        <NoteEditor
          v-if="ActiveNote"
          :note="ActiveNote"
          @update-note="NoteWrite"
        />
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from 'src/firebase/firebase'
import SidebarPanel from 'components/SidebarPanel.vue'
import NotesList from 'components/NotesList.vue'
import NoteEditor from 'components/NoteEditor.vue'

const notebooks = ref([])
const ActiveNotebook = ref(null)
const ActiveNote = ref(null)

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
  if (ActiveNotebook.value) {
    console.log("Selected notebook:", ActiveNotebook.value)
    console.log("Filtered notes:", filteredNotes.value)
    const notebook = notebooks.value.find(n => n.name === ActiveNotebook.value)
    return notebook ? notebook.notes : []
  } else {
    // spoji sve bilješke iz svih notesa
    return notebooks.value.flatMap(n => n.notes)
    
  }
})

function handleSelectNotebook(id) {
  ActiveNotebook.value = id
  ActiveNote.value = null
}

function handleSelectNote(note) {
  ActiveNote.value = note
}

async function NoteWrite(updatedNote) {
  const notebook = notebooks.value.find(n => n.name === updatedNote.notebook)
  if (!notebook) return
  const index = notebook.notes.findIndex(n => n.id === updatedNote.id)
  if (index !== -1){
    notebook.notes[index] = updatedNote
    const noteRef = doc(db, `notebooks/${notebook.id}/notes/${updatedNote.id}`)
    
    await updateDoc(noteRef, {
      NoteName: updatedNote.title,
      NoteContent: updatedNote.content
    })
    console.log("Note Updated", updatedNote.id)
    
  }
}

</script>
