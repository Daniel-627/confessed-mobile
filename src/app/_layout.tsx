import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts as useGaramond } from '@expo-google-fonts/eb-garamond/useFonts'
import { EBGaramond_400Regular } from '@expo-google-fonts/eb-garamond/400Regular'
import { EBGaramond_400Regular_Italic } from '@expo-google-fonts/eb-garamond/400Regular_Italic'
import { EBGaramond_500Medium } from '@expo-google-fonts/eb-garamond/500Medium'
import { useFonts as useBarlow } from '@expo-google-fonts/barlow/useFonts'
import { Barlow_400Regular } from '@expo-google-fonts/barlow/400Regular'
import { Barlow_500Medium } from '@expo-google-fonts/barlow/500Medium'
import { Barlow_600SemiBold } from '@expo-google-fonts/barlow/600SemiBold'
import { Barlow_700Bold } from '@expo-google-fonts/barlow/700Bold'
import { colors, fonts } from '@/lib/theme'

SplashScreen.preventAutoHideAsync()

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
if (!publishableKey) {
  throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to .env (see .env.example)')
}

export default function RootLayout() {
  const [g] = useGaramond({ EBGaramond_400Regular, EBGaramond_400Regular_Italic, EBGaramond_500Medium })
  const [b] = useBarlow({ Barlow_400Regular, Barlow_500Medium, Barlow_600SemiBold, Barlow_700Bold })
  const ready = g && b

  useEffect(() => {
    if (ready) SplashScreen.hideAsync()
  }, [ready])

  // Always render the navigator: expo-router must mount a navigator on the first render.
  // The splash screen stays visible (preventAutoHideAsync) until fonts are ready.
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.gold,
            headerTitleStyle: { fontFamily: fonts.sansBold, color: colors.cream, fontSize: 14 },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="article/[slug]" options={{ title: 'Article', headerBackTitle: 'Back' }} />
          <Stack.Screen name="sign-in" options={{ title: 'Sign in', presentation: 'modal' }} />
          <Stack.Screen name="sign-up" options={{ title: 'Create account', presentation: 'modal' }} />
          <Stack.Screen name="about" options={{ title: 'About' }} />
          <Stack.Screen name="faith" options={{ title: 'Statement of Faith' }} />
          <Stack.Screen name="contact" options={{ title: 'Contact' }} />
          <Stack.Screen name="videos" options={{ title: 'Videos' }} />
          <Stack.Screen name="podcasts" options={{ title: 'Podcasts' }} />
          <Stack.Screen name="shop" options={{ title: 'Shop' }} />
        </Stack>
      </SafeAreaProvider>
    </ClerkProvider>
  )
}
