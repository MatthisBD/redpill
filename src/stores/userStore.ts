import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const pseudo = ref<string | null>(localStorage.getItem('redpill_pseudo'));

  const isLoggedIn = computed(() => !!pseudo.value);

  function login(name: string) {
    pseudo.value = name;
    localStorage.setItem('redpill_pseudo', name);
  }

  function logout() {
    pseudo.value = null;
    localStorage.removeItem('redpill_pseudo');
  }

  return {
    pseudo,
    isLoggedIn,
    login,
    logout,
  };
});
