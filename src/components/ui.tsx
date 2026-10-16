import { ReactNode } from 'react'
import {
  ActivityIndicator, Linking, Pressable, ScrollView, StyleProp, StyleSheet, Text, TextInput,
  TextInputProps, TextStyle, View, ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as WebBrowser from 'expo-web-browser'
import { CONTRIBUTE_URL, colors, fonts } from '@/lib/theme'

export function openUrl(url: string) {
  // mailto and the contributor portal open in the phone's own browser (keeps its sign-in).
  if (url.startsWith('mailto:') || url.startsWith(CONTRIBUTE_URL)) return Linking.openURL(url)
  return WebBrowser.openBrowserAsync(url)
}

/** Screen wrapper: dark background, safe area, optional scroll. */
export function Screen({
  children, scroll = true, edges = ['top'],
}: { children: ReactNode; scroll?: boolean; edges?: ('top' | 'bottom')[] }) {
  return (
    <SafeAreaView style={s.screen} edges={edges}>
      {scroll ? <ScrollView contentContainerStyle={s.scrollContent}>{children}</ScrollView> : children}
    </SafeAreaView>
  )
}

export function Cross({ size = 24 }: { size?: number }) {
  return <Text style={{ color: colors.gold, fontSize: size, textAlign: 'center' }}>✝</Text>
}

export function Eyebrow({ text, center }: { text: string; center?: boolean }) {
  return (
    <View style={[s.eyebrowRow, center && { justifyContent: 'center' }]}>
      <View style={s.eyebrowLine} />
      <Text style={s.eyebrow}>{text}</Text>
      <View style={s.eyebrowLine} />
    </View>
  )
}

export function Label({ children }: { children: ReactNode }) {
  return <Text style={s.label}>{children}</Text>
}

/** Serif heading. Text wrapped in {{double braces}} renders gold italic (the web's <em>). */
export function Title({
  text, size = 34, center, style,
}: { text: string; size?: number; center?: boolean; style?: StyleProp<TextStyle> }) {
  const parts = text.split(/(\{\{.*?\}\})/g).filter(Boolean)
  return (
    <Text
      style={[
        { fontFamily: fonts.serif, color: colors.cream, fontSize: size, lineHeight: size * 1.15 },
        center && { textAlign: 'center' },
        style,
      ]}
    >
      {parts.map((p, i) =>
        p.startsWith('{{') ? (
          <Text key={i} style={{ fontFamily: fonts.serifItalic, color: colors.gold }}>
            {p.slice(2, -2)}
          </Text>
        ) : (
          p
        ),
      )}
    </Text>
  )
}

export function Body({
  children, style, center,
}: { children: ReactNode; style?: StyleProp<TextStyle>; center?: boolean }) {
  return <Text style={[s.body, center && { textAlign: 'center' }, style]}>{children}</Text>
}

export function Quote({ text, cite }: { text: string; cite?: string }) {
  return (
    <View style={s.quote}>
      <Text style={s.quoteText}>{text}</Text>
      {cite ? <Text style={s.quoteCite}>{cite}</Text> : null}
    </View>
  )
}

export function Card({ children, style, onPress }: {
  children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void
}) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [s.card, pressed && { borderColor: colors.goldBorder }, style]}>
        {children}
      </Pressable>
    )
  }
  return <View style={[s.card, style]}>{children}</View>
}

export function Btn({
  label, onPress, variant = 'gold', loading, disabled, style,
}: {
  label: string; onPress: () => void; variant?: 'gold' | 'ghost'; loading?: boolean
  disabled?: boolean; style?: StyleProp<ViewStyle>
}) {
  const gold = variant === 'gold'
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        s.btn, gold ? s.btnGold : s.btnGhost,
        (disabled || loading) && { opacity: 0.5 }, pressed && { opacity: 0.8 }, style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={gold ? colors.bg : colors.gold} />
      ) : (
        <Text style={[s.btnText, { color: gold ? colors.bg : colors.cream }]}>{label}</Text>
      )}
    </Pressable>
  )
}

export function Field({ label, hint, ...props }: TextInputProps & { label: string; hint?: string }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor="rgba(240,236,224,0.2)"
        {...props}
        style={[s.input, props.multiline && { minHeight: 120, textAlignVertical: 'top' }, props.editable === false && { opacity: 0.5 }, props.style]}
      />
      {hint ? <Text style={s.hint}>{hint}</Text> : null}
    </View>
  )
}

/** Horizontal filter chips (the web's tab / select filters). */
export function Chips<T extends string>({
  items, value, onChange,
}: { items: readonly { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 24 }}>
      {items.map(i => {
        const active = i.value === value
        return (
          <Pressable key={i.value} onPress={() => onChange(i.value)} style={[s.chip, active && s.chipActive]}>
            <Text style={[s.chipText, active && { color: colors.gold }]}>{i.label}</Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

export function ErrorText({ children }: { children: ReactNode }) {
  return <Text style={{ color: colors.red, fontFamily: fonts.sans, fontSize: 13, marginBottom: 12 }}>{children}</Text>
}

export function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
      <Cross />
      <ActivityIndicator color={colors.gold} />
    </View>
  )
}

export function Empty({ text }: { text: string }) {
  return <Text style={[s.body, { textAlign: 'center', paddingVertical: 40 }]}>{text}</Text>
}

export const pad = { paddingHorizontal: 24 }

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingBottom: 48 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  eyebrowLine: { height: 1, width: 24, backgroundColor: colors.goldBorder },
  eyebrow: {
    fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 2.2, color: colors.gold, textTransform: 'uppercase',
  },
  label: {
    fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 2.2, color: colors.goldDim,
    textTransform: 'uppercase', marginBottom: 8,
  },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 25, color: colors.muted },
  quote: { borderLeftWidth: 2, borderLeftColor: colors.gold, paddingLeft: 16, marginVertical: 20 },
  quoteText: { fontFamily: fonts.serifItalic, fontSize: 18, lineHeight: 28, color: colors.cream },
  quoteCite: { fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1.5, color: colors.gold, marginTop: 8 },
  card: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12,
    padding: 20, marginBottom: 14,
  },
  btn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnGold: { backgroundColor: colors.gold },
  btnGhost: { borderWidth: 1, borderColor: colors.border },
  btnText: { fontFamily: fonts.sansBold, fontSize: 13, letterSpacing: 1.2, textTransform: 'uppercase' },
  fieldLabel: {
    fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1.8, color: colors.goldDim,
    textTransform: 'uppercase', marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 12, color: colors.cream, fontFamily: fonts.sans, fontSize: 15,
  },
  hint: { fontFamily: fonts.sans, fontSize: 12, color: colors.faint, marginTop: 6 },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 100, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { borderColor: colors.gold, backgroundColor: 'rgba(201,169,74,0.08)' },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.muted },
})
