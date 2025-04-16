import {fontPixel} from '@utils/sizeNormalization';

export enum Color {
  Primary = '#f8d010',
  LightPrimary = 'rgba(248, 209, 16, 0.76)',
  Secondary = '#8f8810',
  Dark = '#1d3000',
  DarkBlack = '#212528',
  White = '#FFFFFF',
  TextPrimary = '#004a94',
  Gray = '#6B7280',
  LightGray = '#E5E7EB',
  Red = '#EF4444',
  Green = '#10B981',
}

export enum FontSize {
  xs = fontPixel(10),
  sm = fontPixel(12),
  base = fontPixel(14),
  lg = fontPixel(16),
  '1.5lg' = fontPixel(18),
  xl = fontPixel(20),
  '1.5xl' = fontPixel(22),
  '2xl' = fontPixel(24),
  '3xl' = fontPixel(28),
  '4xl' = fontPixel(32),
  '5xl' = fontPixel(36),
  '6xl' = fontPixel(40),
}

export enum Variant {
  Primary = 'primary',
  Secondary = 'secondary',
  Link = 'link',
  Transparent = 'transparent',
}

export enum TextVariant {
  XlHeading = 'xlHeading',
  Heading = 'heading',
  Subheading = 'subheading',
  Body = 'body',
  Caption = 'caption',
  Link = 'link',
}

export enum BorderRadius {
  XSmall = 4,
  Small = 8,
  XMedium = 12,
  Medium = 16,
  Large = 24,
  ExtraLarge = 32,
  Circle = 50,
}

export enum BottomSheetViewTypes {
  Close = 0,
  Profile = 1,
  Details = 2,
}
