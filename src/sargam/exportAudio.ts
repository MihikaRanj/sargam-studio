import * as Tone from 'tone';
import { SWARA_MAP, TAAL_OPTIONS } from './constants';
import { buildSlotToken, parseToken } from './notation';
import { Section, Swara, Variant } from './types';

function getFrequency(
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


function getTotalDurationSeconds(sections: Section[], globalTempo: number): number {
    let total = 0;

    sections.forEach((section) => {
        const beatDuration = 60 / (section.tempo ?? globalTempo);
        section.rows.forEach((row) => {
            total += row.length * beatDuration;
        });
    });

    return total + 1.0;
}

function audioBufferToWavBlob(audioBuffer: AudioBuffer): Blob {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1;
    const bitDepth = 16;

    const channelData: Float32Array[] = [];
    for (let i = 0; i < numChannels; i++) {
        channelData.push(audioBuffer.getChannelData(i));
    }

    const numSamples = audioBuffer.length;
    const blockAlign = numChannels * (bitDepth / 8);
    const byteRate = sampleRate * blockAlign;
    const dataSize = numSamples * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    function writeString(offset: number, str: string) {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    }

    let offset = 0;

    writeString(offset, 'RIFF');
    offset += 4;
    view.setUint32(offset, 36 + dataSize, true);
    offset += 4;
    writeString(offset, 'WAVE');
    offset += 4;

    writeString(offset, 'fmt ');
    offset += 4;
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, format, true);
    offset += 2;
    view.setUint16(offset, numChannels, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, byteRate, true);
    offset += 4;
    view.setUint16(offset, blockAlign, true);
    offset += 2;
    view.setUint16(offset, bitDepth, true);
    offset += 2;

    writeString(offset, 'data');
    offset += 4;
    view.setUint32(offset, dataSize, true);
    offset += 4;

    for (let i = 0; i < numSamples; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
            let sample = channelData[ch][i];
            sample = Math.max(-1, Math.min(1, sample));
            const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
            view.setInt16(offset, intSample, true);
            offset += 2;
        }
    }

    return new Blob([buffer], { type: 'audio/wav' });
}

function getNativeAudioBuffer(
    renderedBuffer: Tone.ToneAudioBuffer | AudioBuffer
): AudioBuffer {
    if (renderedBuffer instanceof AudioBuffer) {
        return renderedBuffer;
    }

    const nativeBuffer = renderedBuffer.get();
    if (!nativeBuffer) {
        throw new Error('Offline render did not return an AudioBuffer.');
    }

    return nativeBuffer;
}

function pickTablaUrlFromBol(bol = ''): string {
    const b = bol.toLowerCase();

    if (b.includes('tin')) return '/audio/tabla/tin.wav';
    if (b.includes('dhin')) return '/audio/tabla/dhin.wav';
    if (b.includes('dhi') || b.includes('dha')) return '/audio/tabla/dha.wav';
    if (b.includes('ge')) return '/audio/tabla/ge.wav';
    if (b.includes('kat') || b.includes('ta')) return '/audio/tabla/ta.wav';
    if (b.includes('ki')) return '/audio/tabla/ka.wav';
    if (b.includes('tun')) return '/audio/tabla/tu.wav';

    return '/audio/tabla/na.wav';
}

async function createOfflineTablaPlayers() {
    const tablaGain = new Tone.Gain(0.35).toDestination(); //(0.25–0.5 range)

    const players = {
        dha: new Tone.Player('/audio/tabla/dha.wav').connect(tablaGain),
        dhin: new Tone.Player('/audio/tabla/dhin.wav').connect(tablaGain),
        dhi: new Tone.Player('/audio/tabla/dhi.wav').connect(tablaGain),
        tin: new Tone.Player('/audio/tabla/tin.wav').connect(tablaGain),
        na: new Tone.Player('/audio/tabla/na.wav').connect(tablaGain),
        ta: new Tone.Player('/audio/tabla/ta.wav').connect(tablaGain),
        ge: new Tone.Player('/audio/tabla/ge.wav').connect(tablaGain),
        ka: new Tone.Player('/audio/tabla/ka.wav').connect(tablaGain),
        tu: new Tone.Player('/audio/tabla/tu.wav').connect(tablaGain),
    };

    await Tone.loaded();
    return players;
}

function pickTablaPlayer(players: Awaited<ReturnType<typeof createOfflineTablaPlayers>>, bol = '') {
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

export async function exportSectionsToWav(params: {
    sections: Section[];
    sa: string;
    tempo: number;
    filename?: string;
}): Promise<void> {
    const { sections, sa, tempo, filename = 'sargam-composition.wav' } = params;

    const beatDuration = 60 / tempo;
    const totalDuration = getTotalDurationSeconds(sections, tempo);

    const renderedBuffer = await Tone.Offline(async ({ transport }) => {
        const synth = new Tone.Synth({
            oscillator: { type: 'triangle' },
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0.4,
                release: 0.15,
            },
        }).connect(new Tone.Gain(0.9).toDestination());

        const tablaPlayers = await createOfflineTablaPlayers();

        transport.bpm.value = tempo;

        let currentTime = 0;
        let lastPlayableToken: { swara: string; variant: Variant; octave: -1 | 0 | 1 } | null = null;

        sections.forEach((section) => {
            const taal = TAAL_OPTIONS[section.taalId];
            const sectionTempo = section.tempo ?? tempo;
            const beatDuration = 60 / sectionTempo;

            section.rows.forEach((row) => {
                row.forEach((beat, beatIndex) => {
                    if (taal.hasTabla) {
                        const bol = taal.bols[beatIndex] || '';
                        const player = pickTablaPlayer(tablaPlayers, bol);
                        player.start(currentTime);
                    }

                    const subDuration = beatDuration / beat.layout;

                    beat.slots.forEach((slot, slotIndex) => {
                        const slotTime = currentTime + slotIndex * subDuration;
                        const token = buildSlotToken(slot);

                        if (!token) return;

                        let freq: number | null = null;

                        if (token === '-') {
                            if (lastPlayableToken) {
                                freq = getFrequency(lastPlayableToken, sa);
                            }
                        } else {
                            const parsed = parseToken(token);
                            freq = getFrequency(parsed, sa);
                            lastPlayableToken = parsed;
                        }

                        if (freq) {
                            synth.triggerAttackRelease(freq, subDuration * 0.95, slotTime);
                        }
                    });

                    currentTime += beatDuration;
                });
            });
        });

        transport.start(0);
    }, totalDuration);

    const nativeBuffer = getNativeAudioBuffer(renderedBuffer);
    const wavBlob = audioBufferToWavBlob(nativeBuffer);
    const url = URL.createObjectURL(wavBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}