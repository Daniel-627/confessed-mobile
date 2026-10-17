import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Body, Btn, Card, Chips, Empty, Eyebrow, Title, openUrl, pad } from '@/components/ui'
import { RES_SERIES, RES_TYPES } from '@/lib/content'
import { Resource, fetchPublishedResources } from '@/lib/sanity'
import { colors, fonts } from '@/lib/theme'

const TYPE_LABELS: Record<string, string> = {
  'study-guide': 'Study Guide',
  'confession-text': 'Confession Text',
  'sermon-outline': 'Sermon Outline',
  'curriculum-pack': 'Curriculum Pack',
}

export default function ResourcesScreen() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('')
  const [series, setSeries] = useState('')

  useEffect(() => {
    fetchPublishedResources()
      .then(setResources)
      .catch(() => setResources([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => resources.filter(r => (!type || r.type === type) && (!series || r.series === series)),
    [resources, type, series],
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <FlatList
        data={loading ? [] : filtered}
        keyExtractor={r => r._id}
        renderItem={({ item: r }) => (
          <View style={pad}>
            <Card>
              <Text style={{ fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 2, color: colors.gold, marginBottom: 8 }}>
                {(TYPE_LABELS[r.type] ?? r.type).toUpperCase()}
              </Text>
              <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.cream, marginBottom: 6 }}>{r.title}</Text>
              {r.description ? <Body style={{ marginBottom: 12 }}>{r.description}</Body> : null}
              {r.series ? (
                <Text style={{ fontFamily: fonts.sansMedium, fontSize: 12, color: colors.faint, marginBottom: 12 }}>
                  {RES_SERIES.find(s => s.value === r.series)?.label}
                </Text>
              ) : null}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Btn label="Download PDF" onPress={() => openUrl(r.fileUrl)} style={{ paddingVertical: 10 }} />
                <Text style={{ fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1.5, color: colors.green }}>FREE</Text>
              </View>
            </Card>
          </View>
        )}
        ListHeaderComponent={
          <View style={[pad, { paddingTop: 28, paddingBottom: 16, gap: 14 }]}>
            <View>
              <Eyebrow text="Free resources" />
              <Title text={'Reformed {{resources}}\nfor the church'} size={34} />
              <Body style={{ marginTop: 10 }}>
                Study guides, confession texts, sermon outlines, and curriculum packs — free for the body of Christ.
              </Body>
            </View>
            <Chips items={RES_TYPES} value={type} onChange={setType} />
            <Chips items={RES_SERIES} value={series} onChange={setSeries} />
            {!loading && (
              <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.faint }}>
                {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          loading ? <ActivityIndicator color={colors.gold} style={{ marginTop: 40 }} /> : <Empty text="No resources found for this filter." />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  )
}
