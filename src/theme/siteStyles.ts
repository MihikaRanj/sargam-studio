import React from 'react';

export const pageBackground: React.CSSProperties = {
  minHeight: '100%',
  background:
    'radial-gradient(circle at top, rgba(255,255,255,0.65), rgba(255,255,255,0) 34%), linear-gradient(135deg, #fff7ed 0%, #fef3c7 45%, #fff7ed 100%)',
};

export const pageContainer = (
  maxWidth: number = 1120
): React.CSSProperties => ({
  maxWidth,
  margin: '0 auto',
  padding: '34px 22px 70px',
});

export const glassCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.92)',
  border: '1px solid rgba(120, 53, 15, 0.12)',
  borderRadius: 26,
  boxShadow: '0 14px 36px rgba(31,41,55,0.09)',
};

export const sectionLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 950,
  letterSpacing: '-0.03em',
  color: '#92400e',
  textTransform: 'uppercase',
};

export const helperText: React.CSSProperties = {
  color: '#64748b',
  lineHeight: 1.5,
};

export const pillButton: React.CSSProperties = {
  '--border-radius': '999px',
  fontWeight: 950,
  letterSpacing: '-0.03em',
  minHeight: '44px',
  transition: 'all 0.18s ease',
} as React.CSSProperties;

export const primaryPillButton: React.CSSProperties = {
  '--border-radius': '999px',
  '--box-shadow': '0 12px 24px rgba(37, 99, 235, 0.22)',
  fontWeight: 950,
  letterSpacing: '-0.03em',
  minHeight: '44px',
  transition: 'all 0.18s ease',
} as React.CSSProperties;