<script setup lang="ts">
import type { Coordinate } from '@/stores/coordinatesStore';
import { useUserStore } from '@/stores/userStore';
import { useCoordinatesStore } from '@/stores/coordinatesStore';

interface Props {
  coordinate: Coordinate;
}

const props = defineProps<Props>();
const userStore = useUserStore();
const coordinatesStore = useCoordinatesStore();

const categoryColors = {
  biome: 'from-emerald-500 to-teal-500',
  base: 'from-blue-500 to-indigo-500',
  resource: 'from-amber-500 to-orange-500',
};

const categoryLabels = {
  biome: 'Biome',
  base: 'Base',
  resource: 'Ressource',
};

const handleDelete = async () => {
  if (confirm('Supprimer cette coordonnée ?')) {
    await coordinatesStore.deleteCoordinate(props.coordinate.id);
  }
};

const copyCoords = () => {
  const coords = `${props.coordinate.x} ${props.coordinate.y} ${props.coordinate.z}`;
  navigator.clipboard.writeText(coords);
};
</script>

<template>
  <div
    class="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 transition group"
  >
    <div class="flex items-start justify-between gap-3 mb-3">
      <div class="flex items-center gap-3">
        <div
          :class="[
            'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0',
            categoryColors[coordinate.category],
          ]"
        >
          <svg
            v-if="coordinate.category === 'biome'"
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else-if="coordinate.category === 'base'"
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-zinc-100">{{ coordinate.name }}</h3>
          <p class="text-xs text-zinc-500">{{ coordinate.type }}</p>
        </div>
      </div>
      <span
        :class="[
          'text-xs font-medium px-2 py-1 rounded bg-gradient-to-r text-white',
          categoryColors[coordinate.category],
        ]"
      >
        {{ categoryLabels[coordinate.category] }}
      </span>
    </div>

    <div
      class="flex items-center gap-2 mb-3 p-2 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition"
      @click="copyCoords"
      title="Cliquer pour copier"
    >
      <svg
        class="w-4 h-4 text-zinc-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <span class="font-mono text-sm text-zinc-300">
        <span class="text-red-400">X:</span> {{ coordinate.x }}
        <span class="text-emerald-400 ml-2">Y:</span> {{ coordinate.y }}
        <span class="text-blue-400 ml-2">Z:</span> {{ coordinate.z }}
      </span>
      <svg
        class="w-4 h-4 text-zinc-500 ml-auto opacity-0 group-hover:opacity-100 transition"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
        />
      </svg>
    </div>

    <p v-if="coordinate.description" class="text-sm text-zinc-400 mb-3">
      {{ coordinate.description }}
    </p>

    <div class="flex items-center justify-between text-xs text-zinc-500">
      <span>Ajouté par {{ coordinate.addedBy }}</span>
      <button
        v-if="userStore.pseudo === coordinate.addedBy"
        @click="handleDelete"
        class="text-red-400 hover:text-red-300 transition opacity-0 group-hover:opacity-100"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>
