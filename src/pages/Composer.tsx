import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Tone from 'tone';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';
import { play, stop, chevronBack, homeOutline } from 'ionicons/icons';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { pageBackground, pageContainer, pillButton, primaryPillButton } from '../theme/siteStyles';
import { SAMPLE_BAGESHREE } from '../sargam/sampleCompositions';

import SetupScreen from '../components/SetupScreen';
import ComposerScreen from '../components/ComposerScreen';
import SurEditorModal from '../components/SurEditorModal';

import { TAAL_OPTIONS } from '../sargam/constants';
import { useLocation } from 'react-router';


import {
  buildSlotToken,
  createBeat,
  createEmptyRow,
  gridToText,
  parseToken,
  textToGrid,
} from '../sargam/notation';
import { createSection, normalizeFixedRow, normalizeSection } from '../sargam/sections';
import { createTablaPlayers, getFrequency, pickTablaPlayer } from '../sargam/playback';
import {
  AppStep,
  Beat,
  Section,
  SelectedCell,
  Slot,
  TaalId,
  Variant,
} from '../sargam/types';

import { exportSectionsToWav } from '../sargam/exportAudio';

import { getSavedCompositions, saveComposition, deleteComposition, SavedComposition } from '../sargam/storage';
import { trackEvent } from '../utils/analytics';

const DEFAULT_SA = 'C#';
const DEFAULT_TEMPO = 90;

type TaalBol = string | string[];

function getBolParts(bol: TaalBol | undefined): string[] {
  if (!bol) return [];
  return Array.isArray(bol) ? bol : [bol];
}

function formatBol(bol: TaalBol | undefined): string {
  return getBolParts(bol).join(' ');
}

function createInitialSections(): Section[] {
  return [
    {
      id: 1,
      name: 'Section 1',
      taalId: 'jhaptaal',
      tempo: DEFAULT_TEMPO,
      rows: [createEmptyRow(TAAL_OPTIONS.jhaptaal.beats || 8)],
    },
  ];
}

const Composer: React.FC = () => {
  const [step, setStep] = useState<AppStep>('setup');
  const [sa, setSa] = useState<string>(DEFAULT_SA);

  const [sections, setSections] = useState<Section[]>(createInitialSections());
  const [activeSectionId, setActiveSectionId] = useState<number>(1);
  const [activeRowIndex, setActiveRowIndex] = useState<number>(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [selectedCell, setSelectedCell] = useState<SelectedCell>({
    sectionId: 1,
    row: 0,
    beat: 0,
    slot: 0,
  });

  const [playing, setPlaying] = useState(false);
  const [previewingTaal, setPreviewingTaal] = useState(false);
  const [previewingScale, setPreviewingScale] = useState(false);

  const [playbackCursor, setPlaybackCursor] = useState<SelectedCell | null>(null);
  const [pausedPosition, setPausedPosition] = useState<any>(0);

  const synthRef = useRef<Tone.Synth | null>(null);
  const tablaPlayersRef = useRef<any>(null);
  const [savedItems, setSavedItems] = useState<SavedComposition[]>([]);
  const [currentSaveId, setCurrentSaveId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>('Untitled Composition');
  const location = useLocation();
  const reviewActionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination();
    tablaPlayersRef.current = createTablaPlayers();

    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, []);

  const activeSection = useMemo(
    () => sections.find((s) => s.id === activeSectionId) || sections[0],
    [sections, activeSectionId]
  );

  const selectedSection = useMemo(
    () => sections.find((s) => s.id === selectedCell.sectionId) || sections[0],
    [sections, selectedCell.sectionId]
  );

  const currentRow = activeSection?.rows[activeRowIndex] || [];
  const isFreeRow = activeSection?.taalId === 'none';

  const selectedBeat =
    selectedSection?.rows[selectedCell.row]?.[selectedCell.beat] || createBeat(1);

  const selectedSlot = selectedBeat.slots[selectedCell.slot] || {
    mode: 'note',
    swara: 'Sa',
    octave: 0,
    variant: 'shuddha',
  };

  useEffect(() => {
    if (!sections.find((s) => s.id === activeSectionId)) {
      setActiveSectionId(sections[0]?.id ?? 1);
    }
  }, [sections, activeSectionId]);

  useEffect(() => {
    setActiveRowIndex(0);
  }, [activeSectionId]);

  useEffect(() => {
    refreshSavedItems();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('start') === 'setup') {
      setStep('setup');
    }

    if (params.get('demo') === 'bageshree') {
      trackEvent('sample_opened', {
        sample_id: SAMPLE_BAGESHREE.id,
        sample_title: SAMPLE_BAGESHREE.title,
      });
      const demoSections = SAMPLE_BAGESHREE.sections.map((section) =>
        normalizeSection(section)
      );

      setCurrentSaveId(SAMPLE_BAGESHREE.id);
      setCurrentTitle(SAMPLE_BAGESHREE.title);
      setSa(SAMPLE_BAGESHREE.sa);
      setSections(demoSections);

      const firstSection = demoSections[0];
      if (firstSection) {
        setActiveSectionId(firstSection.id);
        setActiveRowIndex(0);
        setSelectedCell({
          sectionId: firstSection.id,
          row: 0,
          beat: 0,
          slot: 0,
        });
      }

      setStep('review');
    }
  }, [location.search]);

  useEffect(() => {
  if (step === 'review') {
    setTimeout(() => {
      reviewActionsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 150);
  }
}, [step]);

  function resetAllData() {
    const initialSections = createInitialSections();
    setSa(DEFAULT_SA);
    setSections(initialSections);
    setStep('setup');
    setActiveSectionId(initialSections[0].id);
    setActiveRowIndex(0);
    setSelectedCell({
      sectionId: initialSections[0].id,
      row: 0,
      beat: 0,
      slot: 0,
    });
    setPlaybackCursor(null);
    setPlaying(false);
    setCurrentSaveId(null);
    setCurrentTitle('Untitled Composition');
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  function removeSelectedCellFromRow(sectionId: number, rowIndex: number, beatIndex: number) {
    updateSection(sectionId, (section) => ({
      ...section,
      rows: section.rows.map((row, i) => {
        if (i !== rowIndex || row.length <= 1) return row;
        return row.filter((_, bIdx) => bIdx !== beatIndex);
      }),
    }));

    setSelectedCell((prev) => ({
      ...prev,
      beat: Math.max(0, Math.min(prev.beat, currentRow.length - 2)),
      slot: 0,
    }));
  }

  function updateSection(sectionId: number, updater: (section: Section) => Section) {
    setSections((prev) =>
      prev.map((section) =>
        section.id !== sectionId ? section : normalizeSection(updater(section))
      )
    );
  }

  function updateBeat(
    sectionId: number,
    rowIndex: number,
    beatIndex: number,
    updater: (beat: Beat) => Beat
  ) {
    updateSection(sectionId, (section) => ({
      ...section,
      rows: section.rows.map((row, rIdx) =>
        rIdx !== rowIndex
          ? row
          : row.map((beat, bIdx) => (bIdx !== beatIndex ? beat : updater(beat)))
      ),
    }));
  }

  function updateSlot(
    sectionId: number,
    rowIndex: number,
    beatIndex: number,
    slotIndex: number,
    updates: Partial<Slot>
  ) {
    updateBeat(sectionId, rowIndex, beatIndex, (beat) => ({
      ...beat,
      slots: beat.slots.map((slot, sIdx) =>
        sIdx !== slotIndex ? slot : { ...slot, ...updates }
      ),
    }));
  }

  function setSelectedSlot(updates: Partial<Slot>) {
    updateSlot(
      selectedCell.sectionId,
      selectedCell.row,
      selectedCell.beat,
      selectedCell.slot,
      updates
    );
  }

  function setBeatLayout(
    sectionId: number,
    rowIndex: number,
    beatIndex: number,
    layout: 1 | 2 | 3 | 4
  ) {
    updateBeat(sectionId, rowIndex, beatIndex, (beat) => ({
      ...beat,
      layout,
      slots: Array.from({ length: layout }, (_, i) =>
        beat.slots[i]
          ? { ...beat.slots[i] }
          : {
            mode: 'note',
            swara: 'Sa',
            octave: 0,
            variant: 'shuddha',
          }
      ),
    }));

    setSelectedCell((prev) => ({
      ...prev,
      sectionId,
      row: rowIndex,
      beat: beatIndex,
      slot: Math.min(prev.slot, layout - 1),
    }));
  }

  function addSection(taalId: TaalId) {
    const newSection = createSection(taalId, `Section ${sections.length + 1}`, DEFAULT_TEMPO);
    setSections((prev) => [...prev, newSection]);
    setActiveSectionId(newSection.id);
    setSelectedCell({
      sectionId: newSection.id,
      row: 0,
      beat: 0,
      slot: 0,
    });
  }

  function removeSection(sectionId: number) {
    setSections((prev) => {
      if (prev.length === 1) return prev;
      const next = prev.filter((s) => s.id !== sectionId);

      if (selectedCell.sectionId === sectionId) {
        setSelectedCell({
          sectionId: next[0].id,
          row: 0,
          beat: 0,
          slot: 0,
        });
      }

      if (activeSectionId === sectionId) {
        setActiveSectionId(next[0].id);
        setActiveRowIndex(0);
      }

      return next;
    });
  }

  function addRow(sectionId: number) {
    updateSection(sectionId, (section) => ({
      ...section,
      rows: [
        ...section.rows,
        createEmptyRow(section.taalId === 'none' ? 8 : TAAL_OPTIONS[section.taalId].beats || 8),
      ],
    }));
  }

  function removeRow(sectionId: number, rowIndex: number) {
    updateSection(sectionId, (section) => {
      if (section.rows.length === 1) return section;
      return {
        ...section,
        rows: section.rows.filter((_, i) => i !== rowIndex),
      };
    });

    setActiveRowIndex(0);
    setSelectedCell((prev) => ({
      ...prev,
      row: 0,
      beat: 0,
      slot: 0,
    }));
  }

  function clearRow(sectionId: number, rowIndex: number) {
    updateSection(sectionId, (section) => {
      const rowLen = section.rows[rowIndex]?.length || 8;
      const nextLen = section.taalId === 'none' ? rowLen : TAAL_OPTIONS[section.taalId].beats || 8;

      return {
        ...section,
        rows: section.rows.map((row, i) =>
          i === rowIndex ? createEmptyRow(nextLen) : row
        ),
      };
    });
  }

  function addCellToRow(sectionId: number, rowIndex: number) {
    updateSection(sectionId, (section) => ({
      ...section,
      rows: section.rows.map((row, i) => (i === rowIndex ? [...row, createBeat(1)] : row)),
    }));
  }

  function goToPrevSlot() {
    if (selectedCell.slot > 0) {
      setSelectedCell((prev) => ({ ...prev, slot: prev.slot - 1 }));
    }
  }

  function goToNextSlot() {
    const row = selectedSection?.rows[selectedCell.row];
    if (!row) return;

    const beat = row[selectedCell.beat];
    if (!beat) return;

    if (selectedCell.slot < beat.layout - 1) {
      setSelectedCell((prev) => ({ ...prev, slot: prev.slot + 1 }));
    }
  }

  function duplicatePreviousSlot() {
    const row = selectedSection?.rows[selectedCell.row];
    if (!row) return;

    const currentBeat = row[selectedCell.beat];
    if (!currentBeat) return;

    // If we are at the first note of a beat, copy the entire previous beat.
    // This is useful for Dugun/Tigun/Chaugun patterns.
    if (selectedCell.slot === 0 && selectedCell.beat > 0) {
      const prevBeat = row[selectedCell.beat - 1];
      if (!prevBeat) return;

      updateBeat(
        selectedCell.sectionId,
        selectedCell.row,
        selectedCell.beat,
        () => ({
          layout: prevBeat.layout,
          slots: prevBeat.slots.map((slot) => ({
            mode: slot.mode,
            swara: slot.swara,
            octave: slot.octave,
            variant: slot.variant,
          })),
        })
      );

      setSelectedCell((prev) => ({
        ...prev,
        slot: 0,
      }));

      return;
    }

    // Otherwise, copy only the previous note within the current beat.
    if (selectedCell.slot > 0) {
      const prevSlot = currentBeat.slots[selectedCell.slot - 1];
      if (!prevSlot) return;

      setSelectedSlot({
        mode: prevSlot.mode,
        swara: prevSlot.swara,
        octave: prevSlot.octave,
        variant: prevSlot.variant,
      });
    }
  }

  function goToPrevSection() {
    const index = sections.findIndex((s) => s.id === activeSectionId);
    if (index <= 0) return;
    const prevSection = sections[index - 1];
    setActiveSectionId(prevSection.id);
    setSelectedCell({
      sectionId: prevSection.id,
      row: 0,
      beat: 0,
      slot: 0,
    });
  }

  function goToNextSection() {
    const index = sections.findIndex((s) => s.id === activeSectionId);
    if (index < 0 || index >= sections.length - 1) return;
    const nextSection = sections[index + 1];
    setActiveSectionId(nextSection.id);
    setSelectedCell({
      sectionId: nextSection.id,
      row: 0,
      beat: 0,
      slot: 0,
    });
  }

  function goToPrevBeat() {
    setSelectedCell((prev) => {
      if (prev.beat === 0) return prev;

      return {
        ...prev,
        beat: prev.beat - 1,
        slot: 0, // reset to first note
      };
    });
  }

  function goToNextBeat() {
    setSelectedCell((prev) => {
      const row = sections
        .find((s) => s.id === prev.sectionId)
        ?.rows[prev.row];

      if (!row || prev.beat >= row.length - 1) return prev;

      return {
        ...prev,
        beat: prev.beat + 1,
        slot: 0,
      };
    });
  }
  async function playAll(startFromBeginning = false) {
    await Tone.start();
    setPlaying(true);
    setPlaybackCursor(null);

    const startPosition = startFromBeginning ? 0 : pausedPosition || 0;

    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = startPosition;

    let currentTime = 0;
    let lastPlayableToken: { swara: string; variant: Variant; octave: -1 | 0 | 1 } | null = null;

    sections.forEach((section) => {
      const currentTaal = TAAL_OPTIONS[section.taalId];
      const sectionTempo = section.tempo ?? DEFAULT_TEMPO;
      const beatDuration = 60 / sectionTempo;

      section.rows.forEach((row, rowIndex) => {
        row.forEach((beat, beatIndex) => {
          if (currentTaal.hasTabla) {
            const bolParts = getBolParts(currentTaal.bols[beatIndex]);
            const bolSubDuration = beatDuration / Math.max(1, bolParts.length);

            bolParts.forEach((bolPart, bolPartIndex) => {
              Tone.Transport.schedule((tTime) => {
                const players = tablaPlayersRef.current;
                if (!players) return;
                pickTablaPlayer(players, bolPart).start(tTime);
              }, currentTime + bolPartIndex * bolSubDuration);
            });
          }

          const subDuration = beatDuration / beat.layout;

          beat.slots.forEach((slot, slotIndex) => {
            const slotTime = currentTime + slotIndex * subDuration;
            const token = buildSlotToken(slot);

            Tone.Transport.schedule((tTime) => {
              Tone.Draw.schedule(() => {
                setPlaybackCursor({
                  sectionId: section.id,
                  row: rowIndex,
                  beat: beatIndex,
                  slot: slotIndex,
                });
              }, tTime);
            }, slotTime);

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
              Tone.Transport.schedule((tTime) => {
                synthRef.current?.triggerAttackRelease(freq, subDuration * 0.95, tTime);
              }, slotTime);
            }
          });

          currentTime += beatDuration;
        });
      });
    });

    Tone.Transport.schedule((tTime) => {
      Tone.Draw.schedule(() => {
        setPlaying(false);
        setPlaybackCursor(null);
      }, tTime);
    }, currentTime + 0.05);

    Tone.Transport.start(undefined, startPosition);
  }


  function stopAll() {
    trackEvent('stop_click');
    setPausedPosition(Tone.Transport.position);
    Tone.Transport.pause();
    setPlaying(false);
    setPlaybackCursor(null);
  }

  async function previewTaal() {
    await Tone.start();

    const section = activeSection;
    if (!section || section.taalId === 'none') return;

    const taal = TAAL_OPTIONS[section.taalId];
    if (!taal.hasTabla) return;



    const tempo = section.tempo ?? DEFAULT_TEMPO;
    const beatDuration = 60 / tempo;
    const taalBeats = taal.beats ?? taal.bols.length;
    const cycleDuration = beatDuration * taalBeats;

    trackEvent('preview_taal_click', {
      taal: section.taalId,
      tempo,
    });

    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;

    Tone.Transport.scheduleRepeat((time) => {
      taal.bols.forEach((bol, beatIndex) => {
        const players = tablaPlayersRef.current;
        if (!players) return;

        const bolParts = getBolParts(bol);
        const bolSubDuration = beatDuration / Math.max(1, bolParts.length);

        bolParts.forEach((bolPart, bolPartIndex) => {
          const player = pickTablaPlayer(players, bolPart);
          player.start(time + beatIndex * beatDuration + bolPartIndex * bolSubDuration);
        });
      });
    }, cycleDuration, 0);

    setPreviewingTaal(true);
    Tone.Transport.start();
  }

  async function previewScale() {
    await Tone.start();

    Tone.Transport.stop();
    Tone.Transport.cancel();

    const previewSynth = synthRef.current;
    if (!previewSynth) return;

    trackEvent('preview_scale_click', {
      sa,
    });

    const notes = ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni', 'Sa'];
    const gap = 0.35;

    setPreviewingScale(true);

    notes.forEach((swara, index) => {
      const octave = index === notes.length - 1 ? 1 : 0;
      const freq = getFrequency({ swara, variant: 'shuddha', octave }, sa);

      if (freq) {
        Tone.Transport.schedule((time) => {
          previewSynth.triggerAttackRelease(freq, 0.28, time);
        }, index * gap);
      }
    });

    Tone.Transport.schedule(() => {
      setPreviewingScale(false);
    }, notes.length * gap + 0.2);

    Tone.Transport.start();
  }

  function stopScalePreview() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setPreviewingScale(false);
  }

  function stopTaalPreview() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setPreviewingTaal(false);
  }

  function restartAll() {
    trackEvent('restart_click');

    setPausedPosition(0);
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setPlaybackCursor(null);
    setPlaying(false);

    playAll(true);
  }

  async function exportAudio() {
    try {
      trackEvent('export_wav_click', {
        section_count: sections.length,
      });
      await exportSectionsToWav({
        sections,
        sa,
        tempo: DEFAULT_TEMPO,
        filename: 'sargam-composition.wav',
      });
    } catch (error) {
      console.error('Audio export failed:', error);
    }
  }

  async function refreshSavedItems() {
    const items = await getSavedCompositions();
    setSavedItems(items);
  }

  async function handleSave() {
    trackEvent('save_click', {
      section_count: sections.length,
    });
    const entered = window.prompt('Enter composition name', currentTitle);
    if (!entered) return;

    const trimmed = entered.trim();
    if (!trimmed) return;

    const saved = await saveComposition({
      id: currentSaveId ?? undefined,
      title: trimmed,
      sa,
      sections,
    });

    setCurrentSaveId(saved.id);
    setCurrentTitle(saved.title);
    await refreshSavedItems();
  }

  async function handleLoad(item: SavedComposition) {
    if (item.id.startsWith('sample-')) {
      trackEvent('sample_opened', {
        sample_id: item.id,
        sample_title: item.title,
      });
    }
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setPlaying(false);
    setPlaybackCursor(null);

    setCurrentSaveId(item.id);
    setCurrentTitle(item.title);
    setSa(item.sa);
    setSections(item.sections.map((section) => normalizeSection(section)));

    const firstSection = item.sections[0];
    if (firstSection) {
      setActiveSectionId(firstSection.id);
      setActiveRowIndex(0);
      setSelectedCell({
        sectionId: firstSection.id,
        row: 0,
        beat: 0,
        slot: 0,
      });
    }

    setStep('compose');
  }

  async function handleDeleteSaved(id: string) {
    const ok = window.confirm('Delete this saved composition?');
    if (!ok) return;

    await deleteComposition(id);
    if (currentSaveId === id) {
      setCurrentSaveId(null);
      setCurrentTitle('Untitled Composition');
    }
    await refreshSavedItems();
  }
  const activeSectionText = activeSection ? gridToText(activeSection.rows) : '';

  function renderReviewScreen() {
    return (
      <div style={{ display: 'grid', gap: 18 }}>
        <div
          style={{
            borderRadius: 26,
            padding: '24px 26px',
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(120, 53, 15, 0.12)',
            boxShadow: '0 12px 32px rgba(31,41,55,0.09)',
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 950, color: '#1f2937' }}>
            Review Composition
          </div>

          <div style={{ color: '#64748b', fontSize: 15, marginTop: 6 }}>
            Preview your notation, play it back, then save or export your composition.
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 16,
            }}
          >
            <span
              style={{
                padding: '7px 12px',
                borderRadius: 999,
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: 13,
                fontWeight: 850,
              }}
            >
              Sa: {sa}
            </span>

            <span
              style={{
                padding: '7px 12px',
                borderRadius: 999,
                background: '#fff7ed',
                color: '#92400e',
                fontSize: 13,
                fontWeight: 850,
              }}
            >
              {sections.length} section{sections.length === 1 ? '' : 's'}
            </span>

            <span
              style={{
                padding: '7px 12px',
                borderRadius: 999,
                background: playing ? '#dcfce7' : '#f8fafc',
                color: playing ? '#166534' : '#475569',
                fontSize: 13,
                fontWeight: 850,
              }}
            >
              {playing ? 'Playing now' : 'Ready to play'}
            </span>
          </div>
        </div>

        {sections.map((section, sectionIndex) => {
          const taal = TAAL_OPTIONS[section.taalId];

          return (
            <IonCard key={section.id} style={{ borderRadius: 26, margin: 0 }}>
              <IonCardContent style={{ padding: 22 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 14,
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 950,
                        letterSpacing: '-0.03em',
                        color: '#92400e',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      Section {sectionIndex + 1}
                    </div>

                    <div style={{ fontSize: 24, fontWeight: 950, color: '#1f2937' }}>
                      {section.name || `Section ${sectionIndex + 1}`}
                    </div>

                    <div style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                      {taal.name} • Tempo {section.tempo ?? DEFAULT_TEMPO}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '7px 12px',
                      borderRadius: 999,
                      background: section.taalId === 'none' ? '#fff7ed' : '#eff6ff',
                      color: section.taalId === 'none' ? '#92400e' : '#1d4ed8',
                      fontSize: 13,
                      fontWeight: 850,
                    }}
                  >
                    {section.taalId === 'none' ? 'Aalap / Free rhythm' : 'Taal cycle'}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
                  {section.rows.map((row, rowIndex) => (
                    <div key={rowIndex} style={{ minWidth: 0, maxWidth: '100%' }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 950,
                          letterSpacing: '-0.03em',
                          color: '#64748b',
                          textTransform: 'uppercase',
                          marginBottom: 8,
                        }}
                      >
                        Row {rowIndex + 1}
                      </div>

                      <div
                        style={{
                          width: '100%',
                          maxWidth: '100%',
                          minWidth: 0,
                          overflowX: 'scroll',
                          overflowY: 'hidden',
                          paddingBottom: 12,
                          scrollbarWidth: 'auto',
                          WebkitOverflowScrolling: 'touch',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            width: 'max-content',
                          }}
                        >
                          {row.map((beat, beatIndex) => {
                            const isPlayingBeat =
                              playbackCursor?.sectionId === section.id &&
                              playbackCursor?.row === rowIndex &&
                              playbackCursor?.beat === beatIndex;

                            return (
                              <div
                                key={beatIndex}
                                style={{
                                  minWidth: 74,
                                  borderRadius: 16,
                                  border: isPlayingBeat
                                    ? '2px solid #2563eb'
                                    : '1px solid rgba(15,23,42,0.08)',
                                  padding: 8,
                                  background: isPlayingBeat ? '#eff6ff' : '#fff',
                                  boxShadow: isPlayingBeat
                                    ? '0 10px 24px rgba(37,99,235,0.14)'
                                    : '0 5px 14px rgba(31,41,55,0.05)',
                                  transition: 'all 0.12s ease',
                                }}
                              >
                                <div
                                  style={{
                                    textAlign: 'center',
                                    fontSize: 10,
                                    fontWeight: 950,
                                    letterSpacing: '-0.03em',
                                    color: '#64748b',
                                    marginBottom: 4,
                                  }}
                                >
                                  {section.taalId !== 'none'
                                    ? taal.markers[beatIndex + 1] || `B${beatIndex + 1}`
                                    : `C${beatIndex + 1}`}
                                </div>

                                {section.taalId !== 'none' && (
                                  <div
                                    style={{
                                      textAlign: 'center',
                                      fontSize: 10,
                                      color: '#94a3b8',
                                      marginBottom: 6,
                                      minHeight: 12,
                                    }}
                                  >
                                    {formatBol(taal.bols[beatIndex])}
                                  </div>
                                )}

                                <div style={{ display: 'grid', gap: 5 }}>
                                  {beat.slots.map((slot, slotIndex) => {
                                    const isPlayingSlot =
                                      playbackCursor?.sectionId === section.id &&
                                      playbackCursor?.row === rowIndex &&
                                      playbackCursor?.beat === beatIndex &&
                                      playbackCursor?.slot === slotIndex;

                                    return (
                                      <div
                                        key={slotIndex}
                                        style={{
                                          borderRadius: 10,
                                          minHeight: 26,
                                          padding: '4px 5px',
                                          textAlign: 'center',
                                          fontWeight: isPlayingSlot ? 950 : 850,
                                          fontSize: 15,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          border: isPlayingSlot
                                            ? '2px solid #2563eb'
                                            : '1px solid rgba(37,99,235,0.18)',
                                          background: isPlayingSlot ? '#2563eb' : '#f8fafc',
                                          color: isPlayingSlot ? '#fff' : '#1f2937',
                                          transform: isPlayingSlot ? 'scale(1.04)' : 'scale(1)',
                                          boxShadow: isPlayingSlot
                                            ? '0 0 0 3px rgba(37,99,235,0.12)'
                                            : 'none',
                                          transition: 'all 0.12s ease',
                                          lineHeight: 1,
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {buildSlotToken(slot) || '—'}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          );
        })}
      </div>
    );
  }

  const actionButtonStyle = pillButton;
  const primaryActionStyle = primaryPillButton;

  async function playCurrentRow() {
    await Tone.start();
    trackEvent('play_row_click', {
      section_id: activeSection?.id,
      row_index: activeRowIndex + 1,
      taal: activeSection?.taalId,
    });
    setPlaying(true);
    setPlaybackCursor(null);

    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;

    const section = activeSection;
    const row = section?.rows[activeRowIndex];
    if (!section || !row) return;

    const currentTaal = TAAL_OPTIONS[section.taalId];
    const sectionTempo = section.tempo ?? DEFAULT_TEMPO;
    const beatDuration = 60 / sectionTempo;

    let currentTime = 0;
    let lastPlayableToken: { swara: string; variant: Variant; octave: -1 | 0 | 1 } | null = null;

    row.forEach((beat, beatIndex) => {
      if (currentTaal.hasTabla) {
        const bolParts = getBolParts(currentTaal.bols[beatIndex]);
        const bolSubDuration = beatDuration / Math.max(1, bolParts.length);

        bolParts.forEach((bolPart, bolPartIndex) => {
          Tone.Transport.schedule((tTime) => {
            const players = tablaPlayersRef.current;
            if (!players) return;
            pickTablaPlayer(players, bolPart).start(tTime);
          }, currentTime + bolPartIndex * bolSubDuration);
        });
      }

      const subDuration = beatDuration / beat.layout;

      beat.slots.forEach((slot, slotIndex) => {
        const slotTime = currentTime + slotIndex * subDuration;
        const token = buildSlotToken(slot);

        Tone.Transport.schedule((tTime) => {
          Tone.Draw.schedule(() => {
            setPlaybackCursor({
              sectionId: section.id,
              row: activeRowIndex,
              beat: beatIndex,
              slot: slotIndex,
            });
          }, tTime);
        }, slotTime);

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
          Tone.Transport.schedule((tTime) => {
            synthRef.current?.triggerAttackRelease(freq, subDuration * 0.95, tTime);
          }, slotTime);
        }
      });

      currentTime += beatDuration;
    });

    Tone.Transport.schedule((tTime) => {
      Tone.Draw.schedule(() => {
        setPlaying(false);
        setPlaybackCursor(null);
      }, tTime);
    }, currentTime + 0.05);

    Tone.Transport.start();
  }

  async function playCurrentSection() {
    await Tone.start();
    trackEvent('play_section_click', {
      section_id: activeSection?.id,
      taal: activeSection?.taalId,
    });

    setPlaying(true);
    setPlaybackCursor(null);

    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;

    const section = activeSection;
    if (!section) return;

    const currentTaal = TAAL_OPTIONS[section.taalId];
    const sectionTempo = section.tempo ?? DEFAULT_TEMPO;
    const beatDuration = 60 / sectionTempo;

    let currentTime = 0;
    let lastPlayableToken: { swara: string; variant: Variant; octave: -1 | 0 | 1 } | null = null;

    section.rows.forEach((row, rowIndex) => {
      row.forEach((beat, beatIndex) => {
        if (currentTaal.hasTabla) {
          const bolParts = getBolParts(currentTaal.bols[beatIndex]);
          const bolSubDuration = beatDuration / Math.max(1, bolParts.length);

          bolParts.forEach((bolPart, bolPartIndex) => {
            Tone.Transport.schedule((tTime) => {
              const players = tablaPlayersRef.current;
              if (!players) return;
              pickTablaPlayer(players, bolPart).start(tTime);
            }, currentTime + bolPartIndex * bolSubDuration);
          });
        }

        const subDuration = beatDuration / beat.layout;

        beat.slots.forEach((slot, slotIndex) => {
          const slotTime = currentTime + slotIndex * subDuration;
          const token = buildSlotToken(slot);

          Tone.Transport.schedule((tTime) => {
            Tone.Draw.schedule(() => {
              setPlaybackCursor({
                sectionId: section.id,
                row: rowIndex,
                beat: beatIndex,
                slot: slotIndex,
              });
            }, tTime);
          }, slotTime);

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
            Tone.Transport.schedule((tTime) => {
              synthRef.current?.triggerAttackRelease(freq, subDuration * 0.95, tTime);
            }, slotTime);
          }
        });

        currentTime += beatDuration;
      });
    });

    Tone.Transport.schedule((tTime) => {
      Tone.Draw.schedule(() => {
        setPlaying(false);
        setPlaybackCursor(null);
      }, tTime);
    }, currentTime + 0.05);

    Tone.Transport.start();
  }
  const renderComposerActions = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 14,
        flexWrap: 'wrap',
        marginBottom: 18,
        padding: '14px 18px',
        borderRadius: 22,
        background: 'rgba(255,255,255,0.88)',
        border: '1px solid rgba(120, 53, 15, 0.12)',
        boxShadow: '0 10px 28px rgba(31,41,55,0.08)',
      }}
    >
      <div>
        <div style={{ fontSize: 15, fontWeight: 950, letterSpacing: '-0.03em', color: '#1f2937' }}>
          {step === 'setup' && 'Composition Setup'}
          {step === 'compose' && 'Composer Workspace'}
          {step === 'review' && 'Review & Export'}
        </div>

        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
          {step === 'setup' && 'Choose scale, sections, and saved work before composing.'}
          {step === 'compose' && 'Edit swaras, taal, rhythm, rows, and beat patterns.'}
          {step === 'review' && 'Play, save, and export your finished composition.'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {step === 'setup' && (
          <>
            <IonButton
              fill="outline"
              color="danger"
              onClick={resetAllData}
              style={actionButtonStyle}
            >
              Reset Composition
            </IonButton>

            <IonButton
              onClick={() => {
                trackEvent('start_composing_click');
                const firstSection = sections[0];
                setActiveSectionId(firstSection.id);
                setActiveRowIndex(0);
                setSelectedCell({
                  sectionId: firstSection.id,
                  row: 0,
                  beat: 0,
                  slot: 0,
                });
                setStep('compose');
              }}
              style={primaryActionStyle}
            >
              Continue to Composer
            </IonButton>
          </>
        )}

        {step === 'compose' && (
          <>
            <IonButton
              fill="outline"
              onClick={() => setStep('setup')}
              style={actionButtonStyle}
            >
              Back to Setup
            </IonButton>

            <IonButton
              fill="outline"
              onClick={handleSave}
              style={actionButtonStyle}
            >
              Save
            </IonButton>

            <IonButton
              fill="outline"
              onClick={playing ? stopAll : playCurrentSection}
              style={actionButtonStyle}
            >
              <IonIcon slot="start" icon={playing ? stop : play} />
              {playing ? 'Stop' : 'Play Section'}
            </IonButton>

            <IonButton
              onClick={() => setStep('review')}
              style={primaryActionStyle}
            >
              Review Composition
            </IonButton>
          </>
        )}

        {step === 'review' && (
          <>
            <IonButton
              fill="outline"
              onClick={() => setStep('compose')}
              style={actionButtonStyle}
            >
              Back to Composer
            </IonButton>

            <IonButton
              fill="outline"
              onClick={handleSave}
              style={actionButtonStyle}
            >
              Save
            </IonButton>

            <IonButton
              fill="outline"
              onClick={restartAll}
              style={actionButtonStyle}
            >
              Restart
            </IonButton>
            <IonButton
              onClick={() => {
                trackEvent('play_full_click', {
                  section_count: sections.length,
                });

                playAll(false);
              }}
              disabled={playing}
              style={primaryActionStyle}
            >
              <IonIcon slot="start" icon={play} />
              Play
            </IonButton>

            <IonButton
              fill="outline"
              onClick={stopAll}
              style={actionButtonStyle}
            >
              <IonIcon slot="start" icon={stop} />
              Stop
            </IonButton>

            <IonButton
              fill="outline"
              onClick={exportAudio}
              style={actionButtonStyle}
            >
              Export
            </IonButton>
          </>
        )}


      </div>
    </div>
  );
  return (
    <IonPage>

      <SiteHeader showHome={true} showHelp={true} />
      <IonContent fullscreen>
        <div style={pageBackground}>
          <div
            style={{
              ...pageContainer(step === 'setup' ? 860 : 1040),
              paddingTop: step === 'setup' ? 28 : 34,
            }}
          >


            {step === 'setup' && (
              <div style={{ textAlign: 'center', margin: '14px 0 18px' }}>
                <div style={{ fontSize: 42, fontWeight: 950, letterSpacing: '-0.03em', color: '#1f2937' }}>
                  Sargam Studio
                </div>
                <div style={{ fontSize: 17, color: '#6b7280', marginTop: 8 }}>
                  Create, play, and export Hindustani sargam compositions.
                </div>
              </div>
            )}

            {step === 'setup' && (
              <SetupScreen
                sa={sa}
                sections={sections}
                onSetSa={setSa}
                onAddSection={addSection}
                onRemoveSection={removeSection}
                onPreviewScale={previewingScale ? stopScalePreview : previewScale}
                previewingScale={previewingScale}
              />
            )}

            {step === 'setup' && renderComposerActions()}

            {step === 'setup' && savedItems.length > 0 && (
              <IonCard style={{ marginTop: 12, borderRadius: 18 }}>
                <IonCardContent>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
                    Saved Compositions
                  </div>

                  <div style={{ display: 'grid', gap: 10 }}>
                    {[SAMPLE_BAGESHREE, ...savedItems].map((item) => (
                      <div
                        key={item.id}
                        style={{
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: 12,
                          padding: 12,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700 }}>{item.title}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>
                            Sa {item.sa} • {new Date(item.updatedAt).toLocaleString()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <IonButton
                            size="small"
                            fill="outline"
                            onClick={() => handleLoad(item)}
                            style={{
                              '--border-radius': '999px',
                              fontWeight: 700,
                              minHeight: '38px',
                              textTransform: 'none',
                            }}
                          >
                            Open
                          </IonButton>

                          {!item.id.startsWith('sample-') && (
                            <IonButton
                              size="small"
                              fill="outline"
                              color="danger"
                              onClick={() => handleDeleteSaved(item.id)}
                              style={{
                                '--border-radius': '999px',
                                fontWeight: 700,
                                minHeight: '38px',
                                textTransform: 'none',
                              }}
                            >
                              Delete
                            </IonButton>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </IonCardContent>
              </IonCard>
            )}

            {step === 'compose' && (
              <ComposerScreen
                sections={sections}
                activeSection={activeSection}
                activeSectionId={activeSectionId}
                activeRowIndex={activeRowIndex}
                selectedCell={selectedCell}
                currentRow={currentRow}
                isFreeRow={isFreeRow}
                activeSectionText={activeSectionText}
                onSetActiveSectionId={(id: number) => {
                  setActiveSectionId(id);
                  setSelectedCell({
                    sectionId: id,
                    row: 0,
                    beat: 0,
                    slot: 0,
                  });
                }}
                onPrevSection={goToPrevSection}
                onNextSection={goToNextSection}
                onUpdateSectionName={(sectionId: number, name: string) =>
                  updateSection(sectionId, (s) => ({
                    ...s,
                    name,
                  }))
                }
                onUpdateSectionTaal={(sectionId: number, nextTaalId: TaalId) =>
                  updateSection(sectionId, (s) => {
                    const next = { ...s, taalId: nextTaalId };
                    if (nextTaalId !== 'none') {
                      next.rows = s.rows.map((row) =>
                        normalizeFixedRow(row, TAAL_OPTIONS[nextTaalId].beats || 8)
                      );
                    }
                    return normalizeSection(next);
                  })
                }
                onUpdateSectionTempo={(sectionId: number, nextTempo: number) =>
                  updateSection(sectionId, (s) => ({
                    ...s,
                    tempo: Number.isFinite(nextTempo) && nextTempo > 0 ? nextTempo : DEFAULT_TEMPO,
                  }))
                }
                onSetActiveRowIndex={(idx: number) => {
                  setActiveRowIndex(idx);
                  setSelectedCell({
                    sectionId: activeSection.id,
                    row: idx,
                    beat: 0,
                    slot: 0,
                  });
                }}
                onAddRow={addRow}
                onAddCellToRow={addCellToRow}
                onRemoveSelectedCellFromRow={removeSelectedCellFromRow}
                onClearRow={clearRow}
                onRemoveRow={removeRow}
                onSelectBeat={(cell) => {
                  setSelectedCell(cell);
                }}
                onOpenEditor={(cell) => {
                  trackEvent('sur_editor_open', {
                    section_id: cell.sectionId,
                    row_index: cell.row + 1,
                    beat_index: cell.beat + 1,
                    slot_index: cell.slot + 1,
                  });

                  setSelectedCell(cell);
                  setIsEditorOpen(true);
                }}
                onTextChange={(value: string) =>
                  updateSection(activeSection.id, (s) => ({
                    ...s,
                    rows: textToGrid(
                      value,
                      s.taalId === 'none',
                      TAAL_OPTIONS[s.taalId].beats
                    ),
                  }))
                }
                onPlayRow={playing ? stopAll : playCurrentRow}
                playing={playing}
                onPreviewTaal={previewingTaal ? stopTaalPreview : previewTaal}
                previewingTaal={previewingTaal}
                sa={sa}
                onSetSa={setSa}
                onPreviewScale={previewingScale ? stopScalePreview : previewScale}
                previewingScale={previewingScale}
              />
            )}

            {step === 'compose' && (
              <div style={{ marginTop: 22 }}>
                {renderComposerActions()}
              </div>
            )}

            {step === 'review' && (
              <>
                {renderReviewScreen()}

                <div ref={reviewActionsRef} style={{ marginTop: 22 }}>
                  {renderComposerActions()}
                </div>
              </>
            )}
          </div>
          <SiteFooter />
        </div>
      </IonContent>

      <SurEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        selectedCell={selectedCell}
        selectedSectionTaalId={selectedSection?.taalId || 'none'}
        selectedBeat={selectedBeat}
        selectedSlot={selectedSlot as Slot}
        onPrevSlot={goToPrevSlot}
        onNextSlot={goToNextSlot}
        onCopyPrev={duplicatePreviousSlot}
        onSetBeatLayout={(layout) =>
          setBeatLayout(
            selectedCell.sectionId,
            selectedCell.row,
            selectedCell.beat,
            layout
          )
        }
        onSetSelectedSlotIndex={(slotIndex) =>
          setSelectedCell((prev) => ({ ...prev, slot: slotIndex }))
        }
        onSetSelectedSlot={setSelectedSlot}
        onPrevBeat={goToPrevBeat}
        onNextBeat={goToNextBeat}
      />
    </IonPage>

  );
};

export default Composer;