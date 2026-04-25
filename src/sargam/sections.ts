import { TAAL_OPTIONS } from './constants';
import { Beat, Section, TaalId } from './types';
import { createBeat, createEmptyRow, normalizeSlotsForLayout } from './notation';

let nextSectionId = 2;

export function normalizeFixedRow(row: Beat[], beatCount: number): Beat[] {
  return Array.from({ length: beatCount }, (_, i) =>
    row[i]
      ? {
          layout: row[i].layout,
          slots: normalizeSlotsForLayout(row[i].slots, row[i].layout),
        }
      : createBeat(1)
  );
}

export function normalizeFreeRow(row: Beat[]): Beat[] {
  if (!row.length) return [createBeat(1)];
  return row.map((beat) => ({
    layout: beat.layout,
    slots: normalizeSlotsForLayout(beat.slots, beat.layout),
  }));
}

export function createSection(
  taalId: TaalId = 'jhaptaal',
  name = '',
  tempo?: number
): Section {
  const index = nextSectionId++;
  const beats = taalId === 'none' ? 8 : TAAL_OPTIONS[taalId].beats || 8;

  return {
    id: index,
    name: name || `Section ${index}`,
    taalId,
    tempo,
    rows: [createEmptyRow(beats)],
  };
}

export function normalizeSection(section: Section): Section {
  const isFreeRow = section.taalId === 'none';
  const beatCount = TAAL_OPTIONS[section.taalId].beats;

  return {
    ...section,
    rows: section.rows.map((row) =>
      isFreeRow ? normalizeFreeRow(row) : normalizeFixedRow(row, beatCount || 8)
    ),
  };
}