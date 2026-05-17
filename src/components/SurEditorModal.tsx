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
  fontWeight: 900,
  color: '#64748b',
  margin: '10px 0 6px',
  textTransform: 'uppercase',
  letterSpacing: 0.7,
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



function optionButton(
  label: string,
  selected: boolean,
  onClick: () => void,
  subLabel?: string,
  minWidth = 76
) {
  return (
    <button
      key={label}
      type="button"
      onClick={onClick}
      style={{
        border: selected ? '2px solid #2563eb' : '1px solid rgba(120, 53, 15, 0.14)',
        borderRadius: 12,
        padding: subLabel ? '6px 10px' : '8px 12px',
        background: selected ? '#eff6ff' : 'rgba(255,255,255,0.95)',
        color: selected ? '#1d4ed8' : '#1f2937',
        cursor: 'pointer',
        minWidth,
        minHeight: subLabel ? 44 : 38,
        textAlign: 'center',
        fontWeight: 800,
        fontSize: 14,
        lineHeight: 1.15,
        boxShadow: selected ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none',
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
        <IonToolbar>
          <IonTitle>Sur Editor</IonTitle>

          <IonButtons slot="end">
            <IonButton fill="clear" onClick={onPrevBeat} title="Move to the previous beat">
              <IonIcon slot="start" icon={chevronBack} />
              Prev Beat
            </IonButton>

            <IonButton fill="clear" onClick={onNextBeat} title="Move to the next beat">
              Next Beat
              <IonIcon slot="end" icon={chevronForward} />
            </IonButton>

            <IonButton
              fill="clear"
              onClick={onCopyPrev}
              title="Copy the previous note into the current note position"
            >
              <IonIcon slot="start" icon={copyOutline} />
              Copy Previous
            </IonButton>

            <IonButton fill="clear" onClick={openHelp} title="Open help page">
              <IonIcon icon={helpCircleOutline} />
            </IonButton>

            <IonButton onClick={onClose}>Done</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} fullscreen>
        <div style={{ padding: 18, paddingBottom: 42 }}>
          <div
            style={{
              border: '1px solid rgba(120, 53, 15, 0.12)',
              borderRadius: 16,
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.94)',
              marginBottom: 10,
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

            <div style={{ display: 'flex', gap: 8 }}>
              <IonButton size="small" fill="outline" onClick={onPrevSlot}>
                <IonIcon slot="start" icon={chevronBack} />
                Prev Note
              </IonButton>

              <IonButton size="small" fill="outline" onClick={onNextSlot}>
                Next Note
                <IonIcon slot="end" icon={chevronForward} />
              </IonButton>
            </div>

            <div style={smallHint}>
              Move within notes inside this beat.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {selectedBeat.slots.map((_, idx) => (
              <IonButton
                key={idx}
                size="small"
                fill={selectedCell.slot === idx ? 'solid' : 'outline'}
                onClick={() => onSetSelectedSlotIndex(idx)}
              >
                {selectedBeat.layout === 1 ? 'Note' : `Note ${idx + 1}`}
              </IonButton>
            ))}
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
                    {optionButton('Komal', selectedSlot.variant === 'komal', () =>
                      onSetSelectedSlot({ variant: 'komal' as Variant })
                    )}
                    {optionButton('Teevra', selectedSlot.variant === 'teevra', () =>
                      onSetSelectedSlot({ variant: 'teevra' as Variant })
                    )}
                  </div>
                  <div style={smallHint}>Komal lowers the swara. Teevra raises Ma.</div>
                </div>
              </>
            )}
          </div>

          {selectedSlot.mode === 'note' && (
            <>
              <div style={sectionTitle}>Swara</div>

              <div style={swaraGrid}>
                {SWARA_OPTIONS.map((sw) =>
                  optionButton(sw, selectedSlot.swara === sw, () =>
                    onSetSelectedSlot({
                      swara: sw as Swara,
                      mode: 'note',
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
              marginTop: 12,
              border: '1px solid rgba(120, 53, 15, 0.12)',
              borderRadius: 16,
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.94)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>
                Notation preview
              </div>
              <div style={{ fontSize: 22, fontWeight: 850, color: '#1f2937' }}>
                {buildSlotToken(selectedSlot) || '—'}
              </div>
            </div>

            <div style={{ fontSize: 13, color: '#64748b', textAlign: 'right' }}>
              Full beat
              <br />
              <b style={{ color: '#1f2937' }}>{buildBeatToken(selectedBeat)}</b>
            </div>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default SurEditorModal;