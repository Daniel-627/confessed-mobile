import { Tabs } from 'expo-router'
import { BookOpen, Download, Menu, User, type LucideIcon } from 'lucide-react-native'
import { ColorValue } from 'react-native'
import { CrossIcon } from '@/components/ui'
import { colors, fonts } from '@/lib/theme'

const icon = (Icon: LucideIcon) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Icon color={color as string} size={22} strokeWidth={1.75} />
  }

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.borderSoft },
        tabBarLabelStyle: { fontFamily: fonts.sansSemi, fontSize: 10, letterSpacing: 0.8 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <CrossIcon color={color} /> }} />
      <Tabs.Screen name="articles" options={{ title: 'Articles', tabBarIcon: icon(BookOpen) }} />
      <Tabs.Screen name="resources" options={{ title: 'Resources', tabBarIcon: icon(Download) }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: icon(User) }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: icon(Menu) }} />
    </Tabs>
  )
}
