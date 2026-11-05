import { Platform, useColorScheme } from 'react-native';
import { Color } from 'expo-router';

export type AppTheme = {
  primary: string;
  secondary: string;
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
  primary: '#593923',
  onPrimary: '#FFFFFF',
  secondary: '#755137',
  primaryContainer: '#F0DFCC',
  onPrimaryContainer: '#28180D',
  secondaryContainer: '#E9D8C5',
  onSecondaryContainer: '#29190F',
  background: '#F8F5F0',
  surface: '#F8F5F0',
  onSurface: '#211A15',
  surfaceVariant: '#EAE1D7',
  onSurfaceVariant: '#51463D',
  outline: '#817366',
};

const darkTheme: AppTheme = {
  primary: '#E6BE96',
  onPrimary: '#402713',
  secondary: '#D6AD84',
  primaryContainer: '#593923',
  onPrimaryContainer: '#F0DFCC',
  secondaryContainer: '#514032',
  onSecondaryContainer: '#F0DFCC',
  background: '#211A15',
  surface: '#211A15',
  onSurface: '#F0E7DE',
  surfaceVariant: '#51463D',
  onSurfaceVariant: '#D6C5B5',
  outline: '#A18F7D',
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
    primary: (fallback.primary ?? dynamic.primary) as unknown as string,
    secondary: (fallback.secondary ?? dynamic.secondary) as unknown as string,
    onPrimary: (fallback.onPrimary ?? dynamic.onPrimary) as unknown as string,

    primaryContainer: (fallback.primaryContainer ?? dynamic.primaryContainer) as unknown as string,
    onPrimaryContainer: (fallback.onPrimaryContainer ?? dynamic.onPrimaryContainer) as unknown as string,

    secondaryContainer: (fallback.secondaryContainer ?? dynamic.secondaryContainer) as unknown as string,
    onSecondaryContainer: (fallback.onSecondaryContainer ?? dynamic.onSecondaryContainer) as unknown as string,

    background: (fallback.background ?? dynamic.background) as unknown as string,
    surface: (fallback.surface ?? dynamic.surface) as unknown as string,
    onSurface: (fallback.onSurface ?? dynamic.onSurface) as unknown as string,

    surfaceVariant: (fallback.surfaceVariant ?? dynamic.surfaceVariant) as unknown as string,
    onSurfaceVariant: (fallback.onSurfaceVariant ?? dynamic.onSurfaceVariant) as unknown as string,

    outline: (fallback.outline ?? dynamic.outline) as unknown as string,
  };
}