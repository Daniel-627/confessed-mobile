import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ArticleCard from '@/components/ArticleCard'
import { Body, Chips, Empty, Eyebrow, Title, pad } from '@/components/ui'
import { Article, Series, publicRequest } from '@/lib/api'
import { colors } from '@/lib/theme'

export default function ArticlesScreen() {
  const { series: seriesParam } = useLocalSearchParams<{ series?: string }>()
  const active = seriesParam ?? 'all'

  const [seriesList, setSeriesList] = useState<Series[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    publicRequest<{ series: Series[] }>('/series')
      .then(d => setSeriesList(d.series ?? []))
      .catch(() => {})
  }, [])

  const load = useCallback(async () => {
    const path = active === 'all' ? '/articles' : `/articles?series=${encodeURIComponent(active)}`
    try {
      const d = await publicRequest<{ articles: Article[] }>(path)
      setArticles(d.articles ?? [])
    } catch {
      setArticles([])
    }
  }, [active])

  useEffect(() => {
    setLoading(true)
    load().finally(() => setLoading(false))
  }, [load])

  const filters = [{ value: 'all', label: 'All articles' }, ...seriesList.map(s => ({ value: s.slug, label: s.name }))]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <FlatList
        data={loading ? [] : articles}
        keyExtractor={a => a.id}
        renderItem={({ item }) => <View style={pad}><ArticleCard a={item} /></View>}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true)
          await load()
          setRefreshing(false)
        }}
        ListHeaderComponent={
          <View style={[pad, { paddingTop: 28, paddingBottom: 16 }]}>
            <Eyebrow text="Reformed · Confessional · Gospel-Centered" />
            <Title text={'Confessional {{theology,}}\nwritten for the church'} size={34} />
            <Body style={{ marginTop: 10, marginBottom: 18 }}>
              Articles across doctrine, apologetics, history, and the Christian life.
            </Body>
            <Chips
              items={filters}
              value={active}
              onChange={v => router.setParams({ series: v === 'all' ? undefined : v })}
            />
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.gold} style={{ marginTop: 40 }} />
          ) : (
            <Empty text="No articles yet in this series." />
          )
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  )
}
