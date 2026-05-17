import React from 'react';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
} from '@ionic/react';

const cardStyle: React.CSSProperties = {
  borderRadius: 22,
  marginBottom: 16,
};

const Help: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Sargam Studio Help</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '18px 18px 40px' }}>
          <div style={{ textAlign: 'center', margin: '18px 0 24px' }}>
            <h1 style={{ fontSize: 34, marginBottom: 8, fontWeight: 900 }}>
              How to Use Sargam Studio
            </h1>
            <p style={{ color: '#6b7280', fontSize: 17 }}>
              Create, read, play, save, and export Hindustani sargam compositions.
            </p>
          </div>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <h2>What is Sargam Studio?</h2>
              <p>
                Sargam Studio is a web-based music composition tool for Hindustani classical-style
                vocal notation. It lets you write swaras beat by beat, organize them into sections,
                hear playback, and export your notation.
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <h2>Basic Hindustani Sargam</h2>
              <p>
                Hindustani classical music uses seven main swaras:
              </p>
              <p style={{ fontSize: 20, fontWeight: 800 }}>
                Sa Re Ga Ma Pa Dha Ni
              </p>
              <p>
                These are similar to Do Re Mi Fa Sol La Ti in Western solfege. In Indian music,
                <b> Sa </b> is the base note chosen by the singer or instrumentalist.
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <h2>Shuddha, Komal, and Teevra Swaras</h2>
              <p>
                Swaras can have different forms:
              </p>
              <ul>
                <li><b>Shuddha</b> means natural swara.</li>
                <li><b>Komal</b> means flat or lowered swara.</li>
                <li><b>Teevra</b> means sharp or raised swara.</li>
              </ul>
              <p>
                In Hindustani music, Re, Ga, Dha, and Ni can be Komal. Ma can be Teevra.
                Sa and Pa stay fixed.
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <h2>Octaves: Mandra, Madhya, and Taar</h2>
              <p>
                A swara can be sung in different octaves:
              </p>
              <ul>
                <li><b>Mandra Saptak</b> means lower octave.</li>
                <li><b>Madhya Saptak</b> means middle octave.</li>
                <li><b>Taar Saptak</b> means higher octave.</li>
              </ul>
              <p>
                In the editor, Low means Mandra, Mid means Madhya, and High means Taar.
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <h2>What is Taal?</h2>
              <p>
                Taal is the rhythmic cycle of the composition. Each taal has a fixed number of
                beats, called <b>matras</b>. For example, Jhaptaal has 10 matras.
              </p>
              <p>
                Important taal markers include:
              </p>
              <ul>
                <li><b>Sam / X</b>: the first and most important beat of the cycle.</li>
                <li><b>Taali</b>: clapped sections of the taal.</li>
                <li><b>Khaali / 0</b>: the empty or waved section of the taal.</li>
              </ul>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <h2>Laya and Speed</h2>
              <p>
                Laya means tempo or speed. In classical music, common layas include:
              </p>
              <ul>
                <li><b>Vilambit Laya</b>: slow tempo.</li>
                <li><b>Madhya Laya</b>: medium tempo.</li>
                <li><b>Drut Laya</b>: fast tempo.</li>
              </ul>
              <p>
                Rhythmic subdivisions can also create:
              </p>
              <ul>
                <li><b>Dugun</b>: two notes per beat.</li>
                <li><b>Tigun</b>: three notes per beat.</li>
                <li><b>Chaugun</b>: four notes per beat.</li>
              </ul>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <h2>How to Create a Composition</h2>
              <ol>
                <li>Choose your Sa scale.</li>
                <li>Add an Aalap or Taal section.</li>
                <li>Click a beat card to open the Sur Editor.</li>
                <li>Select the swara, octave, swara type, and rhythm subdivision.</li>
                <li>Use Play to hear your composition.</li>
                <li>Use Save or Export to keep your work.</li>
              </ol>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <h2>Aalap vs Taal Section</h2>
              <p>
                <b>Aalap</b> is more free-flowing and melodic. It is useful for exploring a raag
                slowly without a fixed rhythm.
              </p>
              <p>
                <b>Taal sections</b> follow a rhythmic cycle. They are useful for bandish,
                sargam patterns, taans, and rhythm-based practice.
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <h2>Sight Reading Sargam</h2>
              <p>
                Sargam sight reading means reading the written swaras and singing or playing them
                directly. Try reading left to right, following the taal beat numbers and markers.
              </p>
              <p>
                Start slowly, keep track of Sam, and gradually increase tempo after the melody
                becomes comfortable.
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard style={cardStyle}>
            <IonCardContent>
              <h2>Current App Symbols</h2>
              <ul>
                <li><b>Sa Re Ga Ma Pa Dha Ni</b>: swaras</li>
                <li><b>.</b>: rest or silence</li>
                <li><b>X</b>: Sam</li>
                <li><b>2, 3</b>: taali markers</li>
                <li><b>0</b>: khaali marker</li>
                <li><b>Low / Mid / High</b>: Mandra / Madhya / Taar octave</li>
                <li><b>Sh / Ko / Te</b>: Shuddha / Komal / Teevra</li>
              </ul>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Help;