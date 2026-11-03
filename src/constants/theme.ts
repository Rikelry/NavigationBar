import { Platform, useColorScheme } from 'react-native';
import { Color } from 'expo-router';

export type AppTheme = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  background: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
};

const lightTheme: AppTheme = {
  primary: '#6750A4',
  onPrimary: '#FFFFFF',

  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',

  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',

  background: '#FEF7FF',
  surface: '#FEF7FF',
  onSurface: '#1D1B20',

  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',

  outline: '#79747E',
};

const darkTheme: AppTheme = {
  primary: '#D0BCFF',
  onPrimary: '#381E72',

  primaryContainer: '#4F378B',
  onPrimaryContainer: '#EADDFF',

  secondaryContainer: '#4A4458',
  onSecondaryContainer: '#E8DEF8',

  background: '#141218',
  surface: '#141218',
  onSurface: '#E6E0E9',

  surfaceVariant: '#49454F',
  onSurfaceVariant: '#CAC4D0',

  outline: '#938F99',
};

export function useAppTheme(): AppTheme {
  const colorScheme = useColorScheme();

  const fallback =
    colorScheme === 'dark' ? darkTheme : lightTheme;

  if (Platform.OS !== 'android') {
    return fallback;
  }

  const dynamic = Color.android.dynamic;

  return {
    primary: (dynamic.primary ?? fallback.primary) as unknown as string,
    onPrimary: (dynamic.onPrimary ?? fallback.onPrimary) as unknown as string,

    primaryContainer: (dynamic.primaryContainer ?? fallback.primaryContainer) as unknown as string,
    onPrimaryContainer: (dynamic.onPrimaryContainer ?? fallback.onPrimaryContainer) as unknown as string,

    secondaryContainer: (dynamic.secondaryContainer ?? fallback.secondaryContainer) as unknown as string,
    onSecondaryContainer: (dynamic.onSecondaryContainer ?? fallback.onSecondaryContainer) as unknown as string,

    background: (dynamic.background ?? fallback.background) as unknown as string,
    surface: (dynamic.surface ?? fallback.surface) as unknown as string,
    onSurface: (dynamic.onSurface ?? fallback.onSurface) as unknown as string,

    surfaceVariant: (dynamic.surfaceVariant ?? fallback.surfaceVariant) as unknown as string,
    onSurfaceVariant: (dynamic.onSurfaceVariant ?? fallback.onSurfaceVariant) as unknown as string,

    outline: (dynamic.outline ?? fallback.outline) as unknown as string,
  };
}