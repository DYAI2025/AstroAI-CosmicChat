import type { ReactNode } from 'react';

/**
 * Common props for all UI components
 */
export interface ComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

/**
 * Theme mode for styling
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Build mode for conditional rendering
 */
export type BuildMode = 'static' | 'server';

/**
 * Props for components that need theme awareness
 */
export interface ThemeAwareProps extends ComponentProps {
  theme?: ThemeMode;
}

/**
 * Props for components that need build mode awareness
 */
export interface BuildModeAwareProps extends ComponentProps {
  buildMode?: BuildMode;
}
