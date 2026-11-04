import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/constants/theme';

export default function Home() {
  const colors = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colors.onSurface },
        ]}
      >
        Buscar
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.onSurfaceVariant },
        ]}
      >
        Material Community Icons + React Native
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
});
