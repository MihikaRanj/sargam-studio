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
import { add, musicalNotes, trash, optionsOutline } from 'ionicons/icons';
import { SA_OPTIONS, TAAL_OPTIONS } from '../sargam/constants';
import { Section, TaalId } from '../sargam/types';
import { play, stop } from 'ionicons/icons';
import '../theme/SetupScreen.css';

type SetupScreenProps = {
  sa: string;
  sections: Section[];
  onSetSa: (value: string) => void;
  onAddSection: (taalId: TaalId) => void;
  onRemoveSection: (sectionId: number) => void;
  onPreviewScale: () => void;
  previewingScale: boolean;
};

const SetupScreen: React.FC<SetupScreenProps> = ({
  sa,
  sections,
  onSetSa,
  onAddSection,
  onRemoveSection,
  onPreviewScale,
  previewingScale,
}) => {
  return (
    <>
      <IonCard
        style={{
          borderRadius: 24,
          marginBottom: 16,
          borderTop: '4px solid #f59e0b',
        }}
      >
        <IonCardContent style={{ padding: 22 }}>
          <div className="setup-header-layout">
            <div className="setup-header-info">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: '#fff3c4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#b45309',
                  fontSize: 24,
                }}
              >
                <IonIcon icon={musicalNotes} />
              </div>

              <div>
                <div style={{
                  fontSize: 22, fontWeight: 950,
                  letterSpacing: '-0.03em', color: '#1f2937'
                }}>
                  Create New Composition
                </div>
                <div style={{ color: '#64748b', fontSize: 14, marginTop: 3 }}>
                  Choose your Sa and organize your music into Aalap or Taal sections.
                </div>
              </div>
            </div>

            <div className="setup-scale-controls">
              <IonItem
                lines="none"
                className="setup-scale-select"
                style={{
                  '--background': 'transparent',
                  border: '1px solid rgba(120, 53, 15, 0.12)',
                  borderRadius: 18,
                }}
              >
                <IonLabel position="stacked">Scale / Sa</IonLabel>
                <IonSelect value={sa} onIonChange={(e) => onSetSa(String(e.detail.value))}>
                  {SA_OPTIONS.map((s) => (
                    <IonSelectOption key={s} value={s}>
                      {s}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonButton
                className="setup-preview-button"
                fill={previewingScale ? 'outline' : 'solid'}
                color={previewingScale ? 'danger' : 'primary'}
                onClick={onPreviewScale}
                style={{
                  '--border-radius': '999px',
                  fontWeight: 900,
                  minHeight: 42,
                  whiteSpace: 'nowrap',
                }}
              >
                <IonIcon slot="start" icon={previewingScale ? stop : play} />
                {previewingScale ? 'Stop Scale' : 'Preview Scale'}
              </IonButton>
            </div>
          </div>
        </IonCardContent>
      </IonCard>

      <IonCard
        style={{
          borderRadius: 24,
          borderTop: '4px solid #2563eb',
        }}
      >
        <IonCardContent style={{ padding: 22 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 16,
              alignItems: 'center',
              marginBottom: 18,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{
                fontSize: 24, fontWeight: 950,
                letterSpacing: '-0.03em', color: '#1f2937'
              }}>
                Composition Sections
              </div>
              <div style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                Add free-flowing Aalap or rhythm-based Taal sections.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <IonButton
                onClick={() => onAddSection('none')}
                style={{ '--border-radius': '14px', fontWeight: 800 }}
              >
                <IonIcon slot="start" icon={add} />
                Add Aalap Section
              </IonButton>

              <IonButton
                fill="outline"
                onClick={() => onAddSection('jhaptaal')}
                style={{ '--border-radius': '14px', fontWeight: 800 }}
              >
                <IonIcon slot="start" icon={add} />
                Add Taal Section
              </IonButton>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {sections.map((section, index) => {
              const taal = TAAL_OPTIONS[section.taalId];

              return (
                <div
                  key={section.id}
                  style={{
                    border: '1px solid rgba(120, 53, 15, 0.12)',
                    borderRadius: 20,
                    padding: 18,
                    background: 'rgba(255,255,255,0.86)',
                    boxShadow: '0 8px 22px rgba(31,41,55,0.06)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, color: '#92400e', fontWeight: 900 }}>
                        SECTION {index + 1}
                      </div>

                      <div
                        style={{
                          fontWeight: 950,
                          letterSpacing: '-0.03em',
                          fontSize: 20,
                          color: '#1f2937',
                          marginTop: 4,
                        }}
                      >
                        {section.name || `Section ${index + 1}`}
                      </div>

                      <div style={{ fontSize: 14, color: '#64748b', marginTop: 6 }}>
                        {taal.name}
                      </div>
                    </div>

                    <IonButton
                      size="small"
                      fill="clear"
                      color="danger"
                      onClick={() => onRemoveSection(section.id)}
                      disabled={sections.length === 1}
                      title={
                        sections.length === 1
                          ? 'At least one section is required'
                          : 'Remove this section'
                      }
                    >
                      <IonIcon slot="icon-only" icon={trash} />
                    </IonButton>
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      display: 'flex',
                      gap: 8,
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        padding: '6px 10px',
                        borderRadius: 999,
                        background: '#fff7ed',
                        color: '#92400e',
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {section.taalId === 'none' ? 'Aalap' : 'Taal'}
                    </span>

                    <span
                      style={{
                        padding: '6px 10px',
                        borderRadius: 999,
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      <IonIcon icon={optionsOutline} style={{ verticalAlign: 'middle' }} />{' '}
                      {section.taalId === 'none' ? 'Free rhythm' : 'Rhythmic cycle'}
                    </span>
                  </div>

                  <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.45, marginBottom: 0 }}>
                    {section.taalId === 'none'
                      ? 'Use this section for free-flowing melodic exploration before a fixed taal.'
                      : 'Use this section for beat-based sargam patterns, bandish practice, or taan ideas.'}
                  </p>
                </div>
              );
            })}
          </div>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default SetupScreen;