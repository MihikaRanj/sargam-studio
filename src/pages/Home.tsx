import React from 'react';
import {
    IonButton,
    IonContent,
    IonPage,
} from '@ionic/react';

import { pageBackground, pageContainer, glassCard } from '../theme/siteStyles';

import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const features = [
    ['Write Sargam', 'Create melodies with Sa Re Ga Ma Pa Dha Ni using simple notation controls.'],
    ['Use Taal & Laya', 'Practice Ekgun, Dugun, Tigun, and Chaugun inside rhythmic cycles.'],
    ['Hear Playback', 'Listen to your composition directly in the browser as you build it.'],
    ['Save & Export', 'Save compositions and export notation for practice or sharing.'],
];

const Home: React.FC = () => {
    return (
        <IonPage>
            <SiteHeader showHome={false} showHelp={true} />

            <IonContent fullscreen>
                <div style={pageBackground}>
                    <div style={pageContainer(1120)}>
                        <section
                            style={{
                                display: 'grid',
                                gridTemplateColumns: window.innerWidth < 850 ? '1fr' : '1.15fr 0.85fr',
                                gap: 34,
                                alignItems: 'center',
                                marginBottom: 34,
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        display: 'inline-block',
                                        padding: '7px 12px',
                                        borderRadius: 999,
                                        background: '#fff3c4',
                                        color: '#92400e',
                                        fontWeight: 800,
                                        fontSize: 13,
                                        marginBottom: 14,
                                    }}
                                >
                                    Web-based Hindustani notation tool
                                </div>

                                <h1
                                    style={{
                                        fontSize: window.innerWidth < 600 ? 36 : 44,
                                        lineHeight: 1.05,
                                        fontWeight: 950,
                                        color: '#1f2937',
                                        margin: '0 0 16px',
                                    }}
                                >
                                    Compose Hindustani Sargam Online
                                </h1>

                                <p
                                    style={{
                                        fontSize: 18,
                                        lineHeight: 1.5,
                                        color: '#64748b',
                                        maxWidth: 680,
                                        margin: '0 0 24px',
                                    }}
                                >
                                    Write swaras, organize phrases into taal cycles, hear playback, and export your
                                    notation for practice.
                                </p>

                                <div
                                    style={{
                                        display: 'flex',
                                        gap: 16,
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        marginTop: 8,
                                    }}
                                >
                                    <IonButton
                                        size="large"
                                        routerLink="/composer?start=setup"
                                        style={{
                                            '--border-radius': '16px',
                                            '--box-shadow': '0 12px 24px rgba(37, 99, 235, 0.28)',
                                            '--padding-start': '28px',
                                            '--padding-end': '28px',
                                            minHeight: '58px',
                                            fontWeight: 900,
                                            letterSpacing: '0.4px',
                                        }}
                                    >
                                        Start Composing
                                    </IonButton>

                                    <IonButton
                                        size="large"
                                        fill="outline"
                                        color="primary"
                                        routerLink="/composer?demo=bageshree"
                                        style={{
                                            '--border-radius': '16px',
                                            '--padding-start': '24px',
                                            '--padding-end': '24px',
                                            minHeight: '58px',
                                            fontWeight: 800,
                                            opacity: 0.95,
                                        }}
                                    >
                                        View Sample
                                    </IonButton>

                                    <IonButton
                                        fill="clear"
                                        routerLink="/help"
                                        style={{
                                            fontWeight: 700,
                                            fontSize: 16,
                                            textTransform: 'none',
                                            '--color': '#475569',
                                        }}
                                    >
                                        Learn how it works →
                                    </IonButton>
                                </div>
                            </div>

                            <div
                                style={{
                                    position: 'relative',
                                    borderRadius: 28,
                                    overflow: 'hidden',
                                    minHeight: 340,
                                    backgroundImage:
                                        "linear-gradient(135deg, rgba(15,23,42,0.15), rgba(15,23,42,0.55)), url('/assets/indian-music-bg.jpg')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    boxShadow: '0 24px 60px rgba(31,41,55,0.22)',
                                    border: '1px solid rgba(120, 53, 15, 0.14)',
                                    transform: 'translateY(0)',
                                    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 30px 70px rgba(31,41,55,0.28)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 24px 60px rgba(31,41,55,0.22)';
                                }}
                            >
                            </div>
                        </section>

                        <section
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                                gap: 16,
                            }}
                        >
                            {features.map(([title, desc]) => (
                                <div
                                    key={title}
                                    style={{
                                        background: 'rgba(255,255,255,0.92)',
                                        border: '1px solid rgba(120, 53, 15, 0.12)',
                                        borderRadius: 22,
                                        padding: 22,
                                        boxShadow: '0 10px 28px rgba(31,41,55,0.08)',
                                    }}
                                >
                                    <h2
                                        style={{
                                            margin: '0 0 8px',
                                            color: '#1f2937',
                                            fontSize: 22,
                                            fontWeight: 850,
                                        }}
                                    >
                                        {title}
                                    </h2>
                                    <p style={{ color: '#64748b', margin: 0, lineHeight: 1.45, fontSize: 15 }}>
                                        {desc}
                                    </p>
                                </div>
                            ))}
                        </section>
                    </div>
                    <SiteFooter />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Home;