import { StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Card } from './ui'
import { Article, formatDate } from '@/lib/api'
import { colors, fonts } from '@/lib/theme'

export default function ArticleCard({ a }: { a: Article }) {
  return (
    <Card onPress={() => router.push({ pathname: '/article/[slug]', params: { slug: a.slug } })}>
      {a.series && <Text style={s.series}>{a.series.name}</Text>}
      <Text style={s.title}>{a.title}</Text>
      {a.excerpt ? <Text style={s.excerpt} numberOfLines={3}>{a.excerpt}</Text> : null}
      <View style={s.meta}>
        <Text style={s.metaText}>{formatDate(a.publishedAt)}</Text>
        {a.readingTimeMinutes ? (
          <>
            <View style={s.dot} />
            <Text style={s.metaText}>{a.readingTimeMinutes} min read</Text>
          </>
        ) : null}
      </View>
    </Card>
  )
}

const s = StyleSheet.create({
  series: {
    fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 2, color: colors.gold,
    textTransform: 'uppercase', marginBottom: 8,
  },
  title: { fontFamily: fonts.serif, fontSize: 23, lineHeight: 29, color: colors.cream, marginBottom: 8 },
  excerpt: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 22, color: colors.muted, marginBottom: 14 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontFamily: fonts.sans, fontSize: 12, color: colors.faint },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.faint },
})
