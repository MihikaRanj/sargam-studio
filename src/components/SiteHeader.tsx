import React from 'react';
import {
    IonButton,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import {
    helpCircleOutline,
    homeOutline,
    mailOutline,
    musicalNotesOutline,
} from 'ionicons/icons';

type SiteHeaderProps = {
    showHome?: boolean;
    showHelp?: boolean;
    showContact?: boolean;
};

const SiteHeader: React.FC<SiteHeaderProps> = ({
    showHome = true,
    showHelp = true,
    showContact = true,
}) => {
    return (
        <IonHeader>
            <IonToolbar
                style={{
                    '--background': 'rgba(255,255,255,0.92)',
                    '--min-height': '74px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 6px 24px rgba(15,23,42,0.10)',
                }}
            >
                <div
                    style={{
                        maxWidth: 1180,
                        margin: '0 auto',
                        padding: '0 18px',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        minHeight: 74,
                    }}
                >
                    <div style={{ display: 'flex', gap: 10 }}>
                        {showHome && (
                            <IonButton
                                fill="clear"
                                routerLink="/home"
                                style={{ '--border-radius': '999px', fontWeight: 800 }}
                            >
                                <IonIcon slot="start" icon={homeOutline} />
                                Home
                            </IonButton>
                        )}
                    </div>

                    <IonTitle style={{ padding: 0 }}>
                        <div style={{ textAlign: 'center', lineHeight: 1.1 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    fontSize: 22,
                                    fontWeight: 950,
                                    color: '#1f2937',
                                }}
                            >
                                <IonIcon icon={musicalNotesOutline} />
                                Sargam Studio
                            </div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>
                                Hindustani Music Composer
                            </div>
                        </div>
                    </IonTitle>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                        {showHelp && (
                            <IonButton
                                fill="clear"
                                routerLink="/help"
                                style={{ '--border-radius': '999px', fontWeight: 800 }}
                            >
                                <IonIcon slot="start" icon={helpCircleOutline} />
                                Help
                            </IonButton>
                        )}

                        {showContact && (
                            <IonButton
                                fill="clear"
                                routerLink="/contact"
                                style={{ '--border-radius': '999px', fontWeight: 800 }}
                            >
                                <IonIcon slot="start" icon={mailOutline} />
                                Contact
                            </IonButton>
                        )}
                    </div>
                </div>
            </IonToolbar>
        </IonHeader>
    );
};

export default SiteHeader;