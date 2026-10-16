import { Tabs } from 'expo-router'
import { ColorValue, Text } from 'react-native'
import { colors, fonts } from '@/lib/theme'

// Simple glyph icons keep the app free of an icon-font dependency.
const glyph = (g: string) =>
  function Icon({ color }: { color: ColorValue }) {
    return <Text style={{ color, fontSize: 18 }}>{g}</Text>
  }

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.borderSoft },
        tabBarLabelStyle: { fontFamily: fonts.sansSemi, fontSize: 10, letterSpacing: 0.8 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: glyph('✝') }} />
      <Tabs.Screen name="articles" options={{ title: 'Articles', tabBarIcon: glyph('☰') }} />
      <Tabs.Screen name="resources" options={{ title: 'Resources', tabBarIcon: glyph('⇩') }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: glyph('☺') }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: glyph('⋯') }} />
    </Tabs>
  )
}
