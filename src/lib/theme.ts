// Design tokens ported from confessed-web (inline CSS values).
export const colors = {
  bg: '#080f1a',
  card: '#0b1929',
  gold: '#C9A94A',
  goldDim: 'rgba(201,169,74,0.45)',
  goldBorder: 'rgba(201,169,74,0.3)',
  cream: '#f0ece0',
  muted: 'rgba(240,236,224,0.55)',
  faint: 'rgba(240,236,224,0.35)',
  border: 'rgba(255,255,255,0.08)',
  borderSoft: 'rgba(255,255,255,0.05)',
  green: '#81c784',
  red: '#e57373',
}

export const fonts = {
  serif: 'EBGaramond_400Regular',
  serifItalic: 'EBGaramond_400Regular_Italic',
  sans: 'Barlow_400Regular',
  sansMedium: 'Barlow_500Medium',
  sansSemi: 'Barlow_600SemiBold',
  sansBold: 'Barlow_700Bold',
}

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.confessed.faith'
export const SITE_URL = 'https://confessed.faith'
export const CONTRIBUTE_URL = 'https://contribute.confessed.faith'
