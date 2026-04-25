import { Preferences } from '@capacitor/preferences';
import { Section } from './types';

export type SavedComposition = {
  id: string;
  title: string;
  sa: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = 'sargam_saved_compositions';

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function getSavedCompositions(): Promise<SavedComposition[]> {
  const { value } = await Preferences.get({ key: STORAGE_KEY });
  return safeParse<SavedComposition[]>(value, []);
}

async function setSavedCompositions(items: SavedComposition[]): Promise<void> {
  await Preferences.set({
    key: STORAGE_KEY,
    value: JSON.stringify(items),
  });
}

export async function saveComposition(input: {
  id?: string;
  title: string;
  sa: string;
  sections: Section[];
}): Promise<SavedComposition> {
  const all = await getSavedCompositions();
  const now = new Date().toISOString();

  if (input.id) {
    const existingIndex = all.findIndex((item) => item.id === input.id);

    if (existingIndex >= 0) {
      const updated: SavedComposition = {
        ...all[existingIndex],
        title: input.title,
        sa: input.sa,
        sections: JSON.parse(JSON.stringify(input.sections)),
        updatedAt: now,
      };

      all[existingIndex] = updated;
      all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      await setSavedCompositions(all);
      return updated;
    }
  }

  const created: SavedComposition = {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `comp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    title: input.title,
    sa: input.sa,
    sections: JSON.parse(JSON.stringify(input.sections)),
    createdAt: now,
    updatedAt: now,
  };

  all.unshift(created);
  await setSavedCompositions(all);
  return created;
}

export async function deleteComposition(id: string): Promise<void> {
  const all = await getSavedCompositions();
  const next = all.filter((item) => item.id !== id);
  await setSavedCompositions(next);
}

export async function getCompositionById(id: string): Promise<SavedComposition | null> {
  const all = await getSavedCompositions();
  return all.find((item) => item.id === id) ?? null;
}