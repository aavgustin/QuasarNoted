<template>
  <div>
    <div class="text-h6">Notebooks</div>
    <!--Kartice za Prikaz Notes-->
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
defineEmits(['odabirKnjige'])
</script>
