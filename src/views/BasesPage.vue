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

const filteredBases = () => {
  if (!searchQuery.value) return coordinatesStore.bases;
  const query = searchQuery.value.toLowerCase();
  return coordinatesStore.bases.filter(
    b => b.name.toLowerCase().includes(query) || b.type.toLowerCase().includes(query) || b.addedBy.toLowerCase().includes(query)
  );
};
</script>

<template>
  <div class="h-full bg-zinc-900 overflow-auto styled-scrollbar">
    <main class="max-w-7xl mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">Bases</h1>
          <p class="text-zinc-400 text-sm">
            Emplacements des bases des joueurs
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
            placeholder="Rechercher une base..."
            class="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
          />
        </div>
      </div>

      <div v-if="coordinatesStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="bg-zinc-800/50 rounded-xl h-40 animate-pulse"></div>
      </div>

      <div v-else-if="filteredBases().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CoordinateCard
          v-for="base in filteredBases()"
          :key="base.id"
          :coordinate="base"
        />
      </div>

      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <p class="text-zinc-400 text-lg">Aucune base enregistrée</p>
        <p v-if="userStore.isLoggedIn" class="text-zinc-500 text-sm mt-1">
          Clique sur "Ajouter" pour enregistrer ta base
        </p>
        <p v-else class="text-zinc-500 text-sm mt-1">
          Connecte-toi pour ajouter des coordonnées
        </p>
      </div>
    </main>

    <AddCoordinateModal
      :show="showAddModal"
      category="base"
      @close="showAddModal = false"
    />
  </div>
</template>
