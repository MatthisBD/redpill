<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTodoStore } from '@/stores/todoStore';
import { useUserStore } from '@/stores/userStore';
import Button from '@/components/ui/Button.vue';

const todoStore = useTodoStore();
const userStore = useUserStore();

const showAddProject = ref(false);
const newProjectTitle = ref('');
const newProjectDescription = ref('');
const newTaskInputs = ref<Record<string, string>>({});
const expandedProjects = ref<Set<string>>(new Set());

onMounted(() => {
  todoStore.fetchProjects();
});

const toggleExpand = (projectId: string) => {
  if (expandedProjects.value.has(projectId)) {
    expandedProjects.value.delete(projectId);
  } else {
    expandedProjects.value.add(projectId);
  }
};

const handleAddProject = async () => {
  if (!newProjectTitle.value.trim() || !userStore.pseudo) return;
  try {
    await todoStore.addProject(
      newProjectTitle.value.trim(),
      newProjectDescription.value.trim() || undefined,
      userStore.pseudo
    );
    newProjectTitle.value = '';
    newProjectDescription.value = '';
    showAddProject.value = false;
  } catch (e) {
    console.error('Failed to add project:', e);
  }
};

const handleAddTask = async (projectId: string) => {
  const title = newTaskInputs.value[projectId]?.trim();
  if (!title) return;
  try {
    await todoStore.addTask(projectId, title);
    newTaskInputs.value[projectId] = '';
  } catch (e) {
    console.error('Failed to add task:', e);
  }
};

const getCompletedCount = (projectId: string) => {
  const project = todoStore.projects.find(p => p.id === projectId);
  if (!project) return { completed: 0, total: 0 };
  const completed = project.tasks.filter(t => t.completed).length;
  return { completed, total: project.tasks.length };
};
</script>

<template>
  <div class="h-full bg-zinc-900 overflow-auto styled-scrollbar">
    <main class="max-w-4xl mx-auto p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">Projets</h1>
          <p class="text-zinc-400 text-sm">
            Liste des projets et tâches à réaliser sur le serveur
          </p>
        </div>
        <Button
          v-if="userStore.isLoggedIn"
          @click="showAddProject = true"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouveau projet
        </Button>
      </div>

      <!-- Add Project Form -->
      <div
        v-if="showAddProject"
        class="bg-zinc-800 rounded-xl border border-zinc-700 p-4 mb-6"
      >
        <h3 class="text-lg font-semibold text-zinc-100 mb-4">Nouveau projet</h3>
        <form @submit.prevent="handleAddProject" class="space-y-3">
          <input
            v-model="newProjectTitle"
            type="text"
            placeholder="Titre du projet (ex: Farm à Enderman)"
            class="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
          />
          <textarea
            v-model="newProjectDescription"
            rows="2"
            placeholder="Description (optionnel)"
            class="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition resize-none"
          />
          <div class="flex gap-2">
            <Button type="button" variant="secondary" @click="showAddProject = false">
              Annuler
            </Button>
            <Button type="submit" :disabled="!newProjectTitle.trim()">
              Créer
            </Button>
          </div>
        </form>
      </div>

      <!-- Loading -->
      <div v-if="todoStore.isLoading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-zinc-800/50 rounded-xl h-24 animate-pulse"></div>
      </div>

      <!-- Projects List -->
      <div v-else-if="todoStore.projects.length > 0" class="space-y-4">
        <div
          v-for="project in todoStore.projects"
          :key="project.id"
          class="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition"
        >
          <!-- Project Header -->
          <div
            class="p-4 flex items-start gap-3 cursor-pointer"
            @click="toggleExpand(project.id)"
          >
            <button
              @click.stop="todoStore.toggleProject(project.id)"
              :class="[
                'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition',
                project.completed
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-zinc-600 hover:border-zinc-500'
              ]"
            >
              <svg
                v-if="project.completed"
                class="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </button>

            <div class="flex-1 min-w-0">
              <h3
                :class="[
                  'font-semibold transition',
                  project.completed ? 'text-zinc-500 line-through' : 'text-zinc-100'
                ]"
              >
                {{ project.title }}
              </h3>
              <p v-if="project.description" class="text-sm text-zinc-500 mt-1">
                {{ project.description }}
              </p>
              <div class="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                <span>Par {{ project.addedBy }}</span>
                <span v-if="project.tasks.length > 0">
                  {{ getCompletedCount(project.id).completed }}/{{ getCompletedCount(project.id).total }} tâches
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-if="userStore.pseudo === project.addedBy"
                @click.stop="todoStore.deleteProject(project.id)"
                class="p-1.5 text-zinc-500 hover:text-red-400 transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
              <svg
                :class="[
                  'w-5 h-5 text-zinc-500 transition-transform',
                  expandedProjects.has(project.id) ? 'rotate-180' : ''
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>

          <!-- Tasks (Expandable) -->
          <div
            v-if="expandedProjects.has(project.id)"
            class="border-t border-zinc-800 bg-zinc-950/50 p-4"
          >
            <!-- Tasks List -->
            <div v-if="project.tasks.length > 0" class="space-y-2 mb-4">
              <div
                v-for="task in project.tasks"
                :key="task.id"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition group"
              >
                <button
                  @click="todoStore.toggleTask(task.id, project.id)"
                  :class="[
                    'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition',
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-zinc-600 hover:border-zinc-500'
                  ]"
                >
                  <svg
                    v-if="task.completed"
                    class="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </button>
                <span
                  :class="[
                    'flex-1 text-sm transition',
                    task.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'
                  ]"
                >
                  {{ task.title }}
                </span>
                <button
                  @click="todoStore.deleteTask(task.id, project.id)"
                  class="p-1 text-zinc-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Add Task Input -->
            <div v-if="userStore.isLoggedIn" class="flex gap-2">
              <input
                v-model="newTaskInputs[project.id]"
                type="text"
                placeholder="Ajouter une tâche..."
                class="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                @keyup.enter="handleAddTask(project.id)"
              />
              <Button
                variant="secondary"
                @click="handleAddTask(project.id)"
                :disabled="!newTaskInputs[project.id]?.trim()"
                class="px-3"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
        <p class="text-zinc-400 text-lg">Aucun projet pour le moment</p>
        <p v-if="userStore.isLoggedIn" class="text-zinc-500 text-sm mt-1">
          Clique sur "Nouveau projet" pour créer le premier
        </p>
        <p v-else class="text-zinc-500 text-sm mt-1">
          Connecte-toi pour créer des projets
        </p>
      </div>
    </main>
  </div>
</template>
