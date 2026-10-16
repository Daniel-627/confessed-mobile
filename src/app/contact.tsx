import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { Body, Btn, Chips, Cross, ErrorText, Eyebrow, Field, Label, Title, openUrl, pad } from '@/components/ui'
import { publicRequest } from '@/lib/api'
import { REASONS } from '@/lib/content'
import { CONTRIBUTE_URL, colors, fonts } from '@/lib/theme'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await publicRequest('/contact', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), email: email.trim(), reason, message: message.trim() }),
      })
      setSent(true)
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <View style={[pad, { flex: 1, justifyContent: 'center', gap: 14 }]}>
        <Cross size={36} />
        <Title text="Message {{received.}}" size={34} center />
        <Body center>
          Thank you for reaching out. We read every message and will respond as soon as we are able. Grace and peace to you.
        </Body>
      </View>
    )
  }

  const reasons = REASONS.map(r => ({ value: r as string, label: r as string }))

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[pad, { paddingTop: 16, paddingBottom: 56 }]} keyboardShouldPersistTaps="handled">
        <Eyebrow text="Get in touch" />
        <Title text={'We would love to\n{{hear}} from you'} size={36} />
        <Body style={{ marginTop: 12, marginBottom: 20 }}>
          Whether you have a theological question, want to collaborate, or simply want to reach out — we read every message.
        </Body>
        <Label>Email</Label>
        <Text onPress={() => openUrl('mailto:hello@confessed.faith')} style={{ fontFamily: fonts.sansMedium, color: colors.gold, marginBottom: 14 }}>
          hello@confessed.faith
        </Text>
        <Label>Based in</Label>
        <Body style={{ marginBottom: 14 }}>Nairobi, Kenya — writing for the world</Body>
        <Label>Write for Confessed</Label>
        <Text onPress={() => openUrl(`${CONTRIBUTE_URL}/apply`)} style={{ fontFamily: fonts.sansMedium, color: colors.gold, marginBottom: 28 }}>
          Apply here — we review every application.
        </Text>

        <Field label="Name *" placeholder="Your full name" value={name} onChangeText={setName} />
        <Field label="Email *" placeholder="your@email.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoCorrect={false} />
        <Label>Reason for contact</Label>
        <View style={{ marginBottom: 18 }}>
          <Chips items={reasons} value={reason} onChange={setReason} />
        </View>
        <Field label="Message *" placeholder="Write your message here…" value={message} onChangeText={setMessage} multiline />
        {error && <ErrorText>{error}</ErrorText>}
        <Btn label="Send message" onPress={submit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
