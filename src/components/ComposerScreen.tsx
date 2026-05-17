import React from 'react';
import {
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonCard,
    IonCardContent,
    IonChip,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
} from '@ionic/react';
import {
    add,
    chevronBack,
    chevronForward,
    createOutline,
    remove,
} from 'ionicons/icons';
import { TAAL_OPTIONS } from '../sargam/constants';
import { buildSlotToken } from '../sargam/notation';
import { Beat, Section, SelectedCell, TaalId } from '../sargam/types';

type ComposerScreenProps = {
    sections: Section[];
    activeSection: Section;
    activeSectionId: number;
    activeRowIndex: number;
    currentRow: Beat[];
    isFreeRow: boolean;
    selectedCell: SelectedCell;
    activeSectionText: string;
    onSetActiveSectionId: (sectionId: number) => void;
    onPrevSection: () => void;
    onNextSection: () => void;
    onUpdateSectionName: (sectionId: number, name: string) => void;
    onUpdateSectionTaal: (sectionId: number, taalId: TaalId) => void;
    onUpdateSectionTempo: (sectionId: number, tempo: number) => void;
    onSetActiveRowIndex: (rowIndex: number) => void;
    onAddRow: (sectionId: number) => void;
    onAddCellToRow: (sectionId: number, rowIndex: number) => void;
    onRemoveSelectedCellFromRow: (sectionId: number, rowIndex: number, beatIndex: number) => void;
    onClearRow: (sectionId: number, rowIndex: number) => void;
    onRemoveRow: (sectionId: number, rowIndex: number) => void;
    onSelectBeat: (cell: SelectedCell) => void;
    onTextChange: (text: string) => void;
    onOpenEditor: (cell: SelectedCell) => void;
};

const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.7,
    color: '#92400e',
    textTransform: 'uppercase',
    marginBottom: 8,
};

const ComposerScreen: React.FC<ComposerScreenProps> = ({
    sections,
    activeSection,
    activeSectionId,
    activeRowIndex,
    currentRow,
    isFreeRow,
    selectedCell,
    activeSectionText,
    onSetActiveSectionId,
    onPrevSection,
    onNextSection,
    onUpdateSectionName,
    onUpdateSectionTaal,
    onUpdateSectionTempo,
    onSetActiveRowIndex,
    onAddRow,
    onAddCellToRow,
    onRemoveSelectedCellFromRow,
    onClearRow,
    onRemoveRow,
    onSelectBeat,
    onTextChange,
    onOpenEditor,
}) => {
    const sectionTempo = activeSection.tempo ?? 90;

    const changeTempo = (delta: number) => {
        const next = Math.max(40, Math.min(180, sectionTempo + delta));
        onUpdateSectionTempo(activeSection.id, next);
    };

    return (
        <IonCard style={{ borderRadius: 26, margin: 0 }}>
            <IonCardContent style={{ padding: 26 }}>
                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 32, fontWeight: 950, color: '#1f2937' }}>
                        Compose Your Sargam
                    </div>
                    <div style={{ color: '#64748b', fontSize: 15, marginTop: 4 }}>
                        Edit sections, rows, beats, swaras, taal, and tempo.
                    </div>
                </div>

                <div style={labelStyle}>Section Controls</div>

                <div
                    style={{
                        border: '1px solid rgba(120, 53, 15, 0.12)',
                        borderRadius: 22,
                        padding: 18,
                        background: 'rgba(255,255,255,0.88)',
                        marginBottom: 18,
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr auto',
                            gap: 12,
                            alignItems: 'center',
                            marginBottom: 16,
                        }}
                    >
                        <IonButton fill="outline" onClick={onPrevSection} style={{ '--border-radius': '14px' }}>
                            <IonIcon slot="icon-only" icon={chevronBack} />
                        </IonButton>

                        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', justifyContent: 'center' }}>
                            {sections.map((section, idx) => {
                                const selected = section.id === activeSectionId;
                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => onSetActiveSectionId(section.id)}
                                        style={{
                                            border: selected ? '2px solid #2563eb' : '1px solid rgba(120,53,15,0.14)',
                                            background: selected ? '#eff6ff' : '#fff',
                                            color: selected ? '#1d4ed8' : '#1f2937',
                                            borderRadius: 999,
                                            padding: '9px 16px',
                                            fontWeight: 850,
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {section.name || `Section ${idx + 1}`}
                                    </button>
                                );
                            })}
                        </div>

                        <IonButton fill="outline" onClick={onNextSection} style={{ '--border-radius': '14px' }}>
                            <IonIcon slot="icon-only" icon={chevronForward} />
                        </IonButton>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 130px',
                            gap: 12,
                            alignItems: 'end',
                        }}
                    >
                        <IonItem
                            lines="none"
                            style={{
                                '--background': '#fff',
                                border: '1px solid rgba(120,53,15,0.12)',
                                borderRadius: 16,
                            }}
                        >
                            <IonLabel position="stacked">Section Name</IonLabel>
                            <IonInput
                                value={activeSection.name}
                                onIonInput={(e) =>
                                    onUpdateSectionName(activeSection.id, String(e.detail.value || ''))
                                }
                            />
                        </IonItem>

                        <IonItem
                            lines="none"
                            style={{
                                '--background': '#fff',
                                border: '1px solid rgba(120,53,15,0.12)',
                                borderRadius: 16,
                            }}
                        >
                            <IonLabel position="stacked">Taal</IonLabel>
                            <IonSelect
                                interface="popover"
                                value={activeSection.taalId}
                                onIonChange={(e) =>
                                    onUpdateSectionTaal(activeSection.id, e.detail.value as TaalId)
                                }
                            >
                                {Object.values(TAAL_OPTIONS).map((option) => (
                                    <IonSelectOption key={option.id} value={option.id}>
                                        {option.name}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>

                        <div>
                            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 800 }}>
                                Tempo
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid rgba(120,53,15,0.14)',
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                    height: 42,
                                    background: '#fff',
                                }}
                            >
                                <IonButton fill="clear" size="small" onClick={() => changeTempo(-1)}>
                                    <IonIcon slot="icon-only" icon={remove} />
                                </IonButton>

                                <div style={{ flex: 1, textAlign: 'center', fontWeight: 900 }}>
                                    {sectionTempo}
                                </div>

                                <IonButton fill="clear" size="small" onClick={() => changeTempo(1)}>
                                    <IonIcon slot="icon-only" icon={add} />
                                </IonButton>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={labelStyle}>Row Management</div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 12,
                        flexWrap: 'wrap',
                        marginBottom: 18,
                    }}
                >
                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', flexWrap: 'wrap' }}>
                        {activeSection.rows.map((_, idx) => (
                            <IonChip
                                key={idx}
                                color={idx === activeRowIndex ? 'primary' : 'medium'}
                                outline={idx !== activeRowIndex}
                                style={{ cursor: 'pointer', fontWeight: 800 }}
                                onClick={() => onSetActiveRowIndex(idx)}
                            >
                                Row {idx + 1}
                            </IonChip>
                        ))}

                        <IonChip
                            color="success"
                            style={{ cursor: 'pointer', fontWeight: 800 }}
                            onClick={() => onAddRow(activeSection.id)}
                        >
                            <IonIcon icon={add} />
                            Add Row
                        </IonChip>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {isFreeRow && (
                            <>
                                <IonButton
                                    size="small"
                                    fill="outline"
                                    onClick={() => onAddCellToRow(activeSection.id, activeRowIndex)}
                                    style={{ '--border-radius': '999px', fontWeight: 800 }}
                                >
                                    Add Cell
                                </IonButton>

                                <IonButton
                                    size="small"
                                    fill="outline"
                                    onClick={() =>
                                        onRemoveSelectedCellFromRow(activeSection.id, activeRowIndex, selectedCell.beat)
                                    }
                                    style={{ '--border-radius': '999px', fontWeight: 800 }}
                                >
                                    Remove Cell
                                </IonButton>
                            </>
                        )}

                        <IonButton
                            size="small"
                            fill="outline"
                            onClick={() => onClearRow(activeSection.id, activeRowIndex)}
                            style={{ '--border-radius': '999px', fontWeight: 800 }}
                        >
                            Clear Row
                        </IonButton>

                        <IonButton
                            size="small"
                            fill="outline"
                            color="danger"
                            onClick={() => onRemoveRow(activeSection.id, activeRowIndex)}
                            disabled={activeSection.rows.length === 1}
                            style={{ '--border-radius': '999px', fontWeight: 800 }}
                        >
                            Delete Row
                        </IonButton>
                    </div>
                </div>

                <div style={labelStyle}>Beat Grid</div>

                <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
                    <div
                        style={{
                            display: 'flex',
                            gap: 12,
                            minWidth: 'max-content',
                            alignItems: 'stretch',
                        }}
                    >
                        {currentRow.map((beat, beatIndex) => {
                            const beatNum = beatIndex + 1;
                            const isBeatSelected =
                                selectedCell.sectionId === activeSection.id &&
                                selectedCell.row === activeRowIndex &&
                                selectedCell.beat === beatIndex;

                            return (
                                <div
                                    key={beatIndex}
                                    onClick={() =>
                                        onSelectBeat({
                                            sectionId: activeSection.id,
                                            row: activeRowIndex,
                                            beat: beatIndex,
                                            slot: 0,
                                        })
                                    }
                                    style={{
                                        minWidth: 118,
                                        maxWidth: 118,
                                        cursor: 'pointer',
                                        borderRadius: 20,
                                        padding: 12,
                                        border: isBeatSelected
                                            ? '2px solid #2563eb'
                                            : '1px solid rgba(15,23,42,0.08)',
                                        background: isBeatSelected ? '#eff6ff' : '#fff',
                                        boxShadow: isBeatSelected
                                            ? '0 10px 24px rgba(37,99,235,0.14)'
                                            : '0 6px 18px rgba(31,41,55,0.06)',
                                    }}
                                >
                                    <div style={{ fontWeight: 900, color: '#1f2937', textAlign: 'center' }}>
                                        {isFreeRow ? `Cell ${beatNum}` : `Beat ${beatNum}`}
                                    </div>

                                    {!isFreeRow && (
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 11,
                                                color: '#64748b',
                                                margin: '6px 0 10px',
                                                minHeight: 30,
                                            }}
                                        >
                                            <div>{TAAL_OPTIONS[activeSection.taalId].markers[beatNum] || '.'}</div>
                                            <div>{TAAL_OPTIONS[activeSection.taalId].bols[beatIndex] || ''}</div>
                                        </div>
                                    )}

                                    <div style={{ display: 'grid', gap: 7 }}>
                                        {beat.slots.map((slot, slotIndex) => {
                                            const isSlotSelected =
                                                selectedCell.sectionId === activeSection.id &&
                                                selectedCell.row === activeRowIndex &&
                                                selectedCell.beat === beatIndex &&
                                                selectedCell.slot === slotIndex;

                                            return (
                                                <IonButton
                                                    key={slotIndex}
                                                    size="small"
                                                    fill={isSlotSelected ? 'solid' : 'outline'}
                                                    style={{
                                                        minHeight: 34,
                                                        margin: 0,
                                                        fontWeight: 850,
                                                        '--border-radius': '12px',
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelectBeat({
                                                            sectionId: activeSection.id,
                                                            row: activeRowIndex,
                                                            beat: beatIndex,
                                                            slot: slotIndex,
                                                        });
                                                    }}
                                                >
                                                    {buildSlotToken(slot) || '—'}
                                                </IonButton>
                                            );
                                        })}
                                    </div>

                                    <IonButton
                                        size="small"
                                        fill="outline"
                                        style={{
                                            marginTop: 10,
                                            width: '100%',
                                            '--border-radius': '999px',
                                            fontSize: 11,
                                            fontWeight: 800,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const cell = {
                                                sectionId: activeSection.id,
                                                row: activeRowIndex,
                                                beat: beatIndex,
                                                slot: 0,
                                            };
                                            onSelectBeat(cell);
                                            onOpenEditor(cell);
                                        }}
                                    >
                                        <IonIcon slot="start" icon={createOutline} />
                                        Edit
                                    </IonButton>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <IonAccordionGroup style={{ marginTop: 14 }}>
                    <IonAccordion value="text">
                        <IonItem slot="header" lines="none">
                            <IonLabel>Text Notation Editor</IonLabel>
                        </IonItem>

                        <div slot="content" style={{ padding: 10 }}>
                            <IonItem>
                                <IonLabel position="stacked">Text Output</IonLabel>
                                <IonTextarea
                                    autoGrow
                                    value={activeSectionText}
                                    onIonInput={(e) => onTextChange(String(e.detail.value || ''))}
                                />
                            </IonItem>
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>
            </IonCardContent>
        </IonCard>
    );
};

export default ComposerScreen;