import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, useWindowDimensions, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming, } from 'react-native-reanimated';
import { useEffect } from 'react';

import { useAppTheme, type AppTheme } from '@/constants/theme';

const tabs = [
    {
        name: 'Início',
        path: '/',
        icon: 'home-outline',
        activeIcon: 'home',
    },
    {
        name: 'Buscar',
        path: '/search',
        icon: 'magnify',
        activeIcon: 'magnify',
    },
    {
        name: 'Agendas',
        path: '/favorites',
        icon: 'calendar-blank-outline',
        activeIcon: 'calendar-blank',
    },
    {
        name: 'Perfil',
        path: '/profile',
        icon: 'account-outline',
        activeIcon: 'account',
    },
] as const;

// --------------------------------------------------
// TAB ITEM
// Animação individual de cada destino
// --------------------------------------------------

type TabItemProps = {
    tab: (typeof tabs)[number];
    active: boolean;
    onPress: () => void;
    colors: AppTheme;
};

function TabItem({ tab, active, onPress, colors }: TabItemProps) {
    const progress = useSharedValue(active ? 1 : 0);

    useEffect(() => {
        progress.value = withSpring(active ? 1 : 0, {
            damping: 15,
            stiffness: 180,
            mass: 0.7,
        });
    }, [active]);

    // Animação do ícone
    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: 0.92 + progress.value * 0.12,
            },
        ],
    }));

    // Ícone inativo desaparece
    const inactiveIconStyle = useAnimatedStyle(() => ({
        opacity: 1 - progress.value,
        transform: [
            {
                scale: 1 - progress.value * 0.08,
            },
        ],
    }));

    // Ícone ativo aparece
    const activeIconStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [
            {
                scale: 0.85 + progress.value * 0.15,
            },
        ],
    }));

    // Animação do label
    const labelAnimatedStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [
            {
                translateY: (1 - progress.value) * 5,
            },
            {
                scale: 0.95 + progress.value * 0.05,
            },
        ],
    }));

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.name}
            style={styles.tab}
        >
            {/* Ícones com crossfade */}
            <Animated.View
                style={[styles.iconContainer, iconAnimatedStyle]}
            >
                <Animated.View
                    style={[styles.iconLayer, inactiveIconStyle]}
                >
                    <MaterialCommunityIcons
                        name={tab.icon}
                        size={24}
                        color={colors.onSurfaceVariant}
                    />
                </Animated.View>

                <Animated.View
                    style={[styles.iconLayer, activeIconStyle]}
                >
                    <MaterialCommunityIcons
                        name={tab.activeIcon}
                        size={24}
                        color={colors.onPrimaryContainer}
                    />
                </Animated.View>
            </Animated.View>

            {/* Label animado */}
            <Animated.Text
                style={[
                    styles.activeLabel,
                    { color: colors.onSurface }
                ]}
            >
                {tab.name}
            </Animated.Text>
        </Pressable>
    );
}

// --------------------------------------------------
// NAVIGATION BAR
// --------------------------------------------------


export function ExpressiveTabBar() {
    const router = useRouter();
    const colors = useAppTheme();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    const { width: screenWidth } = useWindowDimensions();

    const activeIndex = Math.max(
        0,
        tabs.findIndex((tab) => tab.path === pathname)
    );

    const tabWidth = (screenWidth - 24) / tabs.length;

    const indicatorCenter = useSharedValue(
        12 + activeIndex * tabWidth + tabWidth / 2
    );

    const indicatorWidth = useSharedValue(64);

    const indicatorScaleY = useSharedValue(1);

    useEffect(() => {
        const targetCenter =
            12 + activeIndex * tabWidth + tabWidth / 2;

        // Movimento horizontal do indicador
        indicatorCenter.value = withSpring(targetCenter, {
            damping: 16,
            stiffness: 150,
            mass: 0.6,
        });

        // Alongamento expressivo durante a transição
        indicatorWidth.value = withSequence(
            withTiming(80, { duration: 100 }),
            withSpring(64, {
                damping: 12,
                stiffness: 180,
                mass: 0.6,
            })
        );

        indicatorScaleY.value = withSequence(
            withTiming(0.88, { duration: 100 }),
            withSpring(1, {
                damping: 12,
                stiffness: 180,
            })
        );
    }, [activeIndex, tabWidth]);

    const indicatorAnimatedStyle = useAnimatedStyle(() => ({
        width: indicatorWidth.value,
        transform: [
            {
                translateX:
                    indicatorCenter.value - indicatorWidth.value / 2,
            },
            {
                scaleY: indicatorScaleY.value,
            },
        ],
    }));

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.surface,
                    paddingBottom: Math.max(insets.bottom, 12),
                },
            ]}
        >
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.indicator,
                    { backgroundColor: colors.primaryContainer },
                    indicatorAnimatedStyle,
                ]}
            />

            {tabs.map((tab, index) => (
                <TabItem
                    key={tab.path}
                    tab={tab}
                    active={activeIndex === index}
                    onPress={() => router.navigate(tab.path as never)}
                    colors={colors}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#F7F3FF',
        paddingTop: 12,
        paddingHorizontal: 12,
        position: 'relative',
    },

    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        zIndex: 1,
    },

    iconContainer: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconLayer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },

    indicator: {
        position: 'absolute',
        top: 12,
        left: 0,
        height: 32,
        borderRadius: 100,
        backgroundColor: '#E8DEF8',
    },

    activeLabel: {
        fontSize: 12,
        fontWeight: '600',
        height: 16,
    },
});
