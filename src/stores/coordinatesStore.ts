import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase';

export interface Coordinate {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  category: 'biome' | 'base' | 'resource';
  type: string;
  description?: string;
  addedBy: string;
  createdAt: string;
}

interface DbCoordinate {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  category: 'biome' | 'base' | 'resource';
  type: string;
  description?: string;
  added_by: string;
  created_at: string;
}

function dbToCoordinate(db: DbCoordinate): Coordinate {
  return {
    id: db.id,
    name: db.name,
    x: db.x,
    y: db.y,
    z: db.z,
    category: db.category,
    type: db.type,
    description: db.description,
    addedBy: db.added_by,
    createdAt: db.created_at,
  };
}

export const useCoordinatesStore = defineStore('coordinates', () => {
  const coordinates = ref<Coordinate[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const biomes = computed(() =>
    coordinates.value.filter(c => c.category === 'biome')
  );

  const bases = computed(() =>
    coordinates.value.filter(c => c.category === 'base')
  );

  const resources = computed(() =>
    coordinates.value.filter(c => c.category === 'resource')
  );

  async function fetchCoordinates() {
    if (!supabase) {
      error.value = 'Supabase non configuré';
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: supaError } = await supabase
        .from('coordinates')
        .select('*')
        .order('created_at', { ascending: false });

      if (supaError) throw supaError;
      coordinates.value = (data || []).map(dbToCoordinate);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue';
      console.error('Failed to fetch coordinates:', e);
    } finally {
      isLoading.value = false;
    }
  }

  async function addCoordinate(coord: Omit<Coordinate, 'id' | 'createdAt'>) {
    if (!supabase) {
      error.value = 'Supabase non configuré';
      throw new Error('Supabase non configuré');
    }

    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: supaError } = await supabase
        .from('coordinates')
        .insert({
          name: coord.name,
          x: coord.x,
          y: coord.y,
          z: coord.z,
          category: coord.category,
          type: coord.type,
          description: coord.description,
          added_by: coord.addedBy,
        })
        .select()
        .single();

      if (supaError) throw supaError;
      const newCoord = dbToCoordinate(data);
      coordinates.value.unshift(newCoord);
      return newCoord;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteCoordinate(id: string) {
    if (!supabase) {
      error.value = 'Supabase non configuré';
      throw new Error('Supabase non configuré');
    }

    isLoading.value = true;
    error.value = null;
    try {
      const { error: supaError } = await supabase
        .from('coordinates')
        .delete()
        .eq('id', id);

      if (supaError) throw supaError;
      coordinates.value = coordinates.value.filter(c => c.id !== id);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    coordinates,
    biomes,
    bases,
    resources,
    isLoading,
    error,
    fetchCoordinates,
    addCoordinate,
    deleteCoordinate,
  };
});
