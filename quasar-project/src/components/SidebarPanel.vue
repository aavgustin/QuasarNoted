<template>
  <div class="row">
    <div class="logo-container">
      <img src="src/logo.png" />
    </div>

    <q-input
      class="notebook-input"
      v-model="searchNotebook"
      outlined
      bg-color="white"
      label="Notebooks:"/>

    <!--quasarov button <q-btn> umjesto standardnog html <button>-->
    <div class="add-btn-container">
      <q-btn
        class="add-btn"
        round
        label="+"
        color="yellow"
        text-color="black"
        @click="showDialog = true"/>
    </div>
  </div>

  <!--popup dialog za dodavanje knjige u firebase-->
  <div>
    <q-dialog v-model="showDialog">
      <q-card class="dialog-card">
        <q-card-section>
          <div>Create notebook</div>
          <q-input v-model="newNotebookName" label="Notebook:" />
        </q-card-section>
        <q-card-actions>
          <q-btn label="Exit" v-close-popup/>
          <q-btn label="Create" color="primary" @click="addNotebook"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <!--dialog za potvrdu brisanja-->
  <q-dialog v-model="deleteDialogVisible">
    <q-card class="dialog-card">
      <q-card-section>Delete Notebook?</q-card-section>
      <q-card-actions>
        <q-btn label="Exit" v-close-popup />
        <q-btn label="Delete" color="primary" @click="confirmDeleteNotebook" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <div class="spacer"></div>

  <!--ptelja za prikazat notebook-->
  <div
    v-for="notebook in filteredNotebooks"
    :key="notebook.id"
    class="row items-center q-my-xs">
    <q-btn
      class="col notebook-btn"
      :label="notebook.name"
      :style="{ backgroundColor: notebook.id === ActiveNotebook ? '#f8d02e' : '#2b2b2b', color: 'white' }"
      @click="$emit('odabirKnjige', notebook.id)"/>

    <!--tipka za brianje notebooka-->
    <q-btn
      flat
      dense
      @click.stop="triggerDelete(notebook)"
      class="delete-btn">
      <img src="../delete.png" class="delete-icon" />
    </q-btn>
  </div>

  <!--klik na show all notes postavi "null" na selection (umjesto kljuca)-->
  <q-item clickable @click="$emit('odabirKnjige', null)">
    <div class="clear-label">
      <q-item-section>Clear</q-item-section>
    </div>
  </q-item>
</template>



<script setup>
import { ref, computed } from 'vue'
import { db } from 'src/firebase/firebase'
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'

//povratak notebooks i ActiveNotebook strane indexpage-a
//Povratat odabranog notebooka parentu
const props = defineProps(['notebooks', 'ActiveNotebook'])
const emit = defineEmits(['odabirKnjige', 'refresh'])

//pretraga notebook u input feild
const searchNotebook = ref('');
const filteredNotebooks = computed(() => {
  const term = searchNotebook.value.toLowerCase()
  return props.notebooks.filter(n =>
    n.name.toLowerCase().includes(term)
  )
})



//po defaultu dialog zatvoren a naziv knjige prazan
const showDialog = ref(false)
const newNotebookName = ref('')


//dialog za brisanje iskljucen a notebook za brisanje ne ordreden
const deleteDialogVisible = ref(false)
const notebookToDelete = ref(null)

async function addNotebook() {
  if (!newNotebookName.value.trim()) return

  //dodavanje novog notebooka firebasu
  try {
    await addDoc(collection(db, 'notebooks'), {
      NotebookName: newNotebookName.value.trim()
    })
    emit('refresh')
    showDialog.value = false
    newNotebookName.value = ''
  } catch (e) {
    console.error('Error', e)
  }
}

//otvaranje dialoga za briasnje notebooka i postavljanje varijable koji notebook se zeli brisat
function triggerDelete(notebook) {
  notebookToDelete.value = notebook
  deleteDialogVisible.value = true
}

//brisanje notebooka u firebase
async function confirmDeleteNotebook() {
  const notebook = notebookToDelete.value
  if (!notebook) return

  try {
    const notesSnapshot = await getDocs(collection(db, `notebooks/${notebook.id}/notes`))
    for (const noteDoc of notesSnapshot.docs) {
      await deleteDoc(doc(db, `notebooks/${notebook.id}/notes/${noteDoc.id}`))
    }

    await deleteDoc(doc(db, `notebooks/${notebook.id}`))
    emit('refresh')
    deleteDialogVisible.value = false
    notebookToDelete.value = null
  } catch (e) {
    console.error('Error', e)
  }
}

</script>
