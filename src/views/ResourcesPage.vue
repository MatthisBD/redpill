<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCoordinatesStore } from '@/stores/coordinatesStore';
import { useUserStore } from '@/stores/userStore';
import CoordinateCard from '@/components/CoordinateCard.vue';
import AddCoordinateModal from '@/components/AddCoordinateModal.vue';
import Button from '@/components/ui/Button.vue';

const coordinatesStore = useCoordinatesStore();
const userStore = useUserStore();
const showAddModal = ref(false);
const searchQuery = ref('');

onMounted(() => {
  if (coordinatesStore.coordinates.length === 0) {
    coordinatesStore.fetchCoordinates();
  }
});

const filteredResources = () => {
  if (!searchQuery.value) return coordinatesStore.resources;
  const query = searchQuery.value.toLowerCase();
  return coordinatesStore.resources.filter(
    r => r.name.toLowerCase().includes(query) || r.type.toLowerCase().includes(query)
  );
};
</script>

<template>
  <div class="h-full bg-zinc-900 overflow-auto styled-scrollbar">
    <main class="max-w-7xl mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">Ressources</h1>
          <p class="text-zinc-400 text-sm">
            Spots de minage, spawners et points d'intérêt
          </p>
        </div>
        <Button
          v-if="userStore.isLoggedIn"
          @click="showAddModal = true"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Ajouter
        </Button>
      </div>

      <div class="mb-6">
        <div class="relative">
          <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une ressource..."
            class="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
          />
        </div>
      </div>

      <div v-if="coordinatesStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="bg-zinc-800/50 rounded-xl h-40 animate-pulse"></div>
      </div>

      <div v-else-if="filteredResources().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CoordinateCard
          v-for="resource in filteredResources()"
          :key="resource.id"
          :coordinate="resource"
        />
      </div>

      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <p class="text-zinc-400 text-lg">Aucune ressource enregistrée</p>
        <p v-if="userStore.isLoggedIn" class="text-zinc-500 text-sm mt-1">
          Clique sur "Ajouter" pour enregistrer un spot
        </p>
        <p v-else class="text-zinc-500 text-sm mt-1">
          Connecte-toi pour ajouter des coordonnées
        </p>
      </div>
    </main>

    <AddCoordinateModal
      :show="showAddModal"
      category="resource"
      @close="showAddModal = false"
    />
  </div>
</template>
