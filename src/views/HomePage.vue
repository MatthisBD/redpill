<script setup lang="ts">
import { onMounted } from 'vue';
import { useCoordinatesStore } from '@/stores/coordinatesStore';
import CoordinateCard from '@/components/CoordinateCard.vue';

const coordinatesStore = useCoordinatesStore();

onMounted(() => {
  coordinatesStore.fetchCoordinates();
});

const categories = [
  {
    name: 'Biomes',
    path: '/biomes',
    icon: 'globe',
    color: 'from-emerald-500 to-teal-500',
    description: 'Coordonnées des biomes rares et intéressants',
  },
  {
    name: 'Bases',
    path: '/bases',
    icon: 'home',
    color: 'from-blue-500 to-indigo-500',
    description: 'Emplacements des bases des joueurs',
  },
  {
    name: 'Ressources',
    path: '/resources',
    icon: 'cube',
    color: 'from-amber-500 to-orange-500',
    description: 'Spots de minage, spawners et points d\'intérêt',
  },
];
</script>

<template>
  <div class="h-full bg-zinc-900 overflow-auto styled-scrollbar">
    <main class="max-w-7xl mx-auto p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">
          Bienvenue sur
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">RedPill</span>
        </h1>
        <p class="text-zinc-400">
          Gérez et partagez les coordonnées de votre serveur Minecraft
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 transition">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ coordinatesStore.biomes.length }}</p>
              <p class="text-sm text-zinc-400">Biomes</p>
            </div>
          </div>
        </div>
        <div class="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 transition">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ coordinatesStore.bases.length }}</p>
              <p class="text-sm text-zinc-400">Bases</p>
            </div>
          </div>
        </div>
        <div class="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 transition">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ coordinatesStore.resources.length }}</p>
              <p class="text-sm text-zinc-400">Ressources</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <router-link
          v-for="cat in categories"
          :key="cat.path"
          :to="cat.path"
          class="bg-zinc-900 rounded-xl border border-zinc-800 p-6 hover:border-zinc-700 transition group"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              :class="[
                'w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center',
                cat.color,
              ]"
            >
              <svg v-if="cat.icon === 'globe'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <svg v-else-if="cat.icon === 'home'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-zinc-100 group-hover:text-white transition">{{ cat.name }}</h2>
              <p class="text-sm text-zinc-500">{{ cat.description }}</p>
            </div>
          </div>
          <div class="flex items-center justify-end text-red-400 text-sm font-medium">
            Voir tout
            <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </router-link>
      </div>

      <!-- Recent coordinates -->
      <div v-if="coordinatesStore.coordinates.length > 0">
        <h2 class="text-xl font-semibold text-zinc-100 mb-4">Derniers ajouts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CoordinateCard
            v-for="coord in coordinatesStore.coordinates.slice(0, 6)"
            :key="coord.id"
            :coordinate="coord"
          />
        </div>
      </div>

      <div v-else-if="!coordinatesStore.isLoading" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <p class="text-zinc-400 text-lg">Aucune coordonnée pour le moment</p>
        <p class="text-zinc-500 text-sm mt-1">Connecte-toi et ajoute la première !</p>
      </div>
    </main>
  </div>
</template>
