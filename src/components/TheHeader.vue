<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import Button from './ui/Button.vue';

const route = useRoute();
const userStore = useUserStore();
const isMenuOpen = ref(false);
const showLoginModal = ref(false);
const loginPseudo = ref('');

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleLogin = () => {
  if (loginPseudo.value.trim()) {
    userStore.login(loginPseudo.value.trim());
    showLoginModal.value = false;
    loginPseudo.value = '';
  }
};

const handleLogout = () => {
  userStore.logout();
};

const navItems = [
  { path: '/', label: 'Accueil' },
  { path: '/biomes', label: 'Biomes' },
  { path: '/bases', label: 'Bases' },
  { path: '/resources', label: 'Ressources' },
];
</script>

<template>
  <header class="bg-zinc-900 shadow-sm border-b border-zinc-800">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <router-link
        to="/"
        class="flex items-center gap-3 hover:opacity-80 transition group"
      >
        <div
          class="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:shadow-red-500/40 transition-shadow"
        >
          <svg
            class="w-6 h-6 text-white"
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
        <span class="text-xl font-bold text-zinc-100">
          Red<span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Pill</span>
        </span>
      </router-link>

      <nav class="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="px-4 py-2 rounded-lg transition text-sm font-medium"
          :class="
            route.path === item.path
              ? 'bg-red-500/10 text-red-500'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
          "
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="hidden lg:flex items-center gap-4">
        <div v-if="userStore.isLoggedIn" class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center ring-2 ring-zinc-700"
            >
              <span class="text-white font-semibold text-sm">
                {{ userStore.pseudo?.charAt(0).toUpperCase() }}
              </span>
            </div>
            <span class="text-sm text-zinc-300">{{ userStore.pseudo }}</span>
          </div>
          <Button variant="ghost" @click="handleLogout">
            Déconnexion
          </Button>
        </div>
        <Button v-else @click="showLoginModal = true">
          Connexion
        </Button>
      </div>

      <button
        @click="toggleMenu"
        class="lg:hidden p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-300"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="!isMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMenuOpen" class="lg:hidden border-t border-zinc-800 bg-zinc-900">
      <div class="px-6 py-4 space-y-2">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="block px-4 py-2 rounded-lg transition"
          :class="
            route.path === item.path
              ? 'bg-red-500/10 text-red-500 font-medium'
              : 'text-zinc-400 hover:bg-zinc-800'
          "
          @click="toggleMenu"
        >
          {{ item.label }}
        </router-link>

        <div class="border-t border-zinc-800 pt-2 mt-2">
          <div v-if="userStore.isLoggedIn" class="space-y-2">
            <div class="flex items-center gap-2 px-4 py-2">
              <div
                class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center"
              >
                <span class="text-white font-semibold text-sm">
                  {{ userStore.pseudo?.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="text-sm text-zinc-300">{{ userStore.pseudo }}</span>
            </div>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-red-400 hover:bg-red-950/30 rounded-lg transition"
            >
              Déconnexion
            </button>
          </div>
          <button
            v-else
            @click="showLoginModal = true; toggleMenu()"
            class="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium"
          >
            Connexion
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Login Modal -->
  <Teleport to="body">
    <div
      v-if="showLoginModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showLoginModal = false"
    >
      <div class="bg-zinc-900 rounded-xl border border-zinc-800 p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-zinc-100 mb-4">Connexion</h2>
        <p class="text-zinc-400 text-sm mb-6">
          Entre ton pseudo pour pouvoir ajouter des coordonnées
        </p>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1.5">
              Pseudo
            </label>
            <input
              v-model="loginPseudo"
              type="text"
              placeholder="Ton pseudo Minecraft"
              class="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
              autofocus
            />
          </div>
          <div class="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              class="flex-1"
              @click="showLoginModal = false"
            >
              Annuler
            </Button>
            <Button type="submit" class="flex-1" :disabled="!loginPseudo.trim()">
              Connexion
            </Button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
