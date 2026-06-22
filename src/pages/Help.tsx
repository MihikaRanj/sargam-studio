import React from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonButton,
} from '@ionic/react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { playCircleOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
const cardStyle: React.CSSProperties = {
  borderRadius: 24,
  marginBottom: 18,
  boxShadow: '0 10px 28px rgba(31,41,55,0.08)',
};

const sectionTitle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 950,
  color: '#1f2937',
  marginBottom: 8,
};

const muted: React.CSSProperties = {
  color: '#64748b',
  fontSize: 16,
  lineHeight: 1.6,
};

const screenshotBox: React.CSSProperties = {
  marginTop: 14,
  borderRadius: 18,
  border: '1px dashed rgba(37,99,235,0.35)',
  background: '#f8fafc',
  padding: 18,
  color: '#64748b',
  fontWeight: 700,
  textAlign: 'center',
};

const videoWrap: React.CSSProperties = {
  position: 'relative',
  paddingBottom: '56.25%',
  height: 0,
  overflow: 'hidden',
  marginTop: 24,
  borderRadius: 18,
  boxShadow: '0 10px 28px rgba(31,41,55,0.12)',
};

const Help: React.FC = () => {
  return (
    <IonPage>
      <SiteHeader showHome={true} showHelp={false} />

      <IonContent fullscreen>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '28px 18px 50px' }}>
          <div style={{ textAlign: 'center', margin: '20px 0 28px' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '8px 14px',
                borderRadius: 999,
                background: '#fff3c4',
                color: '#92400e',
                fontWeight: 900,
                marginBottom: 14,
              }}
            >
              Help Guide
            </div>

            <h1 style={{ fontSize: 44, margin: 0, fontWeight: 950, color: '#1f2937' }}>
              How to Use Sargam Studio
            </h1>

            <p style={{ ...muted, maxWidth: 720, margin: '12px auto 0' }}>
              Learn how to create Hindustani sargam compositions, edit swaras,
              use taal and laya, preview playback, save your work, and export audio.
            </p>

            {/* <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <IonButton routerLink="/composer?start=setup">View Demo Video</IonButton>
              <IonButton routerLink="/composer?start=setup">Start Composing</IonButton>
              <IonButton fill="outline" routerLink="/composer?demo=bageshree">
                View Sample
              </IonButton>
            </div> */}

            <div
              style={{
                marginTop: 20,
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <IonButton routerLink="/help#demo-video">
                <IonIcon slot="start" icon={playCircleOutline} />
                View Demo Video
              </IonButton>

              <IonButton routerLink="/composer?start=setup">
                Start Composing
              </IonButton>

              <IonButton fill="outline" routerLink="/composer?demo=bageshree">
                View Sample
              </IonButton>
            </div>

            <div id="demo-video" style={videoWrap}>
              <iframe
                src="https://www.youtube.com/embed/MdX0Z5p3Kw8?cc_load_policy=1"
                title="Sargam Studio Demo Video"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <div style={sectionTitle}>1. What is Sargam Studio?</div>
              <p style={muted}>
                Sargam Studio is a web-based Hindustani music notation tool. You can write
                swaras, organize them into sections, set Sa, use taal cycles, hear playback,
                save compositions, and export a WAV audio file.
              </p>
              <div style={screenshotBox}>
                <img
                  src="/assets/help/home-page.png"
                  alt="Home page screenshot"
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    fontSize: 14,
                    color: '#64748b',
                    fontWeight: 700,
                  }}
                >
                  Home page with Start Composing and View Sample buttons.
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <div style={sectionTitle}>2. Basic Hindustani Concepts</div>
              <p style={muted}>
                Hindustani music uses seven main swaras:
              </p>
              <div style={{ fontSize: 28, fontWeight: 950, color: '#1d4ed8', margin: '10px 0' }}>
                Sa Re Ga Ma Pa Dha Ni
              </div>
              <p style={muted}>
                These are similar to Do Re Mi Fa Sol La Ti in Western solfege. In Indian music,
                <b> Sa</b> is the base note chosen by the singer or instrumentalist. Changing Sa changes the pitch of the whole
                composition. In Sargam Studio, you can choose the Sa scale and preview it.
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <div style={sectionTitle}>3. Swara Types and Octaves</div>
              <p> Swaras can have different forms: </p> <ul> <li><b>Shuddha</b> means natural swara.</li> <li><b>Komal</b> means flat or lowered swara.</li> <li><b>Teevra</b> means sharp or raised swara.</li> </ul> <p> In Hindustani music, Re, Ga, Dha, and Ni can be Komal. Ma can be Teevra. Sa and Pa stay fixed. </p>
              <p> A swara can be sung in different octaves: </p> <ul> <li><b>Mandra Saptak</b> means lower octave.</li> <li><b>Madhya Saptak</b> means middle octave.</li> <li><b>Taar Saptak</b> means higher octave.</li> </ul> <p> In the editor, Low means Mandra, Mid means Madhya, and High means Taar. </p>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <div style={sectionTitle}>4. Understanding Taal, Laya and Speed</div>
              <p style={muted}>
                Taal is the rhythmic cycle. Each beat is called a <b>matra</b>. Jhaptaal,
                for example, has 10 matras.
              </p>
              <ul style={muted}>
                <li><b>X</b>: Sam, the first and most important beat.</li>
                <li><b>2, 3</b>: Taali markers.</li>
                <li><b>0</b>: Khaali, the empty/waved section.</li>
                <li><b>Dhi, Na, Tin</b>: tabla bols used for playback.</li>
              </ul>

              <p style={muted}>
                Laya means tempo or speed. In classical music, common layas include:
              </p>
              <ul style={muted}>
                <li><b>Vilambit Laya</b>: slow tempo.</li> <li><b>Madhya Laya</b>: medium tempo.</li> <li><b>Drut Laya</b>: fast tempo.</li>
              </ul>

              <p style={muted}>
                Rhythmic subdivisions can also create:
              </p>
              <ul style={muted}>
                <li><b>Dugun</b>: two notes per beat.</li> <li><b>Tigun</b>: three notes per beat.</li> <li><b>Chaugun</b>: four notes per beat.</li>
              </ul>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <div style={sectionTitle}>5. Composition Setup</div>
              <ol style={muted}>
                <li>Choose your Scale / Sa.</li>
                <li>Add an Aalap section for free rhythm.</li>
                <li>Add a Taal section for beat-based composition.</li>
                <li>Open a saved composition or sample if you want to study an example.</li>
              </ol>
              <div style={screenshotBox}>
                <img
                  src="/assets/help/composition-setup.png"
                  alt="Composition Setup page screenshot"
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    fontSize: 14,
                    color: '#64748b',
                    fontWeight: 700,
                  }}
                >
                  Setup page showing Scale / Sa, Add Aalap, Add Taal, and Saved Compositions.
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <div style={sectionTitle}>6. Composer Workspace</div>
              <p style={muted}>
                The composer page is where you edit sections, rows, beats, cells, swaras,
                taal, and tempo. Click a beat or cell to select it. Press <b>Edit</b> to open
                the Sur Editor.
              </p>
              <ul style={muted}>
                <li><b>Preview Scale</b>: hear the selected Sa scale.</li>
                <li><b>Preview Taal</b>: hear the selected taal cycle.</li>
                <li><b>Play Row</b>: hear only the current row.</li>
                <li><b>Play Section</b>: hear the current section.</li>
              </ul>
              <div style={screenshotBox}>
                <img
                  src="/assets/help/composition-workspace.png"
                  alt="Composition Setup page screenshot"
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    fontSize: 14,
                    color: '#64748b',
                    fontWeight: 700,
                  }}
                >
                  Composer workspace with Section Controls, Row Management, and Beat Grid.
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <div style={sectionTitle}>7. Sur Editor</div>
              <p style={muted}>
                The Sur Editor lets you edit the selected note. You can choose the rhythm,
                swara, octave, and swara type.
              </p>
              <ul style={muted}>
                <li><b>Ekgun</b>: 1 note per beat.</li>
                <li><b>Dugun</b>: 2 notes per beat.</li>
                <li><b>Tigun</b>: 3 notes per beat.</li>
                <li><b>Chaugun</b>: 4 notes per beat.</li>
              </ul>
              <div style={screenshotBox}>
                <img
                  src="/assets/help/sur-editor.png"
                  alt="Composition Setup page screenshot"
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    fontSize: 14,
                    color: '#64748b',
                    fontWeight: 700,
                  }}
                >
                  Sur Editor modal showing Rhythm/Laya, Note Type, Saptak, Swara Type, and Swara buttons.
                </div>
              </div>
            </IonCardContent>
          </IonCard>



          <IonCard style={cardStyle}>
            <IonCardContent>
              <div style={sectionTitle}>8. Review, Play, and Export</div>
              <p style={muted}>
                The review page shows your full composition. You can play the full piece,
                stop playback, restart from the beginning, save it, or export it as audio.
              </p>
              <div style={screenshotBox}>
                <img
                  src="/assets/help/review.png"
                  alt="Composition Setup page screenshot"
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    fontSize: 14,
                    color: '#64748b',
                    fontWeight: 700,
                  }}
                >
                  Review page showing full notation and Review & Export buttons.
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <div style={sectionTitle}>9. App Symbols</div>
              <ul style={muted}>
                <li><b>Sa Re Ga Ma Pa Dha Ni</b>: swaras</li>
                <li><b>_Ga, _Ni</b>: komal swaras</li>
                <li><b>Ma^</b>: teevra Ma, if used</li>
                <li><b>Sa'</b>: taar/high octave</li>
                <li><b>._Ni</b>: mandra/low octave notation style</li>
                <li><b>—</b>: empty position</li>
                <li><b>.</b>: rest/silence</li>
                <li><b>X, 0, 2, 3</b>: taal markers</li>
              </ul>
            </IonCardContent>
          </IonCard>

          <SiteFooter />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Help;