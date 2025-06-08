// Update header styles to be consistent with theme
export default function TabLayout() {
  const { colors, theme } = useThemeStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.light,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text.primary,
        headerShadowVisible: false,
      }}
    >
      {/* ... rest remains same */}
    </Tabs>
  );
}