import React from 'react';

const SiteFooter: React.FC = () => {
  return (
    <footer
      style={{
        maxWidth: 1120,
        margin: '50px auto 0',
        padding: '24px 22px',
        color: '#64748b',
        fontSize: 13,
        textAlign: 'center',
      }}
    >
      <div style={{ fontWeight: 800, color: '#1f2937', marginBottom: 4 }}>
        2026 Sargam Studio
      </div>
      {/* <div>Built for Hindustani music learners, singers, and composers.</div> */}
    </footer>
  );
};

export default SiteFooter;