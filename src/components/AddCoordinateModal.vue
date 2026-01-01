<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCoordinatesStore } from '@/stores/coordinatesStore';
import { useUserStore } from '@/stores/userStore';
import Button from './ui/Button.vue';

interface Props {
  show: boolean;
  category: 'biome' | 'base' | 'resource';
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const coordinatesStore = useCoordinatesStore();
const userStore = useUserStore();

const name = ref('');
const x = ref<number | undefined>();
const y = ref<number | undefined>();
const z = ref<number | undefined>();
const type = ref('');
const description = ref('');
const isSubmitting = ref(false);

const categoryTypes = {
  biome: ['Forêt', 'Désert', 'Jungle', 'Taiga', 'Savane', 'Marais', 'Plaines', 'Montagne', 'Ocean', 'Champignon', 'Neige', 'Mesa', 'Autre'],
  base: ['Maison', 'Ferme', 'Entrepôt', 'Portail Nether', 'Portail End', 'Spawn', 'Autre'],
  resource: ['Diamant', 'Netherite', 'Fer', 'Or', 'Spawner', 'Village', 'Temple', 'Forteresse', 'Autre'],
};

const categoryLabels = {
  biome: 'Biome',
  base: 'Base',
  resource: 'Ressource',
};

const isValid = computed(() => {
  return name.value.trim() && x.value !== undefined && y.value !== undefined && z.value !== undefined && type.value;
});

const handleSubmit = async () => {
  if (!isValid.value || !userStore.pseudo) return;

  isSubmitting.value = true;
  try {
    await coordinatesStore.addCoordinate({
      name: name.value.trim(),
      x: x.value!,
      y: y.value!,
      z: z.value!,
      category: props.category,
      type: type.value,
      description: description.value.trim() || undefined,
      addedBy: userStore.pseudo,
    });
    resetForm();
    emit('close');
  } catch (e) {
    console.error('Failed to add coordinate:', e);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  name.value = '';
  x.value = undefined;
  y.value = undefined;
  z.value = undefined;
  type.value = '';
  description.value = '';
};

const handleClose = () => {
  resetForm();
  emit('close');
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="handleClose"
    >
      <div class="bg-zinc-900 rounded-xl border border-zinc-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto styled-scrollbar">
        <h2 class="text-xl font-bold text-zinc-100 mb-1">
          Ajouter un {{ categoryLabels[category].toLowerCase() }}
        </h2>
        <p class="text-zinc-400 text-sm mb-6">
          Remplis les coordonnées pour partager ce lieu
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1.5">
              Nom *
            </label>
            <input
              v-model="name"
              type="text"
              placeholder="ex: Forêt de champignons"
              class="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1.5">
              Type *
            </label>
            <select
              v-model="type"
              class="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
            >
              <option value="" disabled>Sélectionner un type</option>
              <option v-for="t in categoryTypes[category]" :key="t" :value="t">
                {{ t }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-1.5">
                X *
              </label>
              <input
                v-model.number="x"
                type="number"
                placeholder="0"
                class="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-1.5">
                Y *
              </label>
              <input
                v-model.number="y"
                type="number"
                placeholder="64"
                class="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-1.5">
                Z *
              </label>
              <input
                v-model.number="z"
                type="number"
                placeholder="0"
                class="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1.5">
              Description (optionnel)
            </label>
            <textarea
              v-model="description"
              rows="3"
              placeholder="Détails supplémentaires..."
              class="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition resize-none"
            />
          </div>

          <div class="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              class="flex-1"
              @click="handleClose"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              class="flex-1"
              :disabled="!isValid"
              :loading="isSubmitting"
            >
              Ajouter
            </Button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
