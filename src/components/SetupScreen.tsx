import React from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { add, trash } from 'ionicons/icons';
import { SA_OPTIONS, TAAL_OPTIONS } from '../sargam/constants';
import { Section, TaalId } from '../sargam/types';

type SetupScreenProps = {
  sa: string;
  sections: Section[];
  onSetSa: (value: string) => void;
  onAddSection: (taalId: TaalId) => void;
  onRemoveSection: (sectionId: number) => void;
};

const SetupScreen: React.FC<SetupScreenProps> = ({
  sa,
  sections,
  onSetSa,
  onAddSection,
  onRemoveSection,
}) => {
  return (
    <>
      <IonCard style={{ borderRadius: 20, marginBottom: 14 }}>
        <IonCardContent>
          <IonItem lines="none">
            <IonLabel position="stacked">Scale (Sa)</IonLabel>
            <IonSelect value={sa} onIonChange={(e) => onSetSa(String(e.detail.value))}>
              {SA_OPTIONS.map((s) => (
                <IonSelectOption key={s} value={s}>
                  {s}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </IonCardContent>
      </IonCard>

      <IonCard style={{ borderRadius: 20 }}>
        <IonCardContent>
          <div style={{ marginBottom: 14, fontSize: 24, fontWeight: 700 }}>Sections</div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <IonButton size="small" onClick={() => onAddSection('none')}>
              <IonIcon slot="start" icon={add} />
              Aalap
            </IonButton>

            <IonButton size="small" fill="outline" onClick={() => onAddSection('jhaptaal')}>
              <IonIcon slot="start" icon={add} />
              Taal
            </IonButton>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {sections.map((section, index) => (
              <div
                key={section.id}
                style={{
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 14,
                  padding: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>
                    {section.name || `Section ${index + 1}`}
                  </div>
                  <div style={{ fontSize: 13, color: '#666' }}>
                    {TAAL_OPTIONS[section.taalId].name}
                  </div>
                </div>

                <IonButton
                  size="small"
                  fill="clear"
                  color="danger"
                  onClick={() => onRemoveSection(section.id)}
                  disabled={sections.length === 1}
                >
                  <IonIcon slot="icon-only" icon={trash} />
                </IonButton>
              </div>
            ))}
          </div>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default SetupScreen;