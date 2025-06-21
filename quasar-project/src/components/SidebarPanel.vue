<template>
    <div class="row">
    <div style="font-size: 20px;">Notebooks</div>
    <!--quasarov button <q-btn> umjesto standardnog html <button>-->
    <q-btn
    class="q-ml-auto"
    label="+"
    color="yellow"
    text-color="black"
    @click="showDialog = true"/>
    </div>
  <!--popup dialog za dodavanje knjige u firebase-->
<div>
<q-dialog v-model="showDialog">
  <q-card style="height: 500px; width: 500px;">
    <q-card-section>
      <div class="text-h6">Create notebook</div>
      <q-input v-model="newNotebookName" label="Notebook:" />
    </q-card-section>
    <q-card-actions>
      <q-btn label="Cancel" v-close-popup />
      <q-btn label="Create" @click="addNotebook" />
    </q-card-actions>
  </q-card>
</q-dialog>
</div>
  <div>
    <!--ptelja za prikazat notebook-->
    <q-btn
      v-for="notebook in notebooks"
      :key="notebook.id"
      :label="notebook.name"
      class="full-width"
      :style="{backgroundColor: notebook === ActiveNotebook ? '#2d2d2d' : '#2b2b2b',color:'white'}"
      @click="$emit('odabirKnjige', notebook.id)"
    />
    <!--<q-separator class="q-my-md" />-->

    <!--klik na show all notes postavi null na selection (umjesto kljuca)-->
    <q-item clickable @click="$emit('odabirKnjige', null)">
      <q-item-section>Show all notes</q-item-section>
    </q-item>
  </div>
</template>

<script setup>
//povratak notebooks i ActiveNotebook strane indexpage-a
defineProps(['notebooks', 'ActiveNotebook'])
//Povratat odabranog notebooka parentu
const emit = defineEmits(['odabirKnjige', 'refresh'])
//po defaultu dialog zatvoren a naziv knjige prazan
const showDialog = ref(false)
const newNotebookName = ref('')
//ref vue za popup dialog
import { ref } from 'vue'
import { db } from 'src/firebase/firebase'
import { collection, addDoc } from 'firebase/firestore'

async function addNotebook() {
  if (!newNotebookName.value.trim()) return

  try {
    await addDoc(collection(db, 'notebooks'), {
      NotebookName: newNotebookName.value.trim()
    })
    emit('refresh')
    showDialog.value = false
    newNotebookName.value = ''
  } catch (e) {
    console.error('Error adding notebook:', e)
  }
}


</script>
