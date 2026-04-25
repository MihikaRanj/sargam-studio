import { Beat, Slot, Swara, Variant } from './types';

export function createEmptySlot(): Slot {
  return {
    mode: 'note',
    swara: 'Sa',
    octave: 0,
    variant: 'shuddha',
  };
}

export function createBeat(layout: 1 | 2 | 3 | 4 = 1): Beat {
  return {
    layout,
    slots: Array.from({ length: layout }, () => createEmptySlot()),
  };
}

export function createEmptyRow(cellCount = 8): Beat[] {
  return Array.from({ length: cellCount }, () => createBeat(1));
}

export function normalizeSlotsForLayout(slots: Slot[], layout: 1 | 2 | 3 | 4): Slot[] {
  return Array.from({ length: layout }, (_, i) => (slots[i] ? { ...slots[i] } : createEmptySlot()));
}

export function buildSlotToken(slot: Slot): string {
  if (!slot || slot.mode === 'empty') return '';
  if (slot.mode === 'rest') return '-';

  let prefix = '';
  let suffix = '';

  if (slot.octave === -1) prefix += '.';
  if (slot.variant === 'komal') prefix += '_';
  if (slot.variant === 'teevra') prefix += '^';
  if (slot.octave === 1) suffix += "'";

  return `${prefix}${slot.swara}${suffix}`;
}

export function buildBeatToken(beat: Beat): string {
  return beat.slots.map(buildSlotToken).join('/');
}

export function parseToken(token: string) {
  let octave = 0;
  let variant: Variant = 'shuddha';
  let text = token.trim();

  while (text.startsWith('.')) {
    octave -= 1;
    text = text.slice(1);
  }

  while (text.endsWith("'")) {
    octave += 1;
    text = text.slice(0, -1);
  }

  if (text.startsWith('_')) {
    variant = 'komal';
    text = text.slice(1);
  } else if (text.startsWith('^')) {
    variant = 'teevra';
    text = text.slice(1);
  }

  return {
    swara: text as Swara,
    variant,
    octave: Math.max(-1, Math.min(1, octave)) as -1 | 0 | 1,
  };
}

export function slotFromToken(token: string): Slot {
  if (!token) {
    return {
      mode: 'empty',
      swara: 'Sa',
      octave: 0,
      variant: 'shuddha',
    };
  }

  if (token === '-') {
    return {
      mode: 'rest',
      swara: 'Sa',
      octave: 0,
      variant: 'shuddha',
    };
  }

  const parsed = parseToken(token);
  return {
    mode: 'note',
    swara: parsed.swara,
    octave: parsed.octave,
    variant: parsed.variant,
  };
}

export function beatFromTextToken(token: string): Beat {
  const parts = token.split('/').map((p) => p.trim());
  const layout = Math.min(Math.max(parts.length, 1), 4) as 1 | 2 | 3 | 4;

  return {
    layout,
    slots: normalizeSlotsForLayout(parts.map(slotFromToken), layout),
  };
}

export function gridToText(rows: Beat[][]): string {
  return rows.map((row) => row.map(buildBeatToken).join(' ')).join('\n');
}

export function textToGrid(text: string, isFreeRow: boolean, beatCount: number | null): Beat[][] {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return [createEmptyRow(isFreeRow ? 8 : beatCount || 8)];
  }

  return lines.map((line) => {
    const tokens = line.split(/\s+/).filter(Boolean);

    if (isFreeRow) {
      const row = tokens.map(beatFromTextToken);
      return row.length ? row : [createBeat(1)];
    }

    const row = createEmptyRow(beatCount || 8);
    for (let i = 0; i < Math.min(tokens.length, beatCount || 8); i += 1) {
      row[i] = beatFromTextToken(tokens[i]);
    }
    return row;
  });
}