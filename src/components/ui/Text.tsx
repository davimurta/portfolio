import React from 'react';

type TextSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type TextVariant = 'primary' | 'secondary' | 'tertiary' | 'link';
type TextAlign = 'left' | 'center' | 'right' | 'justify';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextFont = 'inter' | 'fraunces';

interface TextProps {
  children: React.ReactNode;
  size?: TextSize | number;
  variant?: TextVariant;
  align?: TextAlign;
  weight?: TextWeight;
  font?: TextFont;
  className?: string;
  style?: React.CSSProperties;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const sizeMap: Record<TextSize, string> = {
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '40px',
  '2xl': '80px',
  '3xl': '96px',
};

const lineHeightMap: Record<TextSize, number> = {
  sm: 1.5,
  md: 1.5,
  lg: 1.4,
  xl: 1.2,
  '2xl': 1,
  '3xl': 1,
};

const variantMap: Record<TextVariant, string> = {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  tertiary: 'var(--text-tertiary)',
  link: 'var(--accent)',
};

const weightMap: Record<TextWeight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const fontMap: Record<TextFont, string> = {
  inter: 'var(--font-inter)',
  fraunces: 'var(--font-fraunces)',
};

export const Text: React.FC<TextProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  align = 'left',
  weight = 'normal',
  font = 'inter',
  className = '',
  style: customStyle,
  as: Component = 'p',
}) => {
  const fontSize = typeof size === 'number' ? `${size}px` : sizeMap[size];
  const lineHeight = typeof size === 'number' ? 1.5 : lineHeightMap[size];
  const color = variantMap[variant];
  const fontWeight = weightMap[weight];
  const fontFamily = fontMap[font];

  const defaultStyle: React.CSSProperties = {
    fontSize,
    lineHeight,
    color,
    textAlign: align,
    fontWeight,
    fontFamily,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    ...(variant === 'link' && {
      borderBottom: '2px solid var(--accent)',
      display: 'inline-block',
    }),
  };

  const combinedStyle = { ...defaultStyle, ...customStyle };

  return (
    <Component style={combinedStyle} className={className}>
      {children}
    </Component>
  );
};

export default Text;
