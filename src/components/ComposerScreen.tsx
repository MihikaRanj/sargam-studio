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
    IonSegment,
    IonSegmentButton,
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
        <IonCard style={{ borderRadius: 18, margin: 0 }}>
            <IonCardContent style={{ paddingTop: 12 }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: 12,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            width: '100%',
                            maxWidth: 280,
                        }}
                    >
                        <IonButton size="small" fill="outline" onClick={onPrevSection}>
                            <IonIcon slot="icon-only" icon={chevronBack} />
                        </IonButton>

                        <div style={{ flex: 1, minWidth: 0, maxWidth: 160 }}>
                            <IonSegment
                                value={String(activeSectionId)}
                                onIonChange={(e) => onSetActiveSectionId(Number(e.detail.value))}
                                scrollable
                            >
                                {sections.map((section, idx) => (
                                    <IonSegmentButton
                                        key={section.id}
                                        value={String(section.id)}
                                        style={{ minWidth: 90 }}
                                    >
                                        <IonLabel>{section.name || `Section ${idx + 1}`}</IonLabel>
                                    </IonSegmentButton>
                                ))}
                            </IonSegment>
                        </div>

                        <IonButton size="small" fill="outline" onClick={onNextSection}>
                            <IonIcon slot="icon-only" icon={chevronForward} />
                        </IonButton>
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.15fr auto',
                        gap: 8,
                        alignItems: 'end',
                        marginBottom: 12,
                    }}
                >
                    <IonItem style={{ '--min-height': '50px' } as React.CSSProperties}>
                        <IonLabel position="stacked" style={{ fontSize: 11 }}>Name</IonLabel>
                        <IonInput
                            style={{ fontSize: 13 }}
                            value={activeSection.name}
                            onIonInput={(e) => onUpdateSectionName(activeSection.id, String(e.detail.value || ''))}
                        />
                    </IonItem>

                    <IonItem style={{ '--min-height': '50px' } as React.CSSProperties}>
                        <IonLabel position="stacked" style={{ fontSize: 11 }}>Taal</IonLabel>
                        <IonSelect
                            interface="popover"
                            style={{ fontSize: 13 }}
                            value={activeSection.taalId}
                            onIonChange={(e) => onUpdateSectionTaal(activeSection.id, e.detail.value as TaalId)}
                        >
                            {Object.values(TAAL_OPTIONS).map((option) => (
                                <IonSelectOption key={option.id} value={option.id}>
                                    {option.name}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>

                    <div style={{ width: 88 }}>
                        <div
                            style={{
                                fontSize: 11,
                                color: '#666',
                                textAlign: 'center',
                                marginBottom: 4,
                            }}
                        >
                            Tempo
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid rgba(0,0,0,0.12)',
                                borderRadius: 10,
                                overflow: 'hidden',
                                height: 34,
                                background: '#fff',
                            }}
                        >
                            <IonButton
                                fill="clear"
                                size="small"
                                style={{ margin: 0, height: 34, width: 24 }}
                                onClick={() => changeTempo(-1)}
                            >
                                <IonIcon slot="icon-only" icon={remove} />
                            </IonButton>

                            <div
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    fontSize: 13,
                                    lineHeight: '34px',
                                }}
                            >
                                {sectionTempo}
                            </div>

                            <IonButton
                                fill="clear"
                                size="small"
                                style={{ margin: 0, height: 34, width: 24 }}
                                onClick={() => changeTempo(1)}
                            >
                                <IonIcon slot="icon-only" icon={add} />
                            </IonButton>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                    <div
                        style={{
                            display: 'flex',
                            gap: 6,
                            overflowX: 'auto',
                            paddingBottom: 4,
                        }}
                    >
                        {activeSection.rows.map((_, idx) => (
                            <IonChip
                                key={idx}
                                color={idx === activeRowIndex ? 'primary' : 'medium'}
                                outline={idx !== activeRowIndex}
                                style={{
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    fontSize: 11,
                                    height: 28,
                                    minWidth: 64,
                                    padding: '0 6px',
                                    justifyContent: 'center',
                                }}
                                onClick={() => onSetActiveRowIndex(idx)}
                            >
                                Row {idx + 1}
                            </IonChip>
                        ))}

                        <IonChip
                            color="success"
                            style={{
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                fontSize: 11,
                                height: 28,
                                minWidth: 82,
                                padding: '0 6px',
                                justifyContent: 'center',
                            }}
                            onClick={() => onAddRow(activeSection.id)}
                        >
                            <IonIcon icon={add} style={{ marginRight: 4 }} />
                            Add Row
                        </IonChip>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    {isFreeRow && (
                        <IonButton
                            size="small"
                            fill="outline"
                            style={{ fontSize: 10, minHeight: 30 }}
                            onClick={() => onAddCellToRow(activeSection.id, activeRowIndex)}
                        >
                            Add Cell
                        </IonButton>
                    )}

                    {isFreeRow && (
                        <IonButton
                            size="small"
                            fill="outline"
                            style={{ fontSize: 10, minHeight: 30 }}
                            onClick={() =>
                                onRemoveSelectedCellFromRow(activeSection.id, activeRowIndex, selectedCell.beat)
                            }
                        >
                            Remove Cell
                        </IonButton>
                    )}

                    <IonButton
                        size="small"
                        fill="outline"
                        style={{ fontSize: 10, minHeight: 30 }}
                        onClick={() => onClearRow(activeSection.id, activeRowIndex)}
                    >
                        Clear Row
                    </IonButton>

                    <IonButton
                        size="small"
                        fill="outline"
                        color="danger"
                        style={{ fontSize: 10, minHeight: 30 }}
                        onClick={() => onRemoveRow(activeSection.id, activeRowIndex)}
                        disabled={activeSection.rows.length === 1}
                    >
                        Delete Row
                    </IonButton>
                </div>

                <div style={{ overflowX: 'auto', paddingBottom: 6 }}>
                    <div
                        style={{
                            display: 'flex',
                            gap: 10,
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
                                    style={{
                                        minWidth: 92,
                                        maxWidth: 92,
                                        borderRadius: 16,
                                        padding: 8,
                                        border: isBeatSelected
                                            ? '2px solid var(--ion-color-primary)'
                                            : '1px solid rgba(0,0,0,0.08)',
                                        background: isBeatSelected ? 'rgba(56,128,255,0.12)' : '#fff',
                                        boxShadow: isBeatSelected
                                            ? '0 0 0 2px rgba(56,128,255,0.15)'
                                            : '0 3px 10px rgba(0,0,0,0.05)',
                                    }}
                                >
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 11,
                                            fontWeight: 700,
                                            marginBottom: 6,
                                            color: '#666',
                                        }}
                                    >
                                        {isFreeRow ? `C${beatNum}` : `B${beatNum}`}
                                    </div>

                                    {!isFreeRow && (
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 9,
                                                marginBottom: 6,
                                                color: 'var(--ion-color-medium)',
                                                minHeight: 24,
                                            }}
                                        >
                                            <div>{TAAL_OPTIONS[activeSection.taalId].markers[beatNum] || '.'}</div>
                                            <div>{TAAL_OPTIONS[activeSection.taalId].bols[beatIndex] || ''}</div>
                                        </div>
                                    )}

                                    <div style={{ display: 'grid', gap: 5 }}>
                                        {beat.slots.map((slot, slotIndex) => {
                                            const isSlotSelected =
                                                selectedCell.sectionId === activeSection.id &&
                                                selectedCell.row === activeRowIndex &&
                                                selectedCell.beat === beatIndex &&
                                                selectedCell.slot === slotIndex;

                                            return (
                                                <div key={slotIndex} style={{ display: 'grid', gap: 2 }}>
                                                    <IonButton
                                                        size="small"
                                                        fill={isSlotSelected ? 'solid' : 'outline'}
                                                        style={{ minHeight: 34, margin: 0, fontSize: 14 }}
                                                        onClick={() => {
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

                                                    <IonButton
                                                        size="small"
                                                        fill="clear"
                                                        style={{ margin: 0, minHeight: 18, fontSize: 11 }}
                                                        onClick={() => {
                                                            const cell = {
                                                                sectionId: activeSection.id,
                                                                row: activeRowIndex,
                                                                beat: beatIndex,
                                                                slot: slotIndex,
                                                            };
                                                            onSelectBeat(cell);
                                                            onOpenEditor(cell);
                                                        }}
                                                    >
                                                        <IonIcon slot="icon-only" icon={createOutline} />
                                                    </IonButton>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <IonAccordionGroup style={{ marginTop: 10 }}>
                    <IonAccordion value="text">
                        <IonItem slot="header">
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