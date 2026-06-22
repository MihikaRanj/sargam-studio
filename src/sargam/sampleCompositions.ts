import { SavedComposition } from './storage';
import { Section, Slot, Beat } from './types';

const note = (
    swara: Slot['swara'],
    variant: Slot['variant'] = 'shuddha',
    octave: Slot['octave'] = 0
): Slot => ({
    mode: 'note',
    swara,
    variant,
    octave,
});

const rest = (): Slot => ({
    mode: 'rest',
    swara: 'Sa',
    variant: 'shuddha',
    octave: 0,
});

const beat = (slot: Slot): Beat => ({
    layout: 1,
    slots: [slot],
});

const row = (slots: Slot[]): Beat[] => slots.map(beat);

const komalGa = note('Ga', 'komal');
const komalNi = note('Ni', 'komal');

export const SAMPLE_BAGESHREE: SavedComposition = {
    id: 'sample-raag-bageshree',
    title: 'Sample: Raag Bageshree',
    sa: 'C#',
    updatedAt: new Date('2026-01-01').toISOString(),
    sections: [
        {
            id: 101,
            name: 'Aaroha',
            taalId: 'none',
            tempo: 70,
            rows: [
                row([
                    note('Ni', 'komal', -1),
                    note('Sa'),
                    komalGa,
                    note('Ma'),
                    note('Dha'),
                    komalNi,
                    note('Sa', 'shuddha', 1),
                ]),
            ],
        },
        {
            id: 102,
            name: 'Avroha',
            taalId: 'none',
            tempo: 70,
            rows: [
                row([
                    note('Sa', 'shuddha', 1),
                    komalNi,
                    note('Dha'),
                    note('Ma'),
                    komalGa,
                    note('Re'),
                    note('Sa'),
                ]),
            ],
        },
        {
            id: 103,
            name: 'Pakad',
            taalId: 'none',
            tempo: 75,
            rows: [
                row([
                    note('Sa'),
                    komalGa,
                    note('Ma'),
                    note('Pa'),
                    note('Ma'),
                    komalGa,
                    note('Re'),
                    note('Sa'),
                ]),
            ],
        },
        {
            id: 104,
            name: 'Aalaap',
            taalId: 'none',
            tempo: 65,
            rows: [
                row([note('Sa'), note('Ni', 'komal', -1), note('Dha', 'shuddha', -1), note('Sa'), note('Ma'), komalGa, note('Re'), note('Sa')]),
                row([note('Dha', 'shuddha', -1), note('Ni', 'komal', -1), note('Sa'), note('Ma'), komalGa, note('Ma'), note('Dha'), note('Ma'), komalGa, note('Re'), note('Sa')]),
                row([note('Sa'), komalGa, note('Ma'), note('Dha'), note('Ma'), komalGa, note('Ma'), note('Dha'), komalNi, note('Dha'), note('Ma'), komalGa, note('Re'), note('Sa')]),
                row([komalGa, note('Ma'), note('Dha'), komalNi, note('Sa', 'shuddha', 1), note('Dha'), komalNi, note('Sa', 'shuddha', 1), note('Re', 'shuddha', 1), note('Sa', 'shuddha', 1), komalNi, note('Dha'), komalGa, note('Ma'), komalNi, note('Dha'), note('Ma'), komalGa, note('Re'), note('Sa')]),
            ],
        },
        {
            id: 105,
            name: 'Sargam-Geet-Sthayi',
            taalId: 'teentaal',
            tempo: 82,
            rows: [
                row([
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    komalNi,
                    note('Dha'),
                    note('Ma'),
                    komalGa,
                    note('Re'),
                    note('Sa'),
                    note('Dha', 'shuddha', -1),
                    note('Ni', 'komal', -1),
                ]),
                row([
                    note('Sa'),
                    rest(),
                    note('Ma'),
                    rest(),
                    komalGa,
                    rest(),
                    note('Ma'),
                    note('Dha'),
                    note('Ni', 'komal', -1),
                    note('Dha', 'shuddha', -1),
                    komalNi,
                    note('Sa', 'shuddha', 1),
                    note('Re', 'shuddha', 1),
                    note('Sa', 'shuddha', 1),
                    komalNi,
                    note('Dha'),
                ]),
                row([
                    note('Ma'),
                    komalNi,
                    note('Dha'),
                    note('Ma'),
                    komalGa,
                    note('Re'),
                    note('Sa'),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                ]),
            ],
        },
        {
            id: 106,
            name: 'Sargam-Geet-Antara',
            taalId: 'teentaal',
            tempo: 82,
            rows: [
                row([
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    komalGa,
                    note('Ma'),
                    note('Dha'),
                    komalNi,
                    note('Sa', 'shuddha', 1),
                    komalNi,
                    note('Sa', 'shuddha', 1),
                    note('Sa', 'shuddha', 1),
                ]),
                row([
                    komalNi,
                    note('Sa', 'shuddha', 1),
                    note('Re', 'shuddha', 1),
                    note('Sa', 'shuddha', 1),
                    komalNi,
                    note('Sa', 'shuddha', 1),
                    komalNi,
                    note('Dha'),
                    note('Dha', 'shuddha', -1),
                    komalNi,
                    note('Sa', 'shuddha', 1),
                    note('Ma', 'shuddha', 1),
                    note('Ga', 'komal', 1),
                    note('Re', 'shuddha', 1),
                    note('Sa', 'shuddha', 1),
                    rest(),
                ]),
                row([
                    komalNi,
                    note('Sa', 'shuddha', 1),
                    komalNi,
                    note('Dha'),
                    note('Ma'),
                    komalGa,
                    note('Ma'),
                    note('Dha'),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                    rest(),
                ]),
            ],
        },
        {
            id: 107,
            name: 'Lakshan-Geet-Sthayi',
            taalId: 'jhaptaal',
            tempo: 90,
            rows: [
                row([
                    note('Ma'),
                    komalGa,
                    note('Re'),
                    note('Sa'),
                    rest(),
                    note('Ni', 'komal', -1),
                    note('Dha', 'shuddha', -1),
                    note('Ni', 'komal', -1),
                    note('Sa'),
                    rest(),
                ]),

                row([
                    note('Ni', 'komal', -1),
                    note('Sa'),
                    note('Ma'),
                    note('Ma'),
                    note('Ma'),
                    note('Ma'),
                    note('Pa'),
                    note('Dha'),
                    komalGa,
                    rest(),
                ]),

                row([
                    note('Ma'),
                    komalGa,
                    note('Ma'),
                    note('Dha'),
                    komalNi,
                    note('Sa', 'shuddha', 1),
                    rest(),
                    note('Sa', 'shuddha', 1),
                    rest(),
                    note('Sa', 'shuddha', 1),
                ]),

                [
                    {
                        layout: 2,
                        slots: [
                            note('Re', 'shuddha', 1),
                            komalNi,
                        ],
                    },
                    beat(note('Sa', 'shuddha', 1)),
                    beat(komalNi),
                    beat(note('Dha')),
                    beat(note('Ma')),
                    beat(note('Ma')),
                    beat(note('Pa')),
                    beat(note('Dha')),
                    beat(komalGa),
                    beat(rest()),
                ],
            ],
        },
        {
            id: 108,
            name: 'Lakshan-Geet-Antara',
            taalId: 'jhaptaal',
            tempo: 90,
            rows: [
                row([
                    note('Ma'),
                    komalGa,
                    note('Ma'),
                    note('Dha'),
                    komalNi,
                    note('Sa', 'shuddha', 1),
                    rest(),
                    note('Sa', 'shuddha', 1),
                    rest(),
                    note('Sa', 'shuddha', 1),
                ]),
                [
                    beat(note('Ma', 'shuddha', 1)),
                    beat(note('Ga', 'komal', 1)),
                    beat(note('Re', 'shuddha', 1)),
                    beat(note('Sa', 'shuddha', 1)),
                    beat(note('Sa', 'shuddha', 1)),
                    beat(note('Dha')),
                    {
                        layout: 2,
                        slots: [
                            note('Sa', 'shuddha', 1),
                            komalNi,
                        ],
                    },
                    beat(note('Dha')),
                    beat(note('Ma')),
                    beat(note('Ma')),
                ],
                [
                    {
                        layout: 2,
                        slots: [
                            note('Ma'),
                            komalGa,
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Ma'),
                            komalGa,
                        ],
                    },
                    beat(note('Ma')),
                    {
                        layout: 2,
                        slots: [
                            komalNi,
                            note('Dha'),
                        ],
                    },
                    beat(note('Sa', 'shuddha', 1)),
                    {
                        layout: 2,
                        slots: [
                            note('Ma'),
                            komalGa,
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Ma'),
                            komalGa,
                        ],
                    },
                    beat(note('Re')),
                    beat(note('Sa')),
                    beat(note('Sa')),
                ],
                [
                    {
                        layout: 2,
                        slots: [
                            note('Sa'),
                            note('Ni', 'komal', -1),
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Dha', 'shuddha', -1),
                            note('Ni', 'komal', -1),
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Sa'),
                            note('Ma'),
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            komalGa,
                            note('Ma'),
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Dha'),
                            note('Ma'),
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            komalNi,
                            note('Dha'),
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Sa', 'shuddha', 1),
                            komalNi,
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Re', 'shuddha', 1),
                            note('Sa', 'shuddha', 1),
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Ma', 'shuddha', 1),
                            note('Ga', 'komal', 1),
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Re', 'shuddha', 1),
                            note('Sa', 'shuddha', 1),
                        ],
                    },
                ],
                [
                    {
                        layout: 2,
                        slots: [
                            komalNi,
                            note('Dha'),
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Pa'),
                            note('Ma'),
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            komalGa,
                            note('Ma'),
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Dha'),
                            komalNi,
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Sa', 'shuddha', 1),
                            komalNi,
                        ],
                    },

                    {
                        layout: 2,
                        slots: [
                            note('Dha'),
                            note('Pa'),
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Ma'),
                            komalGa,
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Ma'),
                            komalGa,
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Ma'),
                            komalGa,
                        ],
                    },
                    {
                        layout: 2,
                        slots: [
                            note('Re'),
                            note('Sa'),
                        ],
                    }
                ]
            ],
        },
    ] as Section[],
    createdAt: ''
};