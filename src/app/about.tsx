import { router } from 'expo-router'
import { Text, View } from 'react-native'
import { Body, Btn, Card, Eyebrow, Label, Quote, Screen, Title, pad } from '@/components/ui'
import { ABOUT_SERIES, ABOUT_VALUES, HERO, NAME_CARDS, SECTIONS, STATS } from '@/lib/content'
import { colors, fonts } from '@/lib/theme'

export default function About() {
  return (
    <Screen edges={[]}>
      <View style={[pad, { paddingTop: 16 }]}>
        <Eyebrow text="Reformed · Confessional · Baptist" />
        <Title text={HERO.title} size={38} />
        <Body style={{ marginTop: 14 }}>{HERO.lead}</Body>

        {SECTIONS.map(sec => (
          <View key={sec.label} style={{ marginTop: 44 }}>
            <Label>{sec.label}</Label>
            <Title text={sec.title} size={30} style={{ marginBottom: 14 }} />

            {sec.parts.map((p, i) =>
              p.t === 'p' ? (
                <Body key={i} style={{ marginBottom: 14 }}>{p.v}</Body>
              ) : (
                <Quote key={i} text={p.v} cite={p.c} />
              ),
            )}

            {sec.kind === 'stats' && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
                {STATS.map(s => (
                  <Card key={s.label} style={{ width: '47%', marginBottom: 0, alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.serif, fontSize: 34, color: colors.gold }}>{s.num}</Text>
                    <Text style={{ fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1.8, color: colors.muted, textTransform: 'uppercase' }}>
                      {s.label}
                    </Text>
                  </Card>
                ))}
              </View>
            )}

            {sec.kind === 'names' &&
              NAME_CARDS.map(c => (
                <Card key={c.num}>
                  <Text style={{ fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 2, color: colors.goldDim }}>{c.num}</Text>
                  <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.cream, marginVertical: 6 }}>{c.title}</Text>
                  <Body>{c.desc}</Body>
                </Card>
              ))}

            {sec.kind === 'values' &&
              ABOUT_VALUES.map(v => (
                <View key={v.label} style={{ marginBottom: 20 }}>
                  <Text style={{ fontFamily: fonts.serifItalic, fontSize: 24, color: colors.gold, marginBottom: 4 }}>{v.label}</Text>
                  <Body>{v.desc}</Body>
                </View>
              ))}

            {sec.kind === 'series' &&
              ABOUT_SERIES.map(s => (
                <Card key={s.name}>
                  <Text style={{ fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1.8, color: colors.goldDim, marginBottom: 6 }}>
                    {s.ref.toUpperCase()}
                  </Text>
                  <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.cream, marginBottom: 6 }}>{s.name}</Text>
                  <Body>{s.desc}</Body>
                </Card>
              ))}

            {sec.kind === 'cta' && (
              <View style={{ gap: 12, marginTop: 6 }}>
                <Btn label="Read the articles" onPress={() => router.navigate('/articles')} />
                <Btn label="Create an account" variant="ghost" onPress={() => router.push('/sign-up')} />
                <Btn label="Get in touch" variant="ghost" onPress={() => router.push('/contact')} />
              </View>
            )}
          </View>
        ))}
      </View>
    </Screen>
  )
}
