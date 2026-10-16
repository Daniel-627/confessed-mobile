import { Stack, router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Share, Text, View } from 'react-native'
import ArticleMarkdown from '@/components/Markdown'
import { Body, Btn, Cross, Loading, Title, pad } from '@/components/ui'
import { Article, formatDate, publicRequest } from '@/lib/api'
import { SITE_URL, colors, fonts } from '@/lib/theme'

export default function ArticleDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading')

  useEffect(() => {
    publicRequest<{ article: Article }>(`/articles/${slug}`)
      .then(d => {
        setArticle(d.article)
        setState('ready')
      })
      .catch(() => setState('missing'))
  }, [slug])

  if (state === 'loading') return <Loading />
  if (state === 'missing' || !article) {
    return (
      <View style={[pad, { flex: 1, justifyContent: 'center', gap: 16 }]}>
        <Title text="Article {{not found}}" center />
        <Body center>This article may have been unpublished or moved.</Body>
        <Btn label="Back to articles" onPress={() => router.replace('/articles')} />
      </View>
    )
  }

  const url = `${SITE_URL}/articles/${article.slug}`

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <Pressable onPress={() => Share.share({ message: `${article.title} — ${url}`, url })} hitSlop={12}>
              <Text style={{ color: colors.gold, fontFamily: fonts.sansBold, fontSize: 13 }}>Share</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={[pad, { paddingTop: 12, paddingBottom: 64 }]}>
        {article.series && (
          <Pressable onPress={() => router.navigate({ pathname: '/articles', params: { series: article.series!.slug } })}>
            <Text style={{ fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 2, color: colors.gold, textTransform: 'uppercase', marginBottom: 12 }}>
              {article.series.name}
            </Text>
          </Pressable>
        )}
        <Title text={article.title} size={38} />
        {article.excerpt ? (
          <Text style={{ fontFamily: fonts.serifItalic, fontSize: 19, lineHeight: 28, color: colors.muted, marginTop: 14 }}>
            {article.excerpt}
          </Text>
        ) : null}
        <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.faint, marginTop: 16 }}>
          {[formatDate(article.publishedAt), article.readingTimeMinutes ? `${article.readingTimeMinutes} min read` : '']
            .filter(Boolean)
            .join('  ·  ')}
        </Text>
        {article.tags && article.tags.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            {article.tags.map(t => (
              <Text key={t} style={{ fontFamily: fonts.sansMedium, fontSize: 11, color: colors.muted, borderWidth: 1, borderColor: colors.border, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4 }}>
                {t}
              </Text>
            ))}
          </View>
        )}
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 24 }} />
        <ArticleMarkdown>{article.content ?? ''}</ArticleMarkdown>
        <View style={{ marginTop: 32 }}><Cross /></View>
      </ScrollView>
    </>
  )
}
