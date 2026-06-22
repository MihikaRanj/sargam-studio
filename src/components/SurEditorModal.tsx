import React from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  chevronBack,
  chevronForward,
  copyOutline,
  helpCircleOutline,
} from 'ionicons/icons';

import { SWARA_OPTIONS } from '../sargam/constants';
import { buildBeatToken, buildSlotToken } from '../sargam/notation';
import { Beat, SelectedCell, Slot, SlotMode, Swara, Variant } from '../sargam/types';
import { useHistory } from 'react-router-dom';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedCell: SelectedCell;
  selectedSectionTaalId: string;
  selectedBeat: Beat;
  selectedSlot: Slot;
  onPrevSlot: () => void;
  onNextSlot: () => void;
  onCopyPrev: () => void;
  onSetBeatLayout: (layout: 1 | 2 | 3 | 4) => void;
  onSetSelectedSlotIndex: (slotIndex: number) => void;
  onSetSelectedSlot: (updates: Partial<Slot>) => void;
  onPrevBeat: () => void;
  onNextBeat: () => void;
};

const sectionTitle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: '-0.03em',
  color: '#64748b',
  margin: '10px 0 6px',
  textTransform: 'uppercase',
};

const smallHint: React.CSSProperties = {
  fontSize: 12,
  color: '#64748b',
  marginTop: 4,
};

const rhythmGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 8,
};

const swaraGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 8,
};

const threeColumnGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 14,
  alignItems: 'start',
};

const buttonRow: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  flexWrap: 'nowrap',
};

const headerButtonStyle = {
  '--border-radius': '999px',
  fontWeight: 850,
  letterSpacing: '0.3px',
  textTransform: 'none',
} as React.CSSProperties;

const headerPrimaryButtonStyle = {
  '--border-radius': '999px',
  '--box-shadow': '0 8px 18px rgba(37,99,235,0.18)',
  fontWeight: 900,
  letterSpacing: '0.3px',
  textTransform: 'none',
} as React.CSSProperties;

const KOMAL_SWARAS = ['Re', 'Ga', 'Dha', 'Ni'];
const TEEVRA_SWARAS = ['Ma'];

function getValidVariantForSwara(
  swara: string,
  variant: Variant
): Variant {
  if (swara === 'Sa' || swara === 'Pa') return 'shuddha';

  if (variant === 'komal' && !KOMAL_SWARAS.includes(swara)) {
    return 'shuddha';
  }

  if (variant === 'teevra' && !TEEVRA_SWARAS.includes(swara)) {
    return 'shuddha';
  }

  return variant;
}

function canUseKomal(swara: string) {
  return KOMAL_SWARAS.includes(swara);
}

function canUseTeevra(swara: string) {
  return TEEVRA_SWARAS.includes(swara);
}

function optionButton(
  label: string,
  selected: boolean,
  onClick: () => void,
  subLabel?: string,
  minWidth = 76,
  disabled = false
) {
  return (
    <button
      key={label}
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{
        border: selected ? '2px solid #2563eb' : '1px solid rgba(120, 53, 15, 0.14)',
        borderRadius: 999,
        padding: subLabel ? '7px 14px' : '9px 16px',
        background: disabled
          ? '#f1f5f9'
          : selected
            ? '#eff6ff'
            : 'rgba(255,255,255,0.96)',
        color: disabled ? '#94a3b8' : selected ? '#1d4ed8' : '#1f2937',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.65 : 1,
        minWidth,
        minHeight: subLabel ? 44 : 38,
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 14,
        lineHeight: 1.12,
        boxShadow: selected ? '0 8px 18px rgba(37,99,235,0.14)' : '0 3px 10px rgba(31,41,55,0.04)',
        transition: 'all 0.15s ease',
      }}
    >
      <div>{label}</div>
      {subLabel && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: selected ? '#1d4ed8' : '#6b7280',
            marginTop: 1,
          }}
        >
          {subLabel}
        </div>
      )}
    </button>
  );
}

const SurEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedCell,
  selectedSectionTaalId,
  selectedBeat,
  selectedSlot,
  onPrevSlot,
  onNextSlot,
  onCopyPrev,
  onSetBeatLayout,
  onSetSelectedSlotIndex,
  onSetSelectedSlot,
  onPrevBeat,
  onNextBeat,
}) => {
  const noteLabel = selectedBeat.layout === 1 ? 'Note' : `Note ${selectedCell.slot + 1}`;

  const history = useHistory();

  function openHelp() {
    onClose();
    setTimeout(() => {
      history.push('/help');
    }, 0);
  }
  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={1}
      breakpoints={[0, 1]}
      handle={true}
      style={{
        '--width': '980px',
        '--max-width': '94vw',
        '--height': '82vh',
        '--border-radius': '24px',
      }}
    >
      <IonHeader>
        <IonToolbar
          style={{
            '--background': 'rgba(255,255,255,0.96)',
            '--border-width': '0',
            boxShadow: '0 8px 24px rgba(31,41,55,0.14)',
          }}
        >
          <IonButtons slot="start">
            <IonButton fill="outline" onClick={onPrevBeat} style={headerButtonStyle}>
              <IonIcon slot="start" icon={chevronBack} />
              Prev Beat
            </IonButton>
          </IonButtons>

          <IonTitle style={{ textAlign: 'center', fontWeight: 900 }}>
            Sur Editor
          </IonTitle>

          <IonButtons slot="end">
            <IonButton fill="outline" onClick={onNextBeat} style={headerButtonStyle}>
              Next Beat
              <IonIcon slot="end" icon={chevronForward} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} fullscreen>
        <div
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 12,
          }}
        >
          <div
            style={{
              border: '1px solid rgba(120, 53, 15, 0.12)',
              borderRadius: 16,
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.94)',
              marginBottom: 6,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>
                Row {selectedCell.row + 1} •{' '}
                {selectedSectionTaalId === 'none' ? (
                  <>
                    Aalap Cell {selectedCell.beat + 1} • {noteLabel}
                  </>
                ) : (
                  <>
                    Beat {selectedCell.beat + 1} ({['Ekgun', 'Dugun', 'Tigun', 'Chaugun'][selectedBeat.layout - 1]}) •{' '}
                    {selectedBeat.layout === 1
                      ? 'Note'
                      : `Note ${selectedCell.slot + 1} of ${selectedBeat.layout}`}
                  </>
                )}
              </div>

              <div style={{ fontSize: 24, fontWeight: 950, color: '#1f2937', lineHeight: 1 }}>
                {buildSlotToken(selectedSlot) || '—'}
              </div>
            </div>

            <div style={{ fontSize: 13, color: '#64748b', textAlign: 'right' }}>
              Beat notation
              <br />
              <b style={{ color: '#1f2937' }}>{buildBeatToken(selectedBeat)}</b>
            </div>
          </div>

          <div style={sectionTitle}>Rhythm / Laya</div>

          <div style={rhythmGrid}>
            {[
              [1, 'Ekgun', '1 note'],
              [2, 'Dugun', '2 notes'],
              [3, 'Tigun', '3 notes'],
              [4, 'Chaugun', '4 notes'],
            ].map(([value, title, desc]) =>
              optionButton(
                String(title),
                selectedBeat.layout === value,
                () => onSetBeatLayout(value as 1 | 2 | 3 | 4),
                String(desc),
                120
              )
            )}
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={sectionTitle}>Note Navigation</div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <IonButton
                size="small"
                fill="outline"
                onClick={onPrevSlot}
                style={{
                  ...headerButtonStyle,
                  minWidth: 42,
                  height: 34,
                }}
                title="Previous note"
              >
                <IonIcon slot="icon-only" icon={chevronBack} />
              </IonButton>

              {selectedBeat.slots.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSetSelectedSlotIndex(idx)}
                  style={{
                    border:
                      selectedCell.slot === idx
                        ? '2px solid #2563eb'
                        : '1px solid rgba(120, 53, 15, 0.14)',
                    borderRadius: 999,
                    padding: '7px 13px',
                    background: selectedCell.slot === idx ? '#eff6ff' : 'rgba(255,255,255,0.96)',
                    color: selectedCell.slot === idx ? '#1d4ed8' : '#1f2937',
                    fontWeight: 900,
                    fontSize: 13,
                    lineHeight: 1,
                    cursor: 'pointer',
                    boxShadow:
                      selectedCell.slot === idx
                        ? '0 8px 18px rgba(37,99,235,0.14)'
                        : '0 3px 10px rgba(31,41,55,0.04)',
                  }}
                >
                  {selectedBeat.layout === 1 ? 'Note' : `Note ${idx + 1}`}
                </button>
              ))}

              <IonButton
                size="small"
                fill="outline"
                onClick={onNextSlot}
                style={{
                  ...headerButtonStyle,
                  minWidth: 42,
                  height: 34,
                }}
                title="Next note"
              >
                <IonIcon slot="icon-only" icon={chevronForward} />
              </IonButton>
            </div>

            <div style={smallHint}>Use arrows or note buttons to move inside this beat.</div>
          </div>

          <div style={threeColumnGrid}>
            <div>
              <div style={sectionTitle}>Note Type</div>
              <div style={buttonRow}>
                {optionButton('Swara', selectedSlot.mode === 'note', () =>
                  onSetSelectedSlot({ mode: 'note' })
                )}
                {optionButton('Rest', selectedSlot.mode === 'rest', () =>
                  onSetSelectedSlot({ mode: 'rest' })
                )}
                {optionButton('Empty', selectedSlot.mode === 'empty', () =>
                  onSetSelectedSlot({ mode: 'empty' })
                )}
              </div>
              <div style={smallHint}>Choose whether this position plays, rests, or stays blank.</div>
            </div>

            {selectedSlot.mode === 'note' && (
              <>
                <div>
                  <div style={sectionTitle}>Saptak / Octave</div>
                  <div style={buttonRow}>
                    {optionButton('Mandra', selectedSlot.octave === -1, () =>
                      onSetSelectedSlot({ octave: -1 })
                    )}
                    {optionButton('Madhya', selectedSlot.octave === 0, () =>
                      onSetSelectedSlot({ octave: 0 })
                    )}
                    {optionButton('Taar', selectedSlot.octave === 1, () =>
                      onSetSelectedSlot({ octave: 1 })
                    )}
                  </div>
                  <div style={smallHint}>Mandra = low, Madhya = middle, Taar = high.</div>
                </div>

                <div>
                  <div style={sectionTitle}>Swara Type</div>
                  <div style={buttonRow}>
                    {optionButton('Shuddha', selectedSlot.variant === 'shuddha', () =>
                      onSetSelectedSlot({ variant: 'shuddha' as Variant })
                    )}

                    {optionButton(
                      'Komal',
                      selectedSlot.variant === 'komal',
                      () => onSetSelectedSlot({ variant: 'komal' as Variant }),
                      undefined,
                      76,
                      !canUseKomal(selectedSlot.swara)
                    )}

                    {optionButton(
                      'Teevra',
                      selectedSlot.variant === 'teevra',
                      () => onSetSelectedSlot({ variant: 'teevra' as Variant }),
                      undefined,
                      76,
                      !canUseTeevra(selectedSlot.swara)
                    )}
                  </div>
                  <div style={smallHint}>
                    Re, Ga, Dha, and Ni can be Komal. Ma can be Teevra. Sa and Pa stay fixed.
                  </div>
                </div>
              </>
            )}
          </div>

          {selectedSlot.mode === 'note' && (
            <>
              <div style={sectionTitle}>Swara</div>

              <div style={swaraGrid}>
                {SWARA_OPTIONS.map((sw) =>
                  optionButton(
                    sw,
                    selectedSlot.swara === sw,
                    () =>
                      onSetSelectedSlot({
                        swara: sw as Swara,
                        mode: 'note',
                        variant: getValidVariantForSwara(sw, selectedSlot.variant),
                      }),
                    undefined,
                    84
                  )
                )}
              </div>
            </>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 12,
              marginBottom: 0,
            }}
          >
            <IonButton onClick={onClose} style={headerPrimaryButtonStyle}>
              Done
            </IonButton>
          </div>


        </div>
      </IonContent>
    </IonModal>
  );
};

export default SurEditorModal;