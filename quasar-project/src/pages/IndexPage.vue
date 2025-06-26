<template>
  <q-page class="text-white page-black">
    <div class="row full-height">
      <div class="col-12 col-md-3 bg-sidepanel">
        <!--(liejva)komponenta za prikaz Notes  src>components-->
        <SidebarPanel
          :notebooks="notebooks"
          :ActiveNotebook="ActiveNotebook"
          @odabirKnjige="ActiveNotebookFunction"
          @refresh="DohvatiNotebooks"/>
      </div>

      <!-- Notes List -->
      <div class="col-12 col-md-4 bg-notelist">
        <NotesList
          :notes="filteredNotes"
          :ActiveNote="ActiveNote"
          :ActiveNotebook="ActiveNotebook"
          :notebooks="notebooks"
          @OdabranNote="ActiveNoteFunction"
          @refresh="DohvatiNotebooks"/>
      </div>

      <!-- Editor -->
      <div class="col-12 col-md-5 q-pa-sm bg-editor">
        <div class="preview-label">Preview</div>
        <div class="sync-btn">
          <q-btn
            flat
            @click="DohvatiNotebooks"
            class="sync-icon-btn">
            <img src="../syncimg.png" class="sync-icon" />
          </q-btn>
        </div>
        <div class="empty-img-container" v-if="!ActiveNote">
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
      date: TrenutniDokument.data().DateEdited || '-',
      DateEdited: TrenutniDokument.data().DateEdited || null

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
  const allNotes = notebooks.value.flatMap(n => n.notes)

  if (ActiveNotebook.value) {
    const notebook = notebooks.value.find(n => n.id === ActiveNotebook.value)
    return notebook ? notebook.notes : []
  }

  // ako nema aktivnog notebooka, vrati sve i sortiraj po lastEdited
  return [...allNotes].sort((a, b) => {
  const aTime = new Date(a.DateEdited || 0)
  const bTime = new Date(b.DateEdited || 0)
  return bTime - aTime
})
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
      NoteContent: updatedNote.content,
      DateEdited: new Date().toISOString()
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
