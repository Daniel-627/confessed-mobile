import { useAuth } from '@clerk/expo'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import ArticleCard from '@/components/ArticleCard'
import { Body, Btn, Card, Cross, Eyebrow, Field, Label, Quote, Screen, Title, ErrorText, openUrl, pad } from '@/components/ui'
import { Article, publicRequest } from '@/lib/api'
import { HOME_SERIES } from '@/lib/content'
import { CONTRIBUTE_URL, colors, fonts } from '@/lib/theme'

const PILLARS = [
  { title: 'Reformed', desc: 'Grounded in the great confessions of the church — Westminster, Heidelberg, 1689.' },
  { title: 'Confessional', desc: 'We confess with our mouths that Jesus is Lord and believe in our hearts.' },
  { title: 'Gospel-Centred', desc: 'Every article, sermon, and study anchored to the power of Christ crucified.' },
]

const REQS = [
  { num: '01', title: 'Confessional', desc: 'You hold to the 1689 Second London Baptist Confession as a faithful summary of Scripture.' },
  { num: '02', title: 'Theological', desc: 'Your writing engages ideas with depth, precision, and clear grounding in the Word.' },
  { num: '03', title: 'Accessible', desc: 'You write for the church, not the academy — without sacrificing seriousness.' },
  { num: '04', title: 'Gospel-centred', desc: 'Every piece points toward the good news of Jesus Christ crucified and risen.' },
]

export default function Home() {
  const { isSignedIn } = useAuth()
  return (
    <Screen>
      <Hero signedIn={!!isSignedIn} />
      <Latest />
      <SeriesShowcase />
      <ContributeCta />
      <NewsletterCta />
    </Screen>
  )
}

function Hero({ signedIn }: { signedIn: boolean }) {
  return (
    <View style={[pad, { paddingTop: 32, paddingBottom: 24 }]}>
      <Eyebrow text="Reformed · Confessional · Gospel-Centred" />
      <Title text={'Not Ashamed\nof the {{Gospel}}'} size={46} />
      <Text style={{ fontFamily: fonts.sansSemi, letterSpacing: 2, fontSize: 12, color: colors.gold, marginTop: 14 }}>
        THEOLOGY. APOLOGETICS. DISCIPLESHIP.
      </Text>
      <Quote
        text={'"For I am not ashamed of the gospel, for it is the power of God for salvation to everyone who believes."'}
        cite="ROMANS 1:16 · ESV"
      />
      <View style={{ gap: 12, marginBottom: 28 }}>
        {!signedIn && <Btn label="Join Confessed" onPress={() => router.push('/sign-up')} />}
        <Btn label="Read the articles" variant="ghost" onPress={() => router.navigate('/articles')} />
      </View>
      {PILLARS.map(p => (
        <Card key={p.title}>
          <Cross size={14} />
          <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.cream, marginBottom: 6 }}>{p.title}</Text>
          <Body>{p.desc}</Body>
        </Card>
      ))}
    </View>
  )
}

function Latest() {
  const [articles, setArticles] = useState<Article[]>([])
  useEffect(() => {
    publicRequest<{ articles: Article[] }>('/articles?limit=3')
      .then(d => setArticles(d.articles ?? []))
      .catch(() => {})
  }, [])
  if (!articles.length) return null
  return (
    <View style={[pad, { paddingTop: 12 }]}>
      <Label>Latest</Label>
      <Title text="From the {{articles}}" size={30} style={{ marginBottom: 16 }} />
      {articles.map(a => <ArticleCard key={a.id} a={a} />)}
      <Btn label="All articles" variant="ghost" onPress={() => router.navigate('/articles')} />
    </View>
  )
}

function SeriesShowcase() {
  return (
    <View style={[pad, { paddingTop: 40 }]}>
      <Label>Content</Label>
      <Title text={'Eight series.\n{{One confession.}}'} size={32} style={{ marginBottom: 10 }} />
      <Body style={{ marginBottom: 20 }}>
        From systematic theology to cultural commentary — every series has a distinct job, audience, and purpose.
      </Body>
      {HOME_SERIES.map(s => (
        <Card key={s.slug} onPress={() => router.navigate({ pathname: '/articles', params: { series: s.slug } })}>
          <Text style={{ fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1.8, color: colors.goldDim, marginBottom: 6 }}>
            {s.ref.toUpperCase()}
          </Text>
          <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.cream, marginBottom: 6 }}>{s.name}</Text>
          <Body>{s.desc}</Body>
        </Card>
      ))}
    </View>
  )
}

function ContributeCta() {
  return (
    <View style={[pad, { paddingTop: 40 }]}>
      <Label>Contribute</Label>
      <Title text={'Write for\n{{Confessed}}'} size={32} style={{ marginBottom: 10 }} />
      <Body style={{ marginBottom: 16 }}>
        Confessed is built by contributors who write from conviction. If you hold to the Reformed Baptist faith, write
        clearly, and have something worth saying — we want to hear from you.
      </Body>
      {REQS.map(r => (
        <View key={r.num} style={{ flexDirection: 'row', gap: 14, marginBottom: 14 }}>
          <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.gold }}>{r.num}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.sansSemi, color: colors.cream, fontSize: 15 }}>{r.title}</Text>
            <Body style={{ fontSize: 14, lineHeight: 22 }}>{r.desc}</Body>
          </View>
        </View>
      ))}
      <Btn label="Apply to contribute" onPress={() => openUrl(`${CONTRIBUTE_URL}/apply`)} style={{ marginTop: 8 }} />
    </View>
  )
}

function NewsletterCta() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      await publicRequest('/newsletter', { method: 'POST', body: JSON.stringify({ email: email.trim() }) })
      setSent(true)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[pad, { paddingTop: 48 }]}>
      <Label>Newsletter</Label>
      <Title text="Stay in the {{Word}}" size={32} style={{ marginBottom: 10 }} />
      <Body style={{ marginBottom: 16 }}>
        Gospel-centred articles, new series, and theological resources — delivered to your inbox. No noise.
      </Body>
      {sent ? (
        <Body style={{ color: colors.green }}>You are subscribed. Grace and peace to you.</Body>
      ) : (
        <>
          <Field
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="send"
            onSubmitEditing={submit}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <Btn label="Subscribe" onPress={submit} loading={loading} />
          <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.faint, marginTop: 10, textAlign: 'center' }}>
            No spam. Unsubscribe at any time.
          </Text>
        </>
      )}
    </View>
  )
}
