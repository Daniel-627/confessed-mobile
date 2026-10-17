import { router } from 'expo-router'
import { Text, View } from 'react-native'
import { Body, Btn, Cross, Title, pad } from './ui'
import { colors, fonts } from '@/lib/theme'

export default function ComingSoon({ title, blurb }: { title: string; blurb: string }) {
  return (
    <View style={[pad, { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }]}>
      <Cross size={30} />
      <Text style={{ fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 2.2, color: colors.gold, borderWidth: 1, borderColor: colors.goldBorder, borderRadius: 100, paddingHorizontal: 12, paddingVertical: 4 }}>
        COMING SOON
      </Text>
      <Title text={title} size={36} center />
      <Body center>{blurb}</Body>
      <Btn label="Read the articles" variant="ghost" onPress={() => router.navigate('/articles')} />
    </View>
  )
}
