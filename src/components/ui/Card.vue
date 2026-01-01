<template>
  <div
    :class="[
      'rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-700 transition',
      props.class,
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>
