export type Swara = 'Sa' | 'Re' | 'Ga' | 'Ma' | 'Pa' | 'Dha' | 'Ni';
export type Variant = 'shuddha' | 'komal' | 'teevra';
export type SlotMode = 'note' | 'rest' | 'empty';
export type TaalId = 'none' | 'jhaptaal' | 'teentaal' | 'ektaal' | 'rupak' | 'keherwa' | 'dadra';
export type AppStep = 'setup' | 'compose' | 'review';

export type Slot = {
  mode: SlotMode;
  swara: Swara;
  octave: -1 | 0 | 1;
  variant: Variant;
};

export type Beat = {
  layout: 1 | 2 | 3 | 4;
  slots: Slot[];
};

export type Section = {
  id: number;
  name: string;
  taalId: TaalId;
  tempo?: number;
  rows: Beat[][];
};

export type SelectedCell = {
  sectionId: number;
  row: number;
  beat: number;
  slot: number;
};

export type TaalConfig = {
  id: TaalId;
  name: string;
  beats: number | null;
  bols: string[];
  markers: Record<number, string>;
  hasTabla: boolean;
};