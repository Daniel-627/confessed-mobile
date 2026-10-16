import { useSignIn } from '@clerk/expo'
import { useSSO } from '@clerk/expo'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { Body, Btn, ErrorText, Field, Title, pad } from '@/components/ui'
import { colors, fonts } from '@/lib/theme'

WebBrowser.maybeCompleteAuthSession()

export default function SignInScreen() {
  const { signIn, fetchStatus } = useSignIn()
  const { startSSOFlow } = useSSO()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const done = () => router.replace('/account')

  async function submit() {
    if (!email.trim() || !password) return
    setBusy(true)
    setError(null)
    try {
      const { error: err } = await signIn.password({ identifier: email.trim(), password })
      if (err) return setError(err.longMessage ?? err.message)
      if (signIn.status === 'complete') {
        const { error: fin } = await signIn.finalize({ navigate: () => done() })
        if (fin) setError(fin.longMessage ?? fin.message)
      } else {
        setError('Additional verification is required. Please finish signing in at confessed.faith.')
      }
    } catch (e: any) {
      setError(e?.message ?? 'Could not sign in')
    } finally {
      setBusy(false)
    }
  }

  async function google() {
    setBusy(true)
    setError(null)
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      })
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
        done()
      }
    } catch (e: any) {
      setError(e?.message ?? 'Google sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[pad, { paddingTop: 32, paddingBottom: 48 }]} keyboardShouldPersistTaps="handled">
        <Text style={{ color: colors.gold, fontSize: 28, textAlign: 'center' }}>✝</Text>
        <Title text="Welcome {{back}}" size={36} center />
        <Body center style={{ marginTop: 6, marginBottom: 28 }}>Sign in to your Confessed account</Body>
        <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" autoCorrect={false} />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" onSubmitEditing={submit} />
        {error && <ErrorText>{error}</ErrorText>}
        <Btn label="Sign in" onPress={submit} loading={busy || fetchStatus === 'fetching'} />
        <View style={{ height: 12 }} />
        <Btn label="Continue with Google" variant="ghost" onPress={google} disabled={busy} />
        <Text style={{ fontFamily: fonts.sans, color: colors.muted, textAlign: 'center', marginTop: 24 }}>
          New here? <Link href="/sign-up" replace style={{ color: colors.gold }}>Create an account</Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
