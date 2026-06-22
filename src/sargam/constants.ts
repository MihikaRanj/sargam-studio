import { Swara, TaalConfig, TaalId } from './types';

export const SA_OPTIONS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export const SWARA_OPTIONS: readonly Swara[] = ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'];

export const SWARA_MAP: Record<Swara, number> = {
  Sa: 0,
  Re: 2,
  Ga: 4,
  Ma: 5,
  Pa: 7,
  Dha: 9,
  Ni: 11,
};

export const TAAL_OPTIONS: Record<TaalId, TaalConfig> = {
  none: {
    id: 'none',
    name: 'No Taal / Aalap',
    beats: null,
    bols: [],
    markers: {},
    hasTabla: false,
  },
  jhaptaal: {
    id: 'jhaptaal',
    name: 'Jhaptaal',
    beats: 10,
    bols: ['Dhi', 'Na', 'Dhi', 'Dhi', 'Na', 'Tin', 'Na', 'Dhi', 'Dhi', 'Na'],
    markers: { 1: 'X', 3: '2', 6: '0', 8: '3' },
    hasTabla: true,
  },
  teentaal: {
    id: 'teentaal',
    name: 'Teentaal',
    beats: 16,
    bols: ['Dha', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Tin', 'Tin', 'Ta', 'Ta', 'Dhin', 'Dhin', 'Dha'],
    markers: { 1: 'X', 5: '2', 9: '0', 13: '3' },
    hasTabla: true,
  },
  ektaal: {
    id: 'ektaal',
    name: 'Ektaal',
    beats: 12,
    bols: [
      'Dhin',
      'Dhin',
      ['Dha', 'Ge'],
      ['Ti', 'Re', 'Ki', 'Ta'],
      'Tun',
      'Na',
      'Kat',
      'Ta',
      ['Dha', 'Ge'],
      ['Ti', 'Re', 'Ki', 'Ta'],
      'Dhin',
      'Na',
    ],
    markers: { 1: 'X', 3: '0', 5: '2', 7: '0', 9: '3', 11: '4' },
    hasTabla: true,
  },

  rupak: {
    id: 'rupak',
    name: 'Rupak',
    beats: 7,
    bols: ['Tin', 'Tin', 'Na', 'Dhin', 'Na', 'Dhin', 'Na'],
    markers: { 1: '0', 4: 'X', 6: '2' },
    hasTabla: true,
  },
  keherwa: {
    id: 'keherwa',
    name: 'Keherwa',
    beats: 8,
    bols: ['Dha', 'Ge', 'Na', 'Ti', 'Na', 'Ka', 'Dhi', 'Na'],
    markers: { 1: 'X', 5: '0' },
    hasTabla: true,
  },
  dadra: {
    id: 'dadra',
    name: 'Dadra',
    beats: 6,
    bols: ['Dha', 'Dhi', 'Na', 'Na', 'Ti', 'Na'],
    markers: { 1: 'X', 4: '0' },
    hasTabla: true,
  },
};