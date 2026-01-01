<template>
  <button
    :class="[
      'px-4 py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses,
      props.class,
    ]"
    :disabled="disabled || loading"
  >
    <svg
      v-if="loading"
      class="w-4 h-4 animate-spin"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  loading: false,
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white';
    case 'secondary':
      return 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700';
    case 'ghost':
      return 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100';
    case 'danger':
      return 'bg-red-500/20 hover:bg-red-500/30 text-red-400';
    default:
      return '';
  }
});
</script>
