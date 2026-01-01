<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="id" class="block text-sm font-medium text-zinc-300">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="[
        'w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed',
        props.class,
      ]"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  label?: string;
  id?: string;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
