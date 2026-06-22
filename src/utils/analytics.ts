declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export type AnalyticsEvent =
  | 'start_composing_click'
  | 'view_sample_click'
  | 'play_full_click'
  | 'restart_click'
  | 'stop_click'
  | 'export_wav_click'
  | 'save_click'
  | 'play_section_click'
  | 'play_row_click'
  | 'preview_scale_click'
  | 'preview_taal_click'
  | 'sur_editor_open'
  | 'sample_opened'
  | 'contact_form_sent';

export function trackEvent(
  eventName: AnalyticsEvent,
  params: Record<string, string | number | boolean | undefined> = {}
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    app_name: 'sargam_studio',
    ...params,
  });
}