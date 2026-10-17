import { useAuth } from '@clerk/expo'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Image, Switch, Text, View } from 'react-native'
import { Body, Btn, Card, Chips, Field, Label, Loading, Screen, Title, openUrl, pad } from '@/components/ui'
import { formatDate, useApi } from '@/lib/api'
import { CONTRIBUTE_URL, colors, fonts } from '@/lib/theme'

type UserData = {
  id: string; email: string; displayName: string | null; avatarUrl: string | null
  role: string; isActive: boolean; createdAt: string
}
type Preferences = {
  theme: string | null; bibleTranslation: string | null; dailyOfficeTime: string | null
  notificationsEmail: boolean | null; language: string | null; timezone: string | null
}

const ROLE_META: Record<string, { label: string; color: string }> = {
  admin: { label: 'Admin', color: colors.green },
  contributor: { label: 'Contributor', color: colors.gold },
  regular: { label: 'Member', color: colors.muted },
}
const TRANSLATIONS = ['ESV', 'KJV', 'NKJV', 'NIV', 'NASB', 'CSB'].map(v => ({ value: v, label: v }))
const LANGUAGES = ['English', 'Swahili', 'French', 'Portuguese', 'Spanish'].map(v => ({ value: v, label: v }))

export default function Account() {
  const { isLoaded, isSignedIn, signOut } = useAuth()
  const { request } = useApi()

  const [user, setUser] = useState<UserData | null>(null)
  const [prefs, setPrefs] = useState<Preferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'profile' | 'preferences'>('profile')
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(null), 2500)
  }

  const load = useCallback(async () => {
    try {
      const d = await request<{ user: UserData; preferences: Preferences }>('/me')
      setUser(d.user)
      setPrefs(d.preferences)
      setDisplayName(d.user.displayName ?? '')
    } catch {
      // handled by empty state below
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      setUser(null)
      setLoading(false)
      return
    }
    setLoading(true)
    load()
  }, [isLoaded, isSignedIn, load])

  if (!isLoaded || loading) return <Loading />

  if (!isSignedIn) {
    return (
      <Screen>
        <View style={[pad, { paddingTop: 40, gap: 14 }]}>
          <Label>Account</Label>
          <Title text="Join the {{confession}}" size={36} />
          <Body style={{ marginBottom: 12 }}>
            Create a free account to save your preferences and, if you write from conviction, apply to contribute.
          </Body>
          <Btn label="Sign in" onPress={() => router.push('/sign-in')} />
          <Btn label="Create account" variant="ghost" onPress={() => router.push('/sign-up')} />
        </View>
      </Screen>
    )
  }

  if (!user) {
    return (
      <Screen>
        <View style={[pad, { paddingTop: 40, gap: 14 }]}>
          <Title text="Couldn't load your {{account}}" size={30} />
          <Body>Check your connection and try again.</Body>
          <Btn label="Retry" onPress={() => { setLoading(true); load() }} />
          <Btn label="Sign out" variant="ghost" onPress={() => signOut()} />
        </View>
      </Screen>
    )
  }

  const role = ROLE_META[user.role] ?? ROLE_META.regular

  async function saveProfile() {
    if (!displayName.trim()) return
    setSaving(true)
    try {
      const d = await request<{ user: UserData }>('/me', { method: 'PUT', body: JSON.stringify({ displayName: displayName.trim() }) })
      setUser(d.user)
      flash('Saved ✓')
    } catch {
      flash('Could not save')
    } finally {
      setSaving(false)
    }
  }

  async function savePrefs() {
    if (!prefs) return
    setSaving(true)
    try {
      const d = await request<{ preferences: Preferences }>('/me/preferences', { method: 'PUT', body: JSON.stringify(prefs) })
      setPrefs(d.preferences)
      flash('Preferences saved ✓')
    } catch {
      flash('Could not save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Screen>
      <View style={[pad, { paddingTop: 28 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.goldBorder, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={{ width: 56, height: 56 }} />
            ) : (
              <Text style={{ fontFamily: fonts.serif, fontSize: 24, color: colors.gold }}>
                {(user.displayName ?? user.email)[0].toUpperCase()}
              </Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Title text={user.displayName ? `{{${user.displayName}}}` : user.email} size={24} />
            <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.faint }}>{user.email}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Text style={{ fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1.5, color: role.color, borderWidth: 1, borderColor: role.color, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3 }}>
            {role.label.toUpperCase()}
          </Text>
          <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.faint }}>
            Member since {formatDate(user.createdAt)}
          </Text>
        </View>

        <Chips
          items={[{ value: 'profile', label: 'Profile' }, { value: 'preferences', label: 'Preferences' }] as const}
          value={tab}
          onChange={setTab}
        />

        <View style={{ marginTop: 24 }}>
          {tab === 'profile' ? (
            <>
              <Field label="Display name" placeholder="How you appear on Confessed" value={displayName} onChangeText={setDisplayName} />
              <Field label="Email address" value={user.email} editable={false} hint="Managed via your Clerk account" />
              <Field label="Account role" value={role.label} editable={false} />
              <Btn label="Save changes" onPress={saveProfile} loading={saving} disabled={!displayName.trim()} />
              <Card style={{ marginTop: 24 }}>
                {user.role === 'regular' ? (
                  <>
                    <Body style={{ marginBottom: 12 }}>Want to write for Confessed? Apply to become a contributor.</Body>
                    <Btn label="Apply now" variant="ghost" onPress={() => openUrl(`${CONTRIBUTE_URL}/apply`)} />
                  </>
                ) : (
                  <>
                    <Body style={{ marginBottom: 12 }}>Access your contributor portal to write and publish articles.</Body>
                    <Btn label="Open portal" variant="ghost" onPress={() => openUrl(CONTRIBUTE_URL)} />
                  </>
                )}
              </Card>
            </>
          ) : prefs ? (
            <>
              <Label>Bible translation</Label>
              <View style={{ marginBottom: 20 }}>
                <Chips items={TRANSLATIONS} value={prefs.bibleTranslation ?? 'ESV'} onChange={v => setPrefs({ ...prefs, bibleTranslation: v })} />
              </View>
              <Label>Language</Label>
              <View style={{ marginBottom: 20 }}>
                <Chips items={LANGUAGES} value={prefs.language ?? 'English'} onChange={v => setPrefs({ ...prefs, language: v })} />
              </View>
              <Field
                label="Daily Office time"
                placeholder="07:00"
                value={(prefs.dailyOfficeTime ?? '07:00').slice(0, 5)}
                onChangeText={v => setPrefs({ ...prefs, dailyOfficeTime: v })}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
                hint="24-hour HH:MM — when you'd like your daily reading reminder"
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={{ fontFamily: fonts.sansSemi, color: colors.cream, fontSize: 15 }}>Email notifications</Text>
                  <Text style={{ fontFamily: fonts.sans, color: colors.faint, fontSize: 12 }}>New articles, announcements, and updates</Text>
                </View>
                <Switch
                  value={!!prefs.notificationsEmail}
                  onValueChange={v => setPrefs({ ...prefs, notificationsEmail: v })}
                  trackColor={{ true: colors.gold, false: colors.border }}
                />
              </View>
              <Btn label="Save preferences" onPress={savePrefs} loading={saving} />
            </>
          ) : null}
          {msg ? <Text style={{ fontFamily: fonts.sansSemi, color: colors.green, marginTop: 12, textAlign: 'center' }}>{msg}</Text> : null}
        </View>

        <Btn label="Sign out" variant="ghost" onPress={() => signOut()} style={{ marginTop: 36 }} />
      </View>
    </Screen>
  )
}
