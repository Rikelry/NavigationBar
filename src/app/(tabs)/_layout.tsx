import { Tabs } from 'expo-router';

import { ExpressiveTabBar } from '@/navigation/expressive-tab-bar';
import { useAppTheme } from '@/constants/theme';

export default function TabsLayout() {
  const colors = useAppTheme();

  return (
    <Tabs
      tabBar={() => <ExpressiveTabBar />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
