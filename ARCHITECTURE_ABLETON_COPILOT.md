# Architecture Ableton Copilot - Guide Complet

## 1. APERÇU GLOBAL

Ce projet est une **application web full-stack moderne** utilisant une architecture **NX Monorepo** avec :

- **Frontend** : Vue.js 3 + TypeScript + Vite + Tailwind CSS + Pinia
- **Backend** : NestJS + Prisma ORM + PostgreSQL
- **Services Additionnels** : Python ML Service, MCP Server
- **Architecture** : Dual-mode (HTTP pour le frontend, stdio pour MCP Claude Desktop)

---

## 2. STRUCTURE DU PROJET

### 2.1 Structure racine

```
ableton-copilot/
├── apps/                          # Applications principales
│   ├── frontend/                  # Application Vue.js
│   ├── backend/                   # Serveur NestJS
│   ├── backend-e2e/               # Tests e2e
│   └── ml-service/                # Service Python ML
├── packages/                       # Packages partagés
│   ├── shared-types/              # Types TypeScript partagées
│   └── vst-mappings/              # Mappings VST
├── nx.json                        # Configuration NX
├── pnpm-workspace.yaml            # Workspace pnpm
├── package.json                   # Dépendances root
├── tsconfig.base.json             # Config TypeScript globale
└── pnpm-lock.yaml                 # Lock file pnpm
```

### 2.2 Structure Frontend

```
apps/frontend/src/
├── app/
│   └── App.vue                    # Composant root avec router-view
├── components/
│   ├── ui/                        # Composants UI réutilisables (Button, Input, etc.)
│   ├── ConversationSidebar.vue    # Sidebar des conversations
│   ├── devices/                   # Composants Ableton devices
│   ├── generation/                # Composants génération MIDI/audio
│   └── samples/                   # Composants gestion samples
├── views/                         # Pages entières
│   ├── LoginPage.vue
│   ├── ChatPage.vue
│   ├── DashboardPage.vue
│   ├── SettingsPage.vue
│   └── ...
├── router/
│   └── index.ts                   # Configuration Vue Router
├── shared/
│   ├── stores/                    # Pinia stores (state management)
│   │   ├── userStore.ts           # État utilisateur & auth
│   │   ├── chatStore.ts           # État conversations/messages
│   │   ├── abletonStore.ts        # État Ableton Live
│   │   ├── themeStore.ts          # Thème light/dark
│   │   └── ...
│   ├── services/                  # Services API & logique métier
│   │   ├── api.service.ts         # Client HTTP Axios
│   │   ├── auth.service.ts        # Authentification
│   │   ├── chat.service.ts        # Conversations IA
│   │   ├── ableton.service.ts     # Contrôle Ableton
│   │   └── ...
│   ├── interfaces/                # Interfaces TypeScript
│   │   ├── User.interface.ts
│   │   ├── Ableton.interface.ts
│   │   └── ...
│   └── utils/                     # Fonctions utilitaires
├── services/
│   └── websocket.service.ts       # Socket.io client
├── i18n/                          # Internationalisation
├── main.ts                        # Point d'entrée
├── styles.css                     # Styles globaux
└── vue-shims.d.ts                 # Types Vue

```

### 2.3 Structure Backend

```
apps/backend/src/
├── app/
│   ├── app.module.ts              # Module racine NestJS
│   ├── app.controller.ts          # Contrôleur racine
│   └── app.service.ts
├── auth/                          # Module authentification
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── guards/                    # Guards JWT, Roles, Plans
│   ├── strategies/                # Strategies Passport (JWT, Google, Github)
│   ├── decorators/                # @Roles, @Auth, etc.
│   ├── dto/                       # LoginDto, RegisterDto
│   └── security/                  # Disposable emails check
├── user/                          # Module utilisateur
│   ├── user.module.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── dto/
├── ai-gateway/                    # Module IA (LLM routing)
│   ├── ai-gateway.module.ts
│   ├── ai-gateway.controller.ts
│   ├── ai-gateway.service.ts
│   ├── tool-executor.service.ts
│   ├── system-prompt.service.ts
│   ├── context/                   # Music context service
│   ├── executors/                 # Exécuteurs d'actions musicales
│   │   ├── midi-generation.executor.ts
│   │   ├── audio-generation.executor.ts
│   │   ├── track-management.executor.ts
│   │   └── ...
│   └── helpers/                   # Helpers (résolution pistes/clips)
├── ableton/                       # Module Ableton Live
│   ├── ableton.module.ts
│   ├── ableton.service.ts
│   └── ableton.controller.ts
├── billing/                       # Module Stripe
├── prisma/                        # Module Prisma ORM
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── websocket/                     # Module WebSocket
├── generation/                    # Génération MIDI/audio
├── suno/                          # Intégration Suno AI
├── samples/                       # Gestion samples
├── vst/                           # Gestion VST plugins
├── config/                        # Configuration globale
├── email/                         # Service emails (Resend)
├── mcp/                           # Mode MCP (Claude Desktop)
└── main.ts                        # Point d'entrée NestJS
```

---

## 3. FICHIERS DE CONFIGURATION CLÉS

### 3.1 `package.json` (Root)

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\package.json`

```json
{
  "name": "@ableton-copilot/source",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "concurrently ...",
    "dev:backend": "nx serve backend",
    "dev:frontend": "nx serve frontend",
    "build": "nx run-many --target=build --all",
    "test": "nx run-many --target=test --all"
  },
  "devDependencies": {
    "@nx/vite": "^22.2.3",
    "@nx/vue": "^22.2.3",
    "@nx/nest": "^22.2.3",
    "@tailwindcss/postcss": "^4.1.18",
    "tailwindcss": "^4.1.18",
    "typescript": "^5.9.3"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "vue": "^3.5.13",
    "pinia": "^3.0.4",
    "axios": "^1.6.0",
    "@ai-sdk/anthropic": "^1.0.14"
  }
}
```

### 3.2 `nx.json`

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\nx.json`

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "defaultBase": "master",
  "plugins": [
    {
      "plugin": "@nx/webpack/plugin",
      "options": { "buildTargetName": "build" }
    },
    {
      "plugin": "@nx/vite/plugin",
      "options": { "buildTargetName": "build" }
    },
    {
      "plugin": "@nx/vitest",
      "options": { "testTargetName": "test" }
    },
    {
      "plugin": "@nx/eslint/plugin",
      "options": { "targetName": "lint" }
    }
  ]
}
```

### 3.3 `vite.config.mts` (Frontend)

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\vite.config.mts`

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  server: { port: 3000, host: 'localhost' },
  plugins: [vue(), vueDevTools(), nxViteTsPaths()],
  build: {
    outDir: '../../dist/apps/frontend',
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
}));
```

### 3.4 `tailwind.config.js` (Frontend)

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\tailwind.config.js`

```javascript
import typography from '@tailwindcss/typography';

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(249 115 22)', // orange-500
          foreground: 'rgb(255 255 255)',
        },
        accent: {
          DEFAULT: 'rgb(249 115 22)',
          foreground: 'rgb(255 255 255)',
        },
      },
    },
  },
  plugins: [typography],
};
```

### 3.5 `postcss.config.js` (Frontend)

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\postcss.config.js`

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### 3.6 `tsconfig.base.json`

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\tsconfig.base.json`

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "target": "es2015",
    "module": "esnext",
    "lib": ["es2020", "dom"],
    "baseUrl": ".",
    "paths": {
      "@ableton-copilot/shared-types": ["packages/shared-types/src/index.ts"],
      "@ableton-copilot/vst-mappings": ["packages/vst-mappings/src/index.ts"],
      "@/*": ["apps/frontend/src/*"]
    }
  }
}
```

### 3.7 Prisma Schema (Backend)

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\backend\prisma\schema.prisma`

**Modèles clés** :

```prisma
model User {
  id               String    @id @default(cuid())
  email            String    @unique
  passwordHash     String
  name             String?
  role             Role      @default(USER)
  plan             Plan      @default(FREE)
  credits          Int       @default(0)
  stripeCustomerId String?   @unique
  emailVerified    DateTime?
  machineId        String?   @unique

  apiKeys          ApiKey[]
  conversations    Conversation[]
  subscription     Subscription?

  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}

model Conversation {
  id        String    @id @default(uuid())
  userId    String
  title     String
  provider  String    // 'claude', 'openai', 'gemini'
  model     String
  messages  Message[]

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Message {
  id             String   @id @default(uuid())
  conversationId String
  role           String   // 'user' | 'assistant'
  content        String
  creditsUsed    Int?

  createdAt      DateTime @default(now())
}

enum Role {
  USER
  ADMIN
}

enum Plan {
  FREE
  BETA
  PRO
  ULTRA
  BYOK
}
```

---

## 4. FRONTEND - STRUCTURE ET PATTERNS

### 4.1 Point d'entrée (`main.ts`)

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\main.ts`

```typescript
import './styles.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './app/App.vue';
import router from './router';
import i18n from './i18n';
import { useUserStore, usePricingStore } from '@/shared/stores';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // Persistance localStorage

const app = createApp(App);
app.use(pinia);
app.use(i18n);
app.use(router);

// Initialize stores
Promise.all([
  useUserStore().initialize(),
  usePricingStore().fetchPricing(),
]).then(() => {
  app.mount('#root');
});
```

### 4.2 Styles globaux (`styles.css`)

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\styles.css`

```css
@import 'tailwindcss';

/* Custom scrollbar */
.styled-scrollbar::-webkit-scrollbar {
  width: 10px;
}

.styled-scrollbar::-webkit-scrollbar-thumb {
  background-color: #52525b;
  border-radius: 9999px;
}
```

### 4.3 App.vue

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\app\App.vue`

```vue
<template>
  <div id="app" class="h-screen flex flex-col overflow-hidden bg-background text-foreground">
    <TheHeader v-if="showHeader" />
    <div class="flex-1 overflow-hidden">
      <router-view v-slot="{ Component }">
        <keep-alive include="ChatPage">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { websocketService } from '../services/websocket.service';
import { useThemeStore } from '@/shared/stores';

const route = useRoute();
const themeStore = useThemeStore();

const showHeader = computed(() => {
  const publicRoutes = ['/login', '/register'];
  return !publicRoutes.includes(route.path);
});

onMounted(() => {
  themeStore.initialize();
  websocketService.connect();
});

onUnmounted(() => {
  websocketService.disconnect();
});
</script>
```

### 4.4 Router (`apps/frontend/src/router/index.ts`)

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\router\index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/shared/stores';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/login',
      component: () => import('../views/LoginPage.vue'),
      meta: { public: true },
    },
    {
      path: '/register',
      component: () => import('../views/RegisterPage.vue'),
      meta: { public: true },
    },
    {
      path: '/dashboard',
      component: () => import('../views/DashboardPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/chat',
      component: () => import('../views/ChatPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      component: () => import('../views/SettingsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      component: () => import('../views/AdminPage.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  if (!userStore.isInitialized) {
    await new Promise(resolve => {
      const checkInit = setInterval(() => {
        if (userStore.isInitialized) {
          clearInterval(checkInit);
          resolve(true);
        }
      }, 50);
    });
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && userStore.user?.role !== 'ADMIN') {
    next('/dashboard');
  } else if (to.meta.public && userStore.isAuthenticated && !to.meta.skipAuthRedirect) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
```

### 4.5 Pinia Stores Pattern

#### User Store

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\shared\stores\userStore.ts`

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, LoginCredentials, RegisterData } from '../interfaces';
import { authService, apiService } from '../services';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  async function login(credentials: LoginCredentials) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);
      token.value = response.token;
      user.value = response.user;
      localStorage.setItem('auth_token', response.token);
      apiService.setAuthToken(response.token);
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(data: RegisterData) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.register(data);
      token.value = response.token;
      user.value = response.user;
      localStorage.setItem('auth_token', response.token);
      apiService.setAuthToken(response.token);
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return;

    isLoading.value = true;
    try {
      user.value = await authService.me();
    } catch {
      logout();
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
    apiService.setAuthToken(null);
  }

  async function initialize() {
    if (token.value) {
      apiService.setAuthToken(token.value);
      await fetchUser();
    }
    isInitialized.value = true;
  }

  return {
    user,
    token,
    isLoading,
    error,
    isInitialized,
    isAuthenticated,
    login,
    register,
    fetchUser,
    logout,
    initialize,
  };
});
```

#### Theme Store

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\shared\stores\themeStore.ts`

```typescript
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type Theme = 'light' | 'dark' | 'system';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'dark');

  function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(newTheme: Theme) {
    const effectiveTheme = newTheme === 'system' ? getSystemTheme() : newTheme;

    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }

  function initialize() {
    applyTheme(theme.value);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme('system');
      }
    });
  }

  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });

  return {
    theme,
    setTheme,
    initialize,
  };
});
```

#### Chat Store

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\shared\stores\chatStore.ts`

```typescript
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Conversation, Message, ChatRequest } from '../interfaces';
import { chatService } from '../services';

const STORAGE_KEY = 'chat_store_state';

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Conversation[]>([]);
  const currentConversation = ref<Conversation | null>(null);
  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const isStreaming = ref(false);
  const error = ref<string | null>(null);

  // Watch for changes et sauvegarde en localStorage
  watch([messages, currentConversation, conversations], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      messages: messages.value,
      currentConversation: currentConversation.value,
      conversations: conversations.value,
    }));
  }, { deep: true });

  async function fetchConversations() {
    isLoading.value = true;
    try {
      conversations.value = await chatService.getConversations();
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMessages(conversationId: string) {
    isLoading.value = true;
    try {
      messages.value = await chatService.getMessages(conversationId);
    } finally {
      isLoading.value = false;
    }
  }

  async function sendMessage(request: ChatRequest) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await chatService.sendMessage(request);
      messages.value.push(response);
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to send message';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    isStreaming,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
  };
});
```

### 4.6 Services Pattern

#### API Service

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\shared\services\api.service.ts`

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class APIService {
  private client: AxiosInstance;
  public baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch(url, data, config);
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }

  async upload<T = unknown>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000,
    });
  }
}

export const apiService = new APIService();
```

#### Auth Service

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\shared\services\auth.service.ts`

```typescript
import type { LoginCredentials, RegisterData, User } from '../interfaces';
import { apiService } from './api.service';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    return apiService.post('/auth/login', credentials);
  },

  async register(data: RegisterData): Promise<{ user: User; token: string; message?: string }> {
    const machineId = getMachineId();
    return apiService.post('/auth/register', {
      ...data,
      machineId,
    });
  },

  async me(): Promise<User> {
    return apiService.get('/auth/me');
  },

  async verifyEmail(token: string): Promise<{ message: string; creditsAwarded?: number }> {
    return apiService.post('/auth/verify-email', { token });
  },

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    return apiService.post('/auth/resend-verification', { email });
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiService.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return apiService.post('/auth/reset-password', { token, password });
  },
};
```

#### Chat Service

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\shared\services\chat.service.ts`

```typescript
import type { Conversation, Message, ChatRequest } from '../interfaces';
import { apiService } from './api.service';

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    return apiService.get('/ai/conversations');
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return apiService.get(`/ai/conversations/${conversationId}/messages`);
  },

  async sendMessage(request: ChatRequest): Promise<Message> {
    return apiService.post('/ai/chat', request);
  },

  async deleteConversation(conversationId: string): Promise<void> {
    return apiService.delete(`/ai/conversations/${conversationId}`);
  },
};
```

### 4.7 Interfaces TypeScript

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\shared\interfaces\User.interface.ts`

```typescript
export interface Subscription {
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  plan: 'FREE' | 'PRO' | 'ULTRA' | 'BYOK';
  subscription?: Subscription | null;
  createdAt: string;
  updatedAt: string;
  emailVerified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}
```

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\shared\interfaces\Ableton.interface.ts`

```typescript
export interface SongInfo {
  tempo: number;
  signature: string;
  isPlaying: boolean;
}

export interface Track {
  id: number;
  name: string;
  type: 'MIDI' | 'AUDIO';
}

export type AIProvider = 'claude' | 'openai' | 'gemini' | 'lmstudio';

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  provider: AIProvider;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: AIProvider;
  model?: string;
  creditsUsed?: number;
  createdAt: string;
}

export type AbletonMode = 'session' | 'arrangement';

export interface ChatRequest {
  provider: AIProvider;
  model: string;
  messages: Array<{ role: string; content: string }>;
  conversationId?: string;
  abletonMode?: AbletonMode;
}
```

### 4.8 WebSocket Service

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\services\websocket.service.ts`

```typescript
import { io, Socket } from 'socket.io-client';
import { ref } from 'vue';

type EventCallback = (...args: unknown[]) => void;

class WebSocketService {
  private socket: Socket | null = null;
  public connected = ref(false);
  public listeners = new Map<string, EventCallback>();

  connect() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:4000';

    this.socket = io(wsUrl, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connected.value = true;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.connected.value = false;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: EventCallback) {
    this.listeners.set(event, callback);
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit(event: string, data: unknown) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const websocketService = new WebSocketService();
```

### 4.9 UI Components Pattern

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\components\ui\Button.vue`

```vue
<template>
  <button :class="cn(buttonVariants({ variant, size }), props.class)" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface Props {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  class?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
});
</script>
```

### 4.10 Utility Functions

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\frontend\src\lib\utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 5. BACKEND - STRUCTURE ET PATTERNS

### 5.1 Point d'entrée (`main.ts`)

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\backend\src\main.ts`

```typescript
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

const isMCPMode = process.env.MCP_MODE === 'true';

async function bootstrap() {
  if (isMCPMode) {
    // MCP Mode: stdio transport for Claude Desktop
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: false,
      abortOnError: false,
    });
    process.stderr.write('🎵 Ableton Copilot MCP Server started\n');
  } else {
    // HTTP Mode: Normal HTTP + WebSocket server
    const helmet = (await import('helmet')).default;
    const app = await NestFactory.create(AppModule, {
      rawBody: true, // Required for Stripe webhook signature verification
    });

    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));

    // CORS configuration
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    app.enableCors({
      origin: [frontendUrl, 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Machine-Id'],
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    app.setGlobalPrefix('api');
    const port = process.env.PORT || 4000;
    await app.listen(port);

    Logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
    Logger.log(`🔌 WebSocket running on: http://localhost:${port}`);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
```

### 5.2 App Module

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\backend\src\app\app.module.ts`

```typescript
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AbletonModule } from '../ableton/ableton.module';
import { MCPModule } from '../mcp/mcp.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AIGatewayModule } from '../ai-gateway/ai-gateway.module';
import { ApiKeyModule } from '../api-key/api-key.module';
import { BillingModule } from '../billing/billing.module';
import { SamplesModule } from '../samples/samples.module';
import { VSTModule } from '../vst/vst.module';
import { GenerationModule } from '../generation/generation.module';
import { EmailModule } from '../email/email.module';

const isMCPMode = process.env.MCP_MODE === 'true';

const baseImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env', 'apps/backend/.env', '../../.env'],
    ignoreEnvFile: false,
  }),
  ThrottlerModule.forRoot([
    {
      name: 'short',
      ttl: 1000,
      limit: 10,
    },
    {
      name: 'medium',
      ttl: 60000,
      limit: 100,
    },
    {
      name: 'long',
      ttl: 3600000,
      limit: 1000,
    },
  ]),
  PrismaModule,
  AbletonModule,
  MCPModule,
  EmailModule,
];

const httpOnlyImports = isMCPMode
  ? []
  : [
      AuthModule,
      UserModule,
      ApiKeyModule,
      AIGatewayModule,
      BillingModule,
      SamplesModule,
      VSTModule,
      GenerationModule,
    ];

@Module({
  imports: [...baseImports, ...httpOnlyImports],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### 5.3 Prisma Module

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\backend\src\prisma\prisma.module.ts`

```typescript
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 5.4 Auth Module Pattern

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\backend\src\auth\auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GithubStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

### 5.5 Auth Service Pattern

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\backend\src\auth\auth.service.ts`

```typescript
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto, LoginDto } from './dto';
import { GoogleProfile } from './strategies/google.strategy';
import { GithubProfile } from './strategies/github.strategy';
import { isDisposableEmail } from './security/disposable-emails';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const INITIAL_CREDITS = 100;
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto, clientIp?: string) {
    const { email, password, name, machineId } = registerDto;

    // Security check 1: Block disposable emails
    if (isDisposableEmail(email)) {
      throw new BadRequestException(
        'Disposable email addresses are not allowed. Please use a permanent email.',
      );
    }

    // Security check 2: Check if machineId is already used
    if (machineId) {
      const existingMachine = await this.prisma.user.findFirst({
        where: { machineId },
      });

      if (existingMachine) {
        throw new ConflictException(
          'This device has already been used to create an account. Only one account per device is allowed.',
        );
      }
    }

    // Security check 3: Check IP registration rate
    if (clientIp) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentRegistrations = await this.prisma.user.count({
        where: {
          registrationIp: clientIp,
          createdAt: { gte: oneHourAgo },
        },
      });

      if (recentRegistrations >= 10) {
        throw new ForbiddenException(
          'Too many registrations from this IP address. Please try again later.',
        );
      }
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = this.emailService.generateToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        machineId,
        registrationIp: clientIp,
        emailVerificationToken: verificationToken,
        emailVerificationExpiresAt: verificationExpires,
        credits: 0, // Start with 0, credited after email verification
      },
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(email, verificationToken);

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      user: this.formatUserResponse(user),
      token,
      message: 'Registration successful. Please check your email to verify your account.',
    };
  }

  async login(loginDto: LoginDto, clientIp?: string) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenException(
        'Account is locked due to too many failed login attempts. Please try again later.',
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      // Increment failed login count
      const newFailedCount = (user.failedLoginCount || 0) + 1;
      const shouldLock = newFailedCount >= MAX_FAILED_LOGINS;

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: newFailedCount,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null,
        },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed login count on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: clientIp,
        loginCount: (user.loginCount || 0) + 1,
      },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      user: this.formatUserResponse(user),
      token,
    };
  }

  private formatUserResponse(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits,
      plan: user.plan,
      role: user.role,
      emailVerified: !!user.emailVerified,
    };
  }
}
```

### 5.6 Guards Pattern

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\backend\src\auth\guards\jwt-auth.guard.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\backend\src\auth\guards\roles.guard.ts`

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
```

### 5.7 User Module Pattern

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\backend\src\user\user.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
```

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\backend\src\user\user.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        plan: true,
        stripeCustomerId: true,
        createdAt: true,
        updatedAt: true,
        subscription: {
          select: {
            status: true,
            currentPeriodEnd: true,
            cancelAtPeriodEnd: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        plan: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User profile updated: ${user.email}`);

    return user;
  }

  async getCreditsBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.credits;
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    this.logger.log(`User account deleted: ${userId}`);
  }
}
```

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\backend\src\user\user.controller.ts`

```typescript
import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER, Role.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.id);
  }

  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.id, updateUserDto);
  }

  @Get('credits')
  async getCredits(@Request() req) {
    const credits = await this.userService.getCreditsBalance(req.user.id);
    return { credits };
  }

  @Delete('account')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@Request() req) {
    await this.userService.deleteAccount(req.user.id);
    return { message: 'Account deleted successfully' };
  }
}
```

### 5.8 AI Gateway Module Pattern

**Path**: `C:\Users\matth\Desktop\DOC\progra\CNotreProjet\ableton-copilot\apps\backend\src\ai-gateway\ai-gateway.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AIGatewayService } from './ai-gateway.service';
import { AIGatewayController } from './ai-gateway.controller';
import { ToolExecutorService } from './tool-executor.service';
import { SystemPromptService } from './system-prompt.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AbletonModule } from '../ableton/ableton.module';
import { SamplesModule } from '../samples/samples.module';
import { VSTModule } from '../vst/vst.module';
import { LMStudioModule } from '../lmstudio/lmstudio.module';
import { GenrePresetModule } from '../genre-preset/genre-preset.module';
import { ArrangementPresetModule } from '../arrangement-preset/arrangement-preset.module';
import { StyleLearningModule } from '../style-learning/style-learning.module';
import { AppConfigModule } from '../config/config.module';
import { PrivateLibraryModule } from '../private-library/private-library.module';

// Context
import { MusicContextService } from './context/music-context.service';

// Helpers
import { TrackResolverHelper } from './helpers/track-resolver.helper';
import { ClipResolverHelper } from './helpers/clip-resolver.helper';

// Executors
import { MidiGenerationExecutor } from './executors/midi-generation.executor';
import { AudioGenerationExecutor } from './executors/audio-generation.executor';
import { TrackManagementExecutor } from './executors/track-management.executor';
import { ClipManipulationExecutor } from './executors/clip-manipulation.executor';
import { VstBrowserExecutor } from './executors/vst-browser.executor';
import { SamplesExecutor } from './executors/samples.executor';
import { ArrangementExecutor } from './executors/arrangement.executor';
import { GenrePresetExecutor } from './executors/genre-preset.executor';
import { PatternExecutor } from './executors/pattern.executor';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AbletonModule,
    SamplesModule,
    VSTModule,
    LMStudioModule,
    GenrePresetModule,
    ArrangementPresetModule,
    StyleLearningModule,
    AppConfigModule,
    PrivateLibraryModule,
  ],
  controllers: [AIGatewayController],
  providers: [
    // Main Services
    AIGatewayService,
    ToolExecutorService,
    SystemPromptService,

    // Context
    MusicContextService,

    // Helpers (shared utilities)
    TrackResolverHelper,
    ClipResolverHelper,

    // Executors (domain-specific action handlers)
    MidiGenerationExecutor,
    AudioGenerationExecutor,
    TrackManagementExecutor,
    ClipManipulationExecutor,
    VstBrowserExecutor,
    SamplesExecutor,
    ArrangementExecutor,
    GenrePresetExecutor,
    PatternExecutor,
  ],
  exports: [AIGatewayService, MusicContextService, SystemPromptService],
})
export class AIGatewayModule {}
```

---

## 6. PATTERNS DE CONCEPTION UTILISÉS

### 6.1 Frontend Patterns

#### 1. **Pinia Store Pattern** (State Management)
- Utilise Composition API avec `defineStore`
- Stockage persistent avec `pinia-plugin-persistedstate`
- Stores organisés par domaine (user, chat, ableton, theme)
- Chaque store expose : state (refs), computed, actions

#### 2. **Service Pattern**
- Services singleton pour communication API
- Axios pour HTTP client avec interceptors
- Separation concerns : auth.service, chat.service, api.service
- Services réutilisables entre composants et stores

#### 3. **Component Pattern**
- Composants réutilisables dans `ui/` (Button, Input, Card)
- Composants métier organisés par feature (devices/, generation/, samples/)
- Composition API avec `<script setup>`
- Props typées et event emitters explicites

#### 4. **Router Pattern**
- Navigation guards pour auth check
- Meta properties pour requiresAuth, requiresAdmin, public
- Lazy loading des routes
- Keep-alive pour maintenir état ChatPage

### 6.2 Backend Patterns

#### 1. **NestJS Module Pattern**
- Chaque feature = 1 Module
- Modules importent leurs dépendances
- Exports explicites des services
- Global modules (Prisma) via @Global()

#### 2. **Guard Pattern**
- JwtAuthGuard pour vérifier JWT
- RolesGuard pour vérifier les rôles (ADMIN, USER)
- PlansGuard pour vérifier le plan utilisateur
- Composable dans les contrôleurs

#### 3. **Decorator Pattern**
- @Roles() pour spécifier les rôles requis
- @Auth() pour l'authentification requise
- Reflector pour récupérer metadata

#### 4. **DTO Pattern**
- Data Transfer Objects pour validation
- class-validator pour les règles de validation
- Transformation automatique avec ValidationPipe

#### 5. **Service Pattern**
- Services contiennent la logique métier
- Dependency injection via constructeur
- Services peuvent être réutilisés par plusieurs contrôleurs

#### 6. **Executor Pattern** (AI Gateway)
- Executors spécialisés pour chaque action (MIDI, Audio, Track, etc.)
- ToolExecutorService orchestre les executors
- SystemPromptService gère les prompts système
- MusicContextService fournit le contexte musical

### 6.3 Database Pattern

#### 1. **Prisma ORM**
- Schema.prisma définit tous les modèles
- Relations typées (1-to-many, many-to-many)
- Migrations pour évolution du schema
- Indexes sur les champs fréquemment queryés

#### 2. **Data Access Pattern**
- PrismaService global via PrismaModule
- Seed data possible via prisma/seed.ts
- Type-safe database queries

---

## 7. DÉPENDANCES CLÉS

### Frontend
- **Vue.js 3** : Framework UI
- **Pinia** : State management
- **Vue Router** : Routing
- **Axios** : HTTP client
- **Tailwind CSS** : Styling
- **Radix Vue** : Headless components
- **shadcn-vue** : UI components
- **socket.io-client** : WebSocket client
- **@ai-sdk/** : AI provider SDKs
- **zod** : Schema validation
- **vee-validate** : Form validation

### Backend
- **NestJS** : Framework
- **Prisma** : ORM
- **PostgreSQL** : Database
- **Passport** : Authentication
- **JWT** : Token-based auth
- **Bcrypt** : Password hashing
- **Helmet** : Security headers
- **Socket.io** : WebSocket server
- **@ai-sdk/** : AI provider SDKs
- **Stripe** : Billing
- **Resend** : Email service

---

## 8. CONVENTIONS ET BONNES PRATIQUES

### 8.1 Nommage
- **Stores** : `useXyzStore()` en camelCase
- **Services** : `xyzService` ou `XyzService()`
- **Composants** : PascalCase (`Button.vue`, `ChatPage.vue`)
- **Interfaces** : PascalCase + `Interface` suffixe
- **Modules** : camelCase + `.module.ts`
- **Controllers** : PascalCase + `.controller.ts`

### 8.2 Organisation des dossiers
```
src/
├── index.ts           # Exports barrel
├── *.module.ts       # Module NestJS ou Vue
├── *.service.ts      # Business logic
├── *.controller.ts   # Route handlers
├── dto/              # Data Transfer Objects
├── guards/           # Auth/Permission guards
├── strategies/       # Passport strategies
├── decorators/       # Custom decorators
├── helpers/          # Utility functions
└── interfaces/       # TypeScript interfaces
```

### 8.3 Patterns de code
1. **Async/await** plutôt que Promises
2. **Try/catch** pour gestion erreurs
3. **Computed** pour valeurs dérivées (Vue)
4. **Watch** pour side effects (Vue)
5. **Interceptors** pour cross-cutting concerns
6. **Global pipes** pour validation (NestJS)

---

## 9. ENVIRONNEMENT & CONFIGURATION

### 9.1 Variables d'environnement

**Frontend** (.env)
```
VITE_API_URL=http://localhost:4000/api
VITE_WS_URL=http://localhost:4000
```

**Backend** (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/ableton
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# AI Providers
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GOOGLE_API_KEY=...

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Email
RESEND_API_KEY=...
```

### 9.2 Configuration NX
- Monorepo géré par NX
- pnpm pour package manager
- Webpack pour backend build
- Vite pour frontend dev/build
- Vitest pour testing

---

## 10. COMMANDES IMPORTANTES

```bash
# Development
pnpm install
pnpm dev                    # Start all (ML + Backend + Frontend)
pnpm dev:backend           # Start backend only
pnpm dev:frontend          # Start frontend only

# Building
pnpm build                 # Build all apps
pnpm build:backend         # Build backend
pnpm build:frontend        # Build frontend

# Database
pnpm prisma:migrate        # Run migrations
pnpm prisma:generate       # Generate Prisma client
pnpm prisma:seed          # Seed database
pnpm prisma:studio        # Open Prisma Studio

# Testing
pnpm test                  # Run all tests
pnpm lint                  # Run linter
pnpm format                # Format code

# NX
nx show project frontend   # Show frontend config
nx graph                   # Show dependency graph
```

---

## 11. FLUX DE DONNÉES PRINCIPALES

### 11.1 Authentification
```
Login Page → authService.login() → API /auth/login →
apiService.setAuthToken() → localStorage + state → Router redirect
```

### 11.2 Chat avec IA
```
Chat Component → chatStore.sendMessage() →
API /ai/chat → LLM Provider → Response streaming →
Update messages state → Re-render
```

### 11.3 Contrôle Ableton
```
Component button → abletonService.xyz() →
API /ableton/... → Ableton Live via ableton-js library →
WebSocket broadcast → Update abletonStore → UI update
```

---

## RÉSUMÉ FICHIERS CLÉS

| Chemin | Fonction |
|--------|----------|
| `package.json` | Root dependencies & scripts |
| `nx.json` | NX configuration |
| `pnpm-workspace.yaml` | Monorepo workspace |
| `tsconfig.base.json` | Global TypeScript config |
| `apps/frontend/vite.config.mts` | Frontend build config |
| `apps/frontend/tailwind.config.js` | Tailwind configuration |
| `apps/frontend/src/main.ts` | Frontend entry point |
| `apps/frontend/src/router/index.ts` | Vue Router config |
| `apps/frontend/src/shared/stores/*` | Pinia stores |
| `apps/frontend/src/shared/services/*` | API services |
| `apps/backend/src/main.ts` | Backend entry point |
| `apps/backend/src/app/app.module.ts` | NestJS root module |
| `apps/backend/src/auth/*` | Authentication module |
| `apps/backend/src/user/*` | User management module |
| `apps/backend/src/ai-gateway/*` | IA routing module |
| `apps/backend/prisma/schema.prisma` | Database schema |

---

Cet architecture moderne et scalable peut être reproduite pour créer de nouveaux projets full-stack avec Vue.js + NestJS + Prisma!
