import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Tone from 'tone';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import { play, stop, chevronBack } from 'ionicons/icons';

import SetupScreen from '../components/SetupScreen';
import ComposerScreen from '../components/ComposerScreen';
import SurEditorModal from '../components/SurEditorModal';

import { TAAL_OPTIONS } from '../sargam/constants';
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

const DEFAULT_SA = 'C#';
const DEFAULT_TEMPO = 90;

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

const Home: React.FC = () => {
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
  const [playbackCursor, setPlaybackCursor] = useState<SelectedCell | null>(null);

  const synthRef = useRef<Tone.Synth | null>(null);
  const tablaPlayersRef = useRef<any>(null);
  const [savedItems, setSavedItems] = useState<SavedComposition[]>([]);
  const [currentSaveId, setCurrentSaveId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>('Untitled Composition');

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
    const row = selectedSection?.rows[selectedCell.row];
    if (!row) return;

    if (selectedCell.slot > 0) {
      setSelectedCell((prev) => ({ ...prev, slot: prev.slot - 1 }));
      return;
    }

    if (selectedCell.beat > 0) {
      const prevBeat = row[selectedCell.beat - 1];
      setSelectedCell((prev) => ({
        ...prev,
        beat: prev.beat - 1,
        slot: Math.max(0, prevBeat.layout - 1),
      }));
    }
  }

  function goToNextSlot() {
    const row = selectedSection?.rows[selectedCell.row];
    if (!row) return;

    const beat = row[selectedCell.beat];
    if (!beat) return;

    if (selectedCell.slot < beat.layout - 1) {
      setSelectedCell((prev) => ({ ...prev, slot: prev.slot + 1 }));
      return;
    }

    if (selectedCell.beat < row.length - 1) {
      setSelectedCell((prev) => ({
        ...prev,
        beat: prev.beat + 1,
        slot: 0,
      }));
    }
  }

  function duplicatePreviousSlot() {
    const row = selectedSection?.rows[selectedCell.row];
    if (!row) return;

    let prevSlot: Slot | null = null;

    if (selectedCell.slot > 0) {
      prevSlot = row[selectedCell.beat]?.slots[selectedCell.slot - 1] || null;
    } else if (selectedCell.beat > 0) {
      const prevBeat = row[selectedCell.beat - 1];
      prevSlot = prevBeat?.slots[prevBeat.slots.length - 1] || null;
    }

    if (!prevSlot) return;

    setSelectedSlot({
      mode: prevSlot.mode,
      swara: prevSlot.swara,
      octave: prevSlot.octave,
      variant: prevSlot.variant,
    });
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

  async function playAll() {
    await Tone.start();
    setPlaying(true);
    setPlaybackCursor(null);

    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;

    let currentTime = 0;
    let lastPlayableToken: { swara: string; variant: Variant; octave: -1 | 0 | 1 } | null = null;

    sections.forEach((section) => {
      const currentTaal = TAAL_OPTIONS[section.taalId];
      const sectionTempo = section.tempo ?? DEFAULT_TEMPO;
      const beatDuration = 60 / sectionTempo;

      section.rows.forEach((row, rowIndex) => {
        row.forEach((beat, beatIndex) => {
          if (currentTaal.hasTabla) {
            const bol = currentTaal.bols[beatIndex] || '';
            Tone.Transport.schedule((tTime) => {
              const players = tablaPlayersRef.current;
              if (!players) return;
              pickTablaPlayer(players, bol).start(tTime);
            }, currentTime);
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

    Tone.Transport.start();
  }

  function stopAll() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setPlaying(false);
    setPlaybackCursor(null);
  }

  async function exportAudio() {
    try {
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
      <div style={{ display: 'grid', gap: 12 }}>
        {sections.map((section, sectionIndex) => {
          const taal = TAAL_OPTIONS[section.taalId];

          return (
            <IonCard key={section.id} style={{ borderRadius: 18, margin: 0 }}>
              <IonCardContent style={{ padding: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {section.name || `Section ${sectionIndex + 1}`}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: '#666',
                      lineHeight: 1.2,
                    }}
                  >
                    {taal.name}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 8 }}>
                  {section.rows.map((row, rowIndex) => (
                    <div key={rowIndex}>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 4,
                        }}
                      >
                        {row.map((beat, beatIndex) => (
                          <div
                            key={beatIndex}
                            style={{
                              width: 36,
                              borderRadius: 8,
                              border: '1px solid rgba(0,0,0,0.07)',
                              padding: '4px 2px',
                              background: '#fff',
                              boxSizing: 'border-box',
                            }}
                          >
                            <div
                              style={{
                                textAlign: 'center',
                                fontSize: 8,
                                fontWeight: 700,
                                marginBottom: 3,
                                color: '#666',
                                minHeight: 9,
                                lineHeight: 1,
                              }}
                            >
                              {section.taalId !== 'none' ? taal.markers[beatIndex + 1] || '' : ''}
                            </div>

                            <div style={{ display: 'grid', gap: 3 }}>
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
                                      borderRadius: 6,
                                      minHeight: 18,
                                      padding: '2px 1px',
                                      textAlign: 'center',
                                      fontWeight: isPlayingSlot ? 700 : 600,
                                      fontSize: 8,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      border: isPlayingSlot
                                        ? '2px solid var(--ion-color-primary)'
                                        : '1px solid rgba(56,128,255,0.22)',
                                      background: isPlayingSlot
                                        ? '#165DFF'
                                        : 'rgba(56,128,255,0.03)',
                                      color: isPlayingSlot ? '#fff' : '#555',
                                      transform: isPlayingSlot ? 'scale(1.05)' : 'scale(1)',
                                      boxShadow: isPlayingSlot
                                        ? '0 0 0 2px rgba(56,128,255,0.18)'
                                        : 'none',
                                      transition: 'all 0.12s ease',
                                      lineHeight: 1,
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {buildSlotToken(slot) || '—'}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 56,
              padding: '0 12px',
            }}
          >
            {(step === 'compose' || step === 'review') && (
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <IonButton
                  fill="clear"
                  size="small"
                  onClick={() => setStep(step === 'compose' ? 'setup' : 'compose')}
                >
                  <IonIcon slot="start" icon={chevronBack} />
                  Back
                </IonButton>
              </div>
            )}

            <div style={{ fontSize: 18, fontWeight: 700 }}>Sargam Composer</div>

            <div
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              <IonBadge color="light">Sa {sa}</IonBadge>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div style={{ padding: 12, maxWidth: 760, margin: '0 auto' }}>
          {step === 'setup' && (
            <SetupScreen
              sa={sa}
              sections={sections}
              onSetSa={setSa}
              onAddSection={addSection}
              onRemoveSection={removeSection}
            />
          )}

          {step === 'setup' && savedItems.length > 0 && (
            <IonCard style={{ marginTop: 12, borderRadius: 18 }}>
              <IonCardContent>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
                  Saved Compositions
                </div>

                <div style={{ display: 'grid', gap: 10 }}>
                  {savedItems.map((item) => (
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
                        <IonButton size="small" fill="outline" onClick={() => handleLoad(item)}>
                          Open
                        </IonButton>
                        <IonButton size="small" fill="outline" color="danger" onClick={() => handleDeleteSaved(item.id)}>
                          Delete
                        </IonButton>
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
            />
          )}

          {step === 'review' && renderReviewScreen()}
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          {step === 'setup' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '8px 12px',
              }}
            >
              <IonButton fill="outline" color="danger" onClick={resetAllData}>
                Clear
              </IonButton>

              <IonButton
                onClick={() => {
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
              >
                Continue
              </IonButton>
            </div>
          )}

          {step === 'compose' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 12,
                padding: '8px 12px',
                flexWrap: 'wrap',
              }}
            >
              <IonButton fill="outline" onClick={handleSave}>
                Save
              </IonButton>

              <IonButton onClick={() => setStep('review')}>
                Continue
              </IonButton>
            </div>
          )}

          {step === 'review' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                flexWrap: 'wrap',
              }}
            >
              <IonButton fill="outline" onClick={handleSave}>
                Save
              </IonButton>

              <IonButton onClick={playAll} disabled={playing}>
                <IonIcon slot="start" icon={play} />
                Play
              </IonButton>

              <IonButton fill="outline" onClick={stopAll}>
                <IonIcon slot="start" icon={stop} />
                Stop
              </IonButton>

              <IonButton fill="outline" onClick={exportAudio}>
                Export
              </IonButton>
            </div>
          )}
        </IonToolbar>
      </IonFooter>

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
      />
    </IonPage>
  );
};

export default Home;