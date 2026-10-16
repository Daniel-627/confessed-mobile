import { router } from 'expo-router'
import { Text, View } from 'react-native'
import { Body, Btn, Eyebrow, Quote, Screen, Title, openUrl, pad } from '@/components/ui'
import { FAITH, FAITH_LEAD, FAITH_QUOTE } from '@/lib/content'
import { colors, fonts } from '@/lib/theme'

export default function Faith() {
  return (
    <Screen edges={[]}>
      <View style={[pad, { paddingTop: 16 }]}>
        <Eyebrow text="What we believe" />
        <Title text={'Statement\nof {{Faith}}'} size={40} />
        <Body style={{ marginTop: 14, marginBottom: 18 }}>{FAITH_LEAD}</Body>
        <Btn label="Read the full 1689 Confession" variant="ghost" onPress={() => openUrl('https://www.1689.com')} />

        <View style={{ marginTop: 32 }}>
          {FAITH.map(a => (
            <View key={a.num} style={{ flexDirection: 'row', gap: 16, paddingVertical: 20, borderTopWidth: 1, borderTopColor: colors.borderSoft }}>
              <Text style={{ fontFamily: fonts.serif, fontSize: 30, color: colors.gold, width: 44 }}>{a.num}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1.8, color: colors.goldDim, marginBottom: 4 }}>
                  {a.ref.toUpperCase()}
                </Text>
                <Text style={{ fontFamily: fonts.serif, fontSize: 24, color: colors.cream, marginBottom: 8 }}>{a.title}</Text>
                <Body>{a.body}</Body>
              </View>
            </View>
          ))}
        </View>

        <Quote text={`"${FAITH_QUOTE.replace(/^"|"$/g, '')}"`} cite="ROMANS 10:9 · ESV" />
        <Body style={{ fontSize: 13, lineHeight: 21 }}>
          This statement is a summary. For the full and authoritative expression of what we believe, we commend the Second
          London Baptist Confession of Faith (1689) to every reader.
        </Body>
        <Btn label="Questions? Contact us" variant="ghost" onPress={() => router.push('/contact')} style={{ marginTop: 16 }} />
      </View>
    </Screen>
  )
}
