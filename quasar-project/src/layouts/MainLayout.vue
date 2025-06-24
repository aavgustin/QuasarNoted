<template>
  <q-layout>
    <q-header>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
defineOptions({
  name: 'MainLayout'
})

</script>
