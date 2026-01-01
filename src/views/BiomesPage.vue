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

const filteredBiomes = () => {
  if (!searchQuery.value) return coordinatesStore.biomes;
  const query = searchQuery.value.toLowerCase();
  return coordinatesStore.biomes.filter(
    b => b.name.toLowerCase().includes(query) || b.type.toLowerCase().includes(query)
  );
};
</script>

<template>
  <div class="h-full bg-zinc-900 overflow-auto styled-scrollbar">
    <main class="max-w-7xl mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">Biomes</h1>
          <p class="text-zinc-400 text-sm">
            Coordonnées des biomes rares et intéressants
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
            placeholder="Rechercher un biome..."
            class="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
          />
        </div>
      </div>

      <div v-if="coordinatesStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="bg-zinc-800/50 rounded-xl h-40 animate-pulse"></div>
      </div>

      <div v-else-if="filteredBiomes().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CoordinateCard
          v-for="biome in filteredBiomes()"
          :key="biome.id"
          :coordinate="biome"
        />
      </div>

      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-zinc-400 text-lg">Aucun biome enregistré</p>
        <p v-if="userStore.isLoggedIn" class="text-zinc-500 text-sm mt-1">
          Clique sur "Ajouter" pour enregistrer le premier biome
        </p>
        <p v-else class="text-zinc-500 text-sm mt-1">
          Connecte-toi pour ajouter des coordonnées
        </p>
      </div>
    </main>

    <AddCoordinateModal
      :show="showAddModal"
      category="biome"
      @close="showAddModal = false"
    />
  </div>
</template>
