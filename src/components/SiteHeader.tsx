import React, { useState } from 'react';
import {
    IonButton,
    IonHeader,
    IonIcon,
    IonToolbar,
} from '@ionic/react';

import {
    helpCircleOutline,
    homeOutline,
    mailOutline,
    musicalNotesOutline,
    menuOutline,
    closeOutline,
} from 'ionicons/icons';

import '../theme/SiteHeader.css';

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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <IonHeader>
            <IonToolbar className="site-toolbar">

                <div className="site-header-container">

                    {/* LEFT SIDE - DESKTOP */}
                    <div className="site-header-left desktop-nav">
                        {showHome && (
                            <IonButton
                                fill="clear"
                                routerLink="/home"
                                className="header-nav-button"
                            >
                                <IonIcon
                                    slot="start"
                                    icon={homeOutline}
                                />
                                Home
                            </IonButton>
                        )}
                    </div>


                    {/* BRAND */}
                    <div className="site-header-brand">

                        <div className="site-header-brand-name">
                            <IonIcon icon={musicalNotesOutline} />

                            <span>
                                Sargam Studio
                            </span>
                        </div>

                        <div className="site-header-subtitle">
                            Hindustani Music Composer
                        </div>

                    </div>


                    {/* RIGHT SIDE - DESKTOP */}
                    <div className="site-header-right desktop-nav">

                        {showHelp && (
                            <IonButton
                                fill="clear"
                                routerLink="/help"
                                className="header-nav-button"
                            >
                                <IonIcon
                                    slot="start"
                                    icon={helpCircleOutline}
                                />
                                Help
                            </IonButton>
                        )}

                        {showContact && (
                            <IonButton
                                fill="clear"
                                routerLink="/contact"
                                className="header-nav-button"
                            >
                                <IonIcon
                                    slot="start"
                                    icon={mailOutline}
                                />
                                Contact
                            </IonButton>
                        )}

                    </div>


                    {/* MOBILE HAMBURGER */}
                    <button
                        className="mobile-menu-button"
                        onClick={() =>
                            setMobileMenuOpen(!mobileMenuOpen)
                        }
                        aria-label={
                            mobileMenuOpen
                                ? 'Close navigation menu'
                                : 'Open navigation menu'
                        }
                    >
                        <IonIcon
                            icon={
                                mobileMenuOpen
                                    ? closeOutline
                                    : menuOutline
                            }
                        />
                    </button>

                </div>


                {/* MOBILE MENU */}
                {mobileMenuOpen && (

                    <div className="mobile-nav-menu">

                        {showHome && (
                            <IonButton
                                fill="clear"
                                routerLink="/home"
                                onClick={closeMenu}
                                className="mobile-nav-button"
                            >
                                <IonIcon
                                    slot="start"
                                    icon={homeOutline}
                                />
                                Home
                            </IonButton>
                        )}

                        {showHelp && (
                            <IonButton
                                fill="clear"
                                routerLink="/help"
                                onClick={closeMenu}
                                className="mobile-nav-button"
                            >
                                <IonIcon
                                    slot="start"
                                    icon={helpCircleOutline}
                                />
                                Help
                            </IonButton>
                        )}

                        {showContact && (
                            <IonButton
                                fill="clear"
                                routerLink="/contact"
                                onClick={closeMenu}
                                className="mobile-nav-button"
                            >
                                <IonIcon
                                    slot="start"
                                    icon={mailOutline}
                                />
                                Contact
                            </IonButton>
                        )}

                    </div>

                )}

            </IonToolbar>
        </IonHeader>
    );
};

export default SiteHeader;