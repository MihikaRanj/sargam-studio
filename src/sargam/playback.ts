import * as Tone from 'tone';
import { SWARA_MAP, TAAL_OPTIONS } from './constants';
import { Section, Swara, Variant } from './types';
import { buildSlotToken, parseToken } from './notation';

export function getFrequency(
  token: { swara: string; variant: Variant; octave: -1 | 0 | 1 },
  sa: string
): number | null {
  if (token.swara === '-') return null;

  const baseMidi = Tone.Frequency(`${sa}4`).toMidi();
  let offset = SWARA_MAP[token.swara as Swara] ?? 0;

  if (token.variant === 'komal') offset -= 1;
  if (token.variant === 'teevra') offset += 1;

  const midi = baseMidi + token.octave * 12 + offset;
  return Tone.Frequency(midi, 'midi').toFrequency();
}

export function pickTablaPlayer(players: any, bol = '') {
  const b = bol.toLowerCase();

  if (b.includes('tin')) return players.tin;
  if (b.includes('dhin')) return players.dhin;
  if (b.includes('dhi') || b.includes('dha')) return players.dha;
  if (b.includes('ge')) return players.ge;
  if (b.includes('kat') || b.includes('ta')) return players.ta;
  if (b.includes('ki')) return players.ka;
  if (b.includes('tun')) return players.tu;

  return players.na;
}

export function createTablaPlayers() {
  return {
    dha: new Tone.Player('/audio/tabla/dha.wav').toDestination(),
    dhin: new Tone.Player('/audio/tabla/dhin.wav').toDestination(),
    dhi: new Tone.Player('/audio/tabla/dhi.wav').toDestination(),
    tin: new Tone.Player('/audio/tabla/tin.wav').toDestination(),
    na: new Tone.Player('/audio/tabla/na.wav').toDestination(),
    ta: new Tone.Player('/audio/tabla/ta.wav').toDestination(),
    ge: new Tone.Player('/audio/tabla/ge.wav').toDestination(),
    ka: new Tone.Player('/audio/tabla/ka.wav').toDestination(),
    tu: new Tone.Player('/audio/tabla/tu.wav').toDestination(),
  };
}

export async function playSections(params: {
  sections: Section[];
  sa: string;
  tempo: number;
  synth: Tone.Synth | null;
  tablaPlayers: any;
  onFinish: () => void;
}) {
  const { sections, sa, tempo, synth, tablaPlayers, onFinish } = params;

  await Tone.start();

  Tone.Transport.stop();
  Tone.Transport.cancel();
  Tone.Transport.position = 0;
  Tone.Transport.bpm.value = tempo;

  const beatDuration = Tone.Time('4n').toSeconds();
  let currentTime = 0;
  let lastPlayableToken: { swara: string; variant: Variant; octave: -1 | 0 | 1 } | null = null;

  sections.forEach((section) => {
    const taal = TAAL_OPTIONS[section.taalId];

    section.rows.forEach((row) => {
      row.forEach((beat, beatIndex) => {
        if (taal.hasTabla) {
          const bol = taal.bols[beatIndex] || '';
          Tone.Transport.schedule((tTime) => {
            if (!tablaPlayers) return;
            pickTablaPlayer(tablaPlayers, bol).start(tTime);
          }, currentTime);
        }

        const subDuration = beatDuration / beat.layout;

        beat.slots.forEach((slot, slotIndex) => {
          const slotTime = currentTime + slotIndex * subDuration;
          const token = buildSlotToken(slot);

          if (!token) return;

          let freq: number | null = null;

          if (token === '-') {
            if (lastPlayableToken) freq = getFrequency(lastPlayableToken, sa);
          } else {
            const parsed = parseToken(token);
            freq = getFrequency(parsed, sa);
            lastPlayableToken = parsed;
          }

          if (freq) {
            Tone.Transport.schedule((tTime) => {
              synth?.triggerAttackRelease(freq!, subDuration * 0.95, tTime);
            }, slotTime);
          }
        });

        currentTime += beatDuration;
      });
    });
  });

  Tone.Transport.schedule(() => onFinish(), currentTime + 0.05);
  Tone.Transport.start();
}