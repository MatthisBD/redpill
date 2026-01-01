<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
</script>

<template>
  <div id="app" class="h-screen flex flex-col overflow-hidden bg-zinc-950 text-zinc-100">
    <TheHeader />
    <div class="flex-1 overflow-hidden">
      <router-view />
    </div>
  </div>
</template>

<style scoped></style>
