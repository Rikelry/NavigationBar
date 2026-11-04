import { useEffect, useState } from 'react';

import {
    LayoutChangeEvent,
    View,
    Pressable,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

import {
    useAppTheme,
    type AppTheme,
} from '../../constants/theme';

// --------------------------------------------------
// CONFIGURAÇÃO DOS DESTINOS
// --------------------------------------------------

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
// CONSTANTES GEOMÉTRICAS
// --------------------------------------------------

const COMPACT_BREAKPOINT = 600;

const BAR_HEIGHT = 64;

const COMPACT_INDICATOR_WIDTH = 56;
const COMPACT_INDICATOR_HEIGHT = 32;

const HORIZONTAL_INDICATOR_HEIGHT = 56;

// --------------------------------------------------
// TIPOS
// --------------------------------------------------

type TabItemProps = {
    tab: (typeof tabs)[number];
    active: boolean;
    horizontal: boolean;
    colors: AppTheme;
    onPress: () => void;
    onLayout: (event: LayoutChangeEvent) => void;
};

// --------------------------------------------------
// ITEM DE NAVEGAÇÃO
// --------------------------------------------------

function TabItem({
    tab,
    active,
    horizontal,
    colors,
    onPress,
    onLayout,
}: TabItemProps) {
    const progress = useSharedValue(active ? 1 : 0);

    useEffect(() => {
        progress.value = withSpring(active ? 1 : 0, {
            damping: 15,
            stiffness: 180,
            mass: 0.7,
        });
    }, [active, progress]);

    // Escala do ícone
    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: 0.92 + progress.value * 0.12,
            },
        ],
    }));

    // Ícone inativo
    const inactiveIconStyle = useAnimatedStyle(() => ({
        opacity: 1 - progress.value,
        transform: [
            {
                scale: 1 - progress.value * 0.08,
            },
        ],
    }));

    // Ícone ativo
    const activeIconStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [
            {
                scale: 0.85 + progress.value * 0.15,
            },
        ],
    }));

    // Label da configuração compacta
    const labelAnimatedStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [
            {
                translateY: (1 - progress.value) * 4,
            },
        ],
    }));

    return (
        <Pressable
            onPress={onPress}
            onLayout={onLayout}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.name}
            style={
                horizontal
                    ? styles.horizontalTab
                    : styles.compactTab
            }
        >
            {/* Ícones */}
            <Animated.View
                style={[
                    styles.iconContainer,
                    iconAnimatedStyle,
                ]}
            >
                <Animated.View
                    style={[
                        styles.iconLayer,
                        inactiveIconStyle,
                    ]}
                >
                    <MaterialCommunityIcons
                        name={tab.icon}
                        size={24}
                        color={colors.onSurfaceVariant}
                    />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.iconLayer,
                        activeIconStyle,
                    ]}
                >
                    <MaterialCommunityIcons
                        name={tab.activeIcon}
                        size={24}
                        color={colors.onSecondaryContainer}
                    />
                </Animated.View>
            </Animated.View>

            {/* Label */}
            <Animated.Text
                numberOfLines={1}
                style={[
                    horizontal
                        ? styles.horizontalLabel
                        : styles.compactLabel,

                    {
                        color: active
                            ? colors.secondary
                            : colors.onSurfaceVariant,
                    },

                    !horizontal && labelAnimatedStyle,
                ]}
            >
                {tab.name}
            </Animated.Text>
        </Pressable>
    );
}

// --------------------------------------------------
// NAVIGATION BAR EXPRESSIVE
// --------------------------------------------------

type ItemLayout = {
    x: number;
    width: number;
};

export function ExpressiveTabBar() {
    const router = useRouter();
    const pathname = usePathname();

    const colors = useAppTheme();
    const insets = useSafeAreaInsets();

    const { width: windowWidth } = useWindowDimensions();

    // A configuração muda automaticamente
    // quando a largura da janela muda.
    const horizontal = windowWidth >= COMPACT_BREAKPOINT;

    const activeIndex = Math.max(
        0,
        tabs.findIndex((tab) => tab.path === pathname),
    );

    // Guarda as dimensões reais dos destinos.
    const [itemLayouts, setItemLayouts] = useState<
        Record<string, ItemLayout>
    >({});

    // Valores animados do indicador.
    const indicatorX = useSharedValue(0);

    const indicatorWidth = useSharedValue(
        COMPACT_INDICATOR_WIDTH,
    );

    // Atualiza a posição e largura do indicador.
    useEffect(() => {
        const activeTab = tabs[activeIndex];

        const layout = itemLayouts[activeTab.path];

        if (!layout) return;

        const targetWidth = horizontal
            ? layout.width
            : COMPACT_INDICATOR_WIDTH;

        const targetX = horizontal
            ? layout.x
            : layout.x + (layout.width - targetWidth) / 2;

        indicatorX.value = withSpring(targetX, {
            damping: 18,
            stiffness: 160,
            mass: 0.7,
        });

        indicatorWidth.value = withSpring(targetWidth, {
            damping: 18,
            stiffness: 160,
            mass: 0.7,
        });
    }, [
        activeIndex,
        horizontal,
        itemLayouts,
        indicatorX,
        indicatorWidth,
    ]);

    // Estilo animado do indicador.
    const indicatorAnimatedStyle = useAnimatedStyle(() => ({
        width: indicatorWidth.value,

        transform: [
            {
                translateX: indicatorX.value,
            },
        ],
    }));

    // Captura as dimensões de cada destino.
    const handleItemLayout = (path: string) => (
        event: LayoutChangeEvent,
    ) => {
        const { x, width } = event.nativeEvent.layout;

        setItemLayouts((previous) => {
            const current = previous[path];

            // Evita atualizações desnecessárias.
            if (
                current &&
                Math.abs(current.x - x) < 0.5 &&
                Math.abs(current.width - width) < 0.5
            ) {
                return previous;
            }

            return {
                ...previous,
                [path]: {
                    x,
                    width,
                },
            };
        });
    };

    const activeLayout = itemLayouts[tabs[activeIndex].path];

    return (
        <View
            style={[
                styles.safeArea,
                {
                    backgroundColor: colors.surface,
                    paddingBottom: insets.bottom,
                },
            ]}
        >
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.surface,
                    },
                ]}
            >
                {/* Indicador ativo */}
                {activeLayout && (
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.indicator,

                            horizontal
                                ? styles.horizontalIndicator
                                : styles.compactIndicator,

                            {
                                backgroundColor: colors.primaryContainer,
                            },

                            indicatorAnimatedStyle,
                        ]}
                    />
                )}

                {/* Destinos */}
                <View
                    style={
                        horizontal
                            ? styles.horizontalItems
                            : styles.compactItems
                    }
                >
                    {tabs.map((tab, index) => (
                        <TabItem
                            key={tab.path}
                            tab={tab}
                            active={activeIndex === index}
                            horizontal={horizontal}
                            colors={colors}
                            onLayout={handleItemLayout(tab.path)}
                            onPress={() => {
                                if (index !== activeIndex) {
                                    router.navigate(tab.path as never);
                                }
                            }}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}

// --------------------------------------------------
// ESTILOS
// --------------------------------------------------

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
    },

    container: {
        height: BAR_HEIGHT,
        width: '100%',
        justifyContent: 'center',
        position: 'relative',
    },

    indicator: {
        position: 'absolute',
        left: 0,
        zIndex: 0,
    },

    // ----------------------------------------------
    // CONFIGURAÇÃO COMPACTA
    // ----------------------------------------------

    compactItems: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: BAR_HEIGHT,
    },

    compactTab: {
        flex: 1,
        height: BAR_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 6,
        zIndex: 1,
    },

    compactIndicator: {
        position: 'absolute',
        top: 6,
        left: 0,
        height: COMPACT_INDICATOR_HEIGHT,
        borderRadius: 16,
    },

    iconContainer: {
        width: 28,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconLayer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },

    compactLabel: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500',
        height: 16,
    },

    // ----------------------------------------------
    // CONFIGURAÇÃO HORIZONTAL
    // ----------------------------------------------

    horizontalItems: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: BAR_HEIGHT,
        gap: 8,
        paddingHorizontal: 12,
    },

    horizontalTab: {
        height: HORIZONTAL_INDICATOR_HEIGHT,
        maxWidth: 180,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: 28,
        zIndex: 1,
    },

    horizontalIndicator: {
        position: 'absolute',
        top: 4,
        left: 0,
        height: HORIZONTAL_INDICATOR_HEIGHT,
        borderRadius: 28,
    },

    horizontalLabel: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
        flexShrink: 1,
    },
});
