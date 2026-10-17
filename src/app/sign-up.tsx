import { useSignUp } from '@clerk/expo'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native'
import { Body, Btn, Cross, ErrorText, Field, Title, pad } from '@/components/ui'
import { colors, fonts } from '@/lib/theme'

export default function SignUpScreen() {
  const { signUp, fetchStatus } = useSignUp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const msg = (e: { longMessage?: string; message: string }) => e.longMessage ?? e.message

  async function create() {
    if (!email.trim() || !password) return
    setBusy(true)
    setError(null)
    try {
      const { error: err } = await signUp.password({ emailAddress: email.trim(), password })
      if (err) return setError(msg(err))
      const { error: sendErr } = await signUp.verifications.sendEmailCode()
      if (sendErr) return setError(msg(sendErr))
      setStep('verify')
    } catch (e: any) {
      setError(e?.message ?? 'Could not create account')
    } finally {
      setBusy(false)
    }
  }

  async function verify() {
    if (!code.trim()) return
    setBusy(true)
    setError(null)
    try {
      const { error: err } = await signUp.verifications.verifyEmailCode({ code: code.trim() })
      if (err) return setError(msg(err))
      if (signUp.status === 'complete') {
        const { error: fin } = await signUp.finalize({ navigate: () => router.replace('/account') })
        if (fin) setError(msg(fin))
      } else {
        setError('Sign-up needs more information. Please finish at confessed.faith.')
      }
    } catch (e: any) {
      setError(e?.message ?? 'Verification failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[pad, { paddingTop: 32, paddingBottom: 48 }]} keyboardShouldPersistTaps="handled">
        <Cross size={28} />
        {step === 'form' ? (
          <>
            <Title text="Join {{Confessed}}" size={36} center />
            <Body center style={{ marginTop: 6, marginBottom: 28 }}>Create your free account</Body>
            <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" autoCorrect={false} />
            <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" hint="At least 8 characters" />
            {error && <ErrorText>{error}</ErrorText>}
            <Btn label="Create account" onPress={create} loading={busy || fetchStatus === 'fetching'} />
            <Text style={{ fontFamily: fonts.sans, color: colors.muted, textAlign: 'center', marginTop: 24 }}>
              Already have an account? <Link href="/sign-in" replace style={{ color: colors.gold }}>Sign in</Link>
            </Text>
          </>
        ) : (
          <>
            <Title text="Check your {{email}}" size={34} center />
            <Body center style={{ marginTop: 6, marginBottom: 28 }}>We sent a verification code to {email}</Body>
            <Field label="Verification code" value={code} onChangeText={setCode} keyboardType="number-pad" autoComplete="one-time-code" onSubmitEditing={verify} />
            {error && <ErrorText>{error}</ErrorText>}
            <Btn label="Verify" onPress={verify} loading={busy || fetchStatus === 'fetching'} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
