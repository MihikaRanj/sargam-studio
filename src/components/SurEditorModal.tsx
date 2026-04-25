import React from 'react';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  chevronBack,
  chevronForward,
  copyOutline,
} from 'ionicons/icons';

import { SWARA_OPTIONS } from '../sargam/constants';
import { buildBeatToken, buildSlotToken } from '../sargam/notation';
import { Beat, SelectedCell, Slot, SlotMode, Swara, Variant } from '../sargam/types';

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
};

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
}) => {
  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={1}
      breakpoints={[0, 0.6, 0.85, 1]}
      handle={true}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sur Editor</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Done</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} fullscreen>
        <div style={{ padding: 12, paddingBottom: 140 }}>
          <IonText color="medium">
            <p style={{ marginTop: 0 }}>
              Row {selectedCell.row + 1} • {selectedSectionTaalId === 'none' ? 'Cell' : 'Beat'}{' '}
              {selectedCell.beat + 1} • Slot {selectedCell.slot + 1}
            </p>
          </IonText>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <IonButton size="small" fill="outline" onClick={onPrevSlot}>
              <IonIcon slot="start" icon={chevronBack} />
              Prev
            </IonButton>

            <IonButton size="small" fill="outline" onClick={onNextSlot}>
              Next
              <IonIcon slot="end" icon={chevronForward} />
            </IonButton>

            <IonButton size="small" fill="outline" onClick={onCopyPrev}>
              <IonIcon slot="start" icon={copyOutline} />
              Copy Prev
            </IonButton>
          </div>

          <IonText color="medium">
            <p style={{ fontSize: 12, marginBottom: 8 }}>Rhythm</p>
          </IonText>

          <IonItem>
            <IonLabel position="stacked">Subdivision</IonLabel>
            <IonSegment
              value={String(selectedBeat.layout)}
              onIonChange={(e) => onSetBeatLayout(Number(e.detail.value) as 1 | 2 | 3 | 4)}
            >
              <IonSegmentButton value="1">
                <IonLabel>1</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="2">
                <IonLabel>2</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="3">
                <IonLabel>3</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="4">
                <IonLabel>4</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonItem>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10, marginBottom: 14 }}>
            {selectedBeat.slots.map((_, idx) => (
              <IonButton
                key={idx}
                size="small"
                fill={selectedCell.slot === idx ? 'solid' : 'outline'}
                onClick={() => onSetSelectedSlotIndex(idx)}
              >
                {idx + 1}
              </IonButton>
            ))}
          </div>

          <IonText color="medium">
            <p style={{ fontSize: 12, marginBottom: 8 }}>Note Settings</p>
          </IonText>

          <IonItem>
            <IonLabel position="stacked">Mode</IonLabel>
            <IonSegment
              value={selectedSlot.mode}
              onIonChange={(e) => onSetSelectedSlot({ mode: e.detail.value as SlotMode })}
            >
              <IonSegmentButton value="note">
                <IonLabel>Note</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="rest">
                <IonLabel>Rest</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="empty">
                <IonLabel>Empty</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonItem>

          {selectedSlot.mode === 'note' && (
            <>
              <IonItem>
                <IonLabel position="stacked">Swara</IonLabel>
                <IonSelect
                  value={selectedSlot.swara}
                  onIonChange={(e) =>
                    onSetSelectedSlot({
                      swara: e.detail.value as Swara,
                      mode: 'note',
                    })
                  }
                >
                  {SWARA_OPTIONS.map((sw) => (
                    <IonSelectOption key={sw} value={sw}>
                      {sw}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Octave</IonLabel>
                <IonSegment
                  value={String(selectedSlot.octave)}
                  onIonChange={(e) =>
                    onSetSelectedSlot({
                      octave: Number(e.detail.value) as -1 | 0 | 1,
                    })
                  }
                >
                  <IonSegmentButton value="-1">
                    <IonLabel>Low</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="0">
                    <IonLabel>Mid</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="1">
                    <IonLabel>High</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Variant</IonLabel>
                <IonSegment
                  value={selectedSlot.variant}
                  onIonChange={(e) =>
                    onSetSelectedSlot({
                      variant: e.detail.value as Variant,
                    })
                  }
                >
                  <IonSegmentButton value="shuddha">
                    <IonLabel>Sh</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="komal">
                    <IonLabel>Ko</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="teevra">
                    <IonLabel>Te</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </IonItem>
            </>
          )}

          <IonCard style={{ marginTop: 14, borderRadius: 18 }}>
            <IonCardContent>
              <IonText color="medium">
                <p style={{ marginBottom: 6 }}>Current token</p>
              </IonText>
              <h2 style={{ marginTop: 0, marginBottom: 8 }}>{buildSlotToken(selectedSlot) || '—'}</h2>
              <IonText color="medium">
                <p style={{ marginBottom: 0 }}>Beat token: {buildBeatToken(selectedBeat)}</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default SurEditorModal;