import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import BiomesPage from '@/views/BiomesPage.vue'
import BasesPage from '@/views/BasesPage.vue'
import ResourcesPage from '@/views/ResourcesPage.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/biomes',
      name: 'biomes',
      component: BiomesPage,
    },
    {
      path: '/bases',
      name: 'bases',
      component: BasesPage,
    },
    {
      path: '/resources',
      name: 'resources',
      component: ResourcesPage,
    },
  ],
})

export default router
