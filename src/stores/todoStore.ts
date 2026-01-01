import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  addedBy: string;
  createdAt: string;
  tasks: Task[];
}

interface DbProject {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  added_by: string;
  created_at: string;
}

interface DbTask {
  id: string;
  project_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

function dbToProject(db: DbProject, tasks: Task[] = []): Project {
  return {
    id: db.id,
    title: db.title,
    description: db.description,
    completed: db.completed,
    addedBy: db.added_by,
    createdAt: db.created_at,
    tasks,
  };
}

function dbToTask(db: DbTask): Task {
  return {
    id: db.id,
    projectId: db.project_id,
    title: db.title,
    completed: db.completed,
    createdAt: db.created_at,
  };
}

export const useTodoStore = defineStore('todo', () => {
  const projects = ref<Project[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchProjects() {
    if (!supabase) {
      error.value = 'Supabase non configuré';
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (tasksError) throw tasksError;

      const tasksMap = new Map<string, Task[]>();
      (tasksData || []).forEach((t: DbTask) => {
        const task = dbToTask(t);
        if (!tasksMap.has(task.projectId)) {
          tasksMap.set(task.projectId, []);
        }
        tasksMap.get(task.projectId)!.push(task);
      });

      projects.value = (projectsData || []).map((p: DbProject) =>
        dbToProject(p, tasksMap.get(p.id) || [])
      );
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue';
      console.error('Failed to fetch projects:', e);
    } finally {
      isLoading.value = false;
    }
  }

  async function addProject(title: string, description: string | undefined, addedBy: string) {
    if (!supabase) throw new Error('Supabase non configuré');

    const { data, error: supaError } = await supabase
      .from('projects')
      .insert({ title, description, added_by: addedBy })
      .select()
      .single();

    if (supaError) throw supaError;
    const newProject = dbToProject(data, []);
    projects.value.unshift(newProject);
    return newProject;
  }

  async function deleteProject(id: string) {
    if (!supabase) throw new Error('Supabase non configuré');

    const { error: supaError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (supaError) throw supaError;
    projects.value = projects.value.filter(p => p.id !== id);
  }

  async function toggleProject(id: string) {
    if (!supabase) throw new Error('Supabase non configuré');

    const project = projects.value.find(p => p.id === id);
    if (!project) return;

    const newCompleted = !project.completed;
    const { error: supaError } = await supabase
      .from('projects')
      .update({ completed: newCompleted })
      .eq('id', id);

    if (supaError) throw supaError;
    project.completed = newCompleted;
  }

  async function addTask(projectId: string, title: string) {
    if (!supabase) throw new Error('Supabase non configuré');

    const { data, error: supaError } = await supabase
      .from('tasks')
      .insert({ project_id: projectId, title })
      .select()
      .single();

    if (supaError) throw supaError;

    const project = projects.value.find(p => p.id === projectId);
    if (project) {
      project.tasks.push(dbToTask(data));
    }
  }

  async function deleteTask(taskId: string, projectId: string) {
    if (!supabase) throw new Error('Supabase non configuré');

    const { error: supaError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (supaError) throw supaError;

    const project = projects.value.find(p => p.id === projectId);
    if (project) {
      project.tasks = project.tasks.filter(t => t.id !== taskId);
    }
  }

  async function toggleTask(taskId: string, projectId: string) {
    if (!supabase) throw new Error('Supabase non configuré');

    const project = projects.value.find(p => p.id === projectId);
    if (!project) return;

    const task = project.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;
    const { error: supaError } = await supabase
      .from('tasks')
      .update({ completed: newCompleted })
      .eq('id', taskId);

    if (supaError) throw supaError;
    task.completed = newCompleted;
  }

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    addProject,
    deleteProject,
    toggleProject,
    addTask,
    deleteTask,
    toggleTask,
  };
});
