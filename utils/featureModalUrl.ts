// URL deep-link helpers for the Features modal (?fid=<feature id> / ?fcat=<category>).
// Uses window.history.replaceState instead of useSearchParams so the static
// homepage never takes a Suspense/CSR bailout.

import type { FeatureCategory } from '@/data/features';

const FEATURE_CATEGORY_VALUES: readonly string[] = [
  'ai_automation',
  'media_production',
  'bot_scraping',
  'frontend_ux',
  'devops_infra',
  'other',
];

export function isFeatureCategory(value: string): value is FeatureCategory {
  return FEATURE_CATEGORY_VALUES.includes(value);
}

/** Read fid/fcat deep-link params from the current URL (client-side only). */
export function readFeatureParams(): { featureId?: string; category?: FeatureCategory } {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const fid = params.get('fid');
  if (fid) return { featureId: fid };
  const fcat = params.get('fcat');
  if (fcat && isFeatureCategory(fcat)) return { category: fcat };
  return {};
}

/**
 * Write (or clear) fid/fcat in the URL without navigation, preserving all
 * other query params. Call with no args to remove both params (modal closed).
 */
export function writeFeatureParams(category?: FeatureCategory, featureId?: string): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  params.delete('fcat');
  params.delete('fid');
  if (featureId) params.set('fid', featureId);
  else if (category) params.set('fcat', category);
  const query = params.toString();
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
  );
}
