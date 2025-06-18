<template>
  <div>
    <div class="text-h6">Notebooks</div>
    <!--Kartice za Prikaz Notes-->
    <q-btn
      v-for="kljucNotebook in notebooks"
      :key="kljucNotebook "
      label="placeholder"
      class="full-width"
      :style="{backgroundColor: notebook === selectedNotebook ? '#2d2d2d' : '#2b2b2b',color:'white'}"
      @click="$emit('select-notebook', kljucNotebook)"
    />
    <!--<q-separator class="q-my-md" />-->

    <!--klik na show all notes postavi null na selection (umjesto kljuca)-->
    <q-item clickable @click="$emit('select-notebook', null)">
      <q-item-section>Show all notes</q-item-section>
    </q-item>
  </div>
</template>

<script setup>
//ocekuje se notebooks i selectedNotebook od strane indexpage-a
defineProps(['notebooks', 'selectedNotebook'])
//emits moze vratiti odabrani notebook parentu
defineEmits(['select-notebook'])
</script>
