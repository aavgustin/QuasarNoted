<template>
  <q-page class="text-white" style="background-color: black">
    <div class="row" style="height: 100vh;">
      <div class="col-3" style="background-color: #393939;">
      
        <!--(liejva)komponenta za prikaz Notes  src>components-->
        <SidebarPanel
          :notebooks="notebooks"
          :ActiveNotebook="ActiveNotebook"
          @odabirKnjige="ActiveNotebookFunction"
          @refresh="DohvatiNotebooks"/>
      </div>

      <!-- Notes List -->
      <div class="col-4" style="background-color: #2d2d2d;">
        
        <NotesList
          :notes="filteredNotes"
          :ActiveNote="ActiveNote"
          :ActiveNotebook="ActiveNotebook"
          :notebooks="notebooks"
          @OdabranNote="ActiveNoteFunction"
          @refresh="DohvatiNotebooks"/>
      </div>

      <!-- Editor -->
      <div class="col-5 q-pa-sm" style="background-color: #242424;">
        <div style="padding-top:30%;padding-left: 3%;" v-if="!ActiveNote">
        <img src="../empty.png">
        </div>
        <NoteEditor
          v-if="ActiveNote"
          :note="ActiveNote"
          @update-note="NoteWrite"
          @refresh="DohvatiNotebooks"/>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore'
import { db } from 'src/firebase/firebase'
import SidebarPanel from 'components/SidebarPanel.vue'
import NotesList from 'components/NotesList.vue'
import NoteEditor from 'components/NoteEditor.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const notebooks = ref([])
const ActiveNotebook = ref(null)
const ActiveNote = ref(null)

//dohvat notebooka pri loadanju
onMounted(DohvatiNotebooks)

async function DohvatiNotebooks(){
  const querySnapshot = await getDocs(collection(db, "notebooks"));
  const result=[]
  //loop kroz sve notebook dokumente
  for (const doc of querySnapshot.docs){
    const notebookId= doc.id
    const notebookPodaci= doc.data()
    // || notebookId ak ne postoji ime filea
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
}

const filteredNotes = computed(() => {
  if (ActiveNotebook.value) {
    const notebook = notebooks.value.find(n => n.id === ActiveNotebook.value)
    return notebook ? notebook.notes : []
  } else {
    // spoji sve bilješke iz svih notesa
    return notebooks.value.flatMap(n => n.notes)
    
  }
})

function ActiveNotebookFunction(id) {
  ActiveNotebook.value = id
  ActiveNote.value = null
}

function ActiveNoteFunction(note) {
  ActiveNote.value = note
}

async function NoteWrite(updatedNote) {
  const notebook = notebooks.value.find(n => n.name === updatedNote.notebook)
  if (!notebook) return
  const index = notebook.notes.findIndex(n => n.id === updatedNote.id)
  if (index !== -1){
    const noteRef = doc(db, `notebooks/${notebook.id}/notes/${updatedNote.id}`)
    
    await updateDoc(noteRef, {
      NoteName: updatedNote.title,
      NoteContent: updatedNote.content
    })
    await DohvatiNotebooks();
    $q.notify({
        message: 'Note updated',
        position: 'bottom',
        timeout: 2000,
        type:'warning'
      })
}}
</script>
