import React, { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonInput,
  IonPage,
  IonTextarea,
} from '@ionic/react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { trackEvent } from '../utils/analytics';

const pageStyle: React.CSSProperties = {
  minHeight: '100%',
  background:
    'linear-gradient(135deg, #fff7d6 0%, #ffffff 45%, #fff3c4 100%)',
};

const containerStyle: React.CSSProperties = {
  maxWidth: 760,
  margin: '0 auto',
  padding: '42px 18px',
};

const cardStyle: React.CSSProperties = {
  borderRadius: 26,
  boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
};

const fieldStyle: React.CSSProperties = {
  marginBottom: 18,
};

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const sendMessage = async () => {
    if (!name.trim() || !fromEmail.trim() || !subject.trim() || !message.trim()) {
      setStatus('Please fill out all fields.');
      return;
    }

    if (!emailRegex.test(fromEmail.trim())) {
      setStatus('Please enter a valid email address.');
      return;
    }

    setSending(true);
    setStatus('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: fromEmail, subject, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      trackEvent('contact_form_sent');
      setStatus('Thank you! Your message has been sent successfully.');
      setName('');
      setFromEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error(error);
      setStatus('Sorry, your message could not be sent. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <IonPage>
      <SiteHeader showContact={false} />

      <IonContent fullscreen>
        <div style={pageStyle}>
          <div style={containerStyle}>
            <IonCard style={cardStyle}>
              <IonCardContent style={{ padding: 28 }}>
                <h1 style={{ fontSize: 34, fontWeight: 900, marginBottom: 8, color: '#1f2937' }}>
                  Contact Sargam Studio
                </h1>

                <p style={{ color: '#64748b', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>
                  Questions, suggestions, bug reports, feedback or help with composing a bandish, geet or other Hindustani vocal piece are always welcome.
                </p>

                {status && (
                  <div
                    style={{
                      marginBottom: 24,
                      padding: 14,
                      borderRadius: 12,
                      background: status.startsWith('Thank you') ? '#ecfdf5' : '#fff7ed',
                      border: status.startsWith('Thank you')
                        ? '1px solid #10b981'
                        : '1px solid #fb923c',
                      color: status.startsWith('Thank you') ? '#065f46' : '#9a3412',
                      fontWeight: 700,
                    }}
                  >
                    {status}
                  </div>
                )}

                <div style={fieldStyle}>
                  <IonInput
                    label="Name"
                    labelPlacement="stacked"
                    fill="outline"
                    value={name}
                    onIonInput={(e) => {
                      setName(e.detail.value ?? '');
                      if (status) setStatus('');
                    }}
                  />
                </div>

                <div style={fieldStyle}>
                  <IonInput
                    label="Email"
                    type="email"
                    labelPlacement="stacked"
                    fill="outline"
                    value={fromEmail}
                    onIonInput={(e) => {
                      setFromEmail(e.detail.value ?? '');
                      if (status) setStatus('');
                    }}
                  />
                </div>

                <div style={fieldStyle}>
                  <IonInput
                    label="Subject"
                    labelPlacement="stacked"
                    fill="outline"
                    value={subject}
                    onIonInput={(e) => {
                      setSubject(e.detail.value ?? '');
                      if (status) setStatus('');
                    }}
                  />
                </div>

                <div style={fieldStyle}>
                  <IonTextarea
                    label="Message"
                    labelPlacement="stacked"
                    fill="outline"
                    autoGrow
                    value={message}
                    onIonInput={(e) => {
                      setMessage(e.detail.value ?? '');
                      if (status) setStatus('');
                    }}
                  />
                </div>

                <p
                  style={{
                    fontSize: 14,
                    color: '#64748b',
                    marginBottom: 12,
                    lineHeight: 1.5,
                  }}
                >
                  Need help creating a bandish or using Sargam Studio? Feel free to reach out and we'll do our best to assist.
                </p>
                <IonButton
                  expand="block"
                  disabled={sending}
                  onClick={sendMessage}
                  style={{ marginTop: 12, fontWeight: 800 }}
                >
                  {sending ? 'Sending...' : 'Send Feedback'}
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>

          <SiteFooter />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Contact;