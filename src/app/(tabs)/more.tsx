import { ChevronRight } from 'lucide-react-native'
import { Href, router } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { Cross, Label, Screen, Title, openUrl, pad } from '@/components/ui'
import { SITE_URL, colors, fonts } from '@/lib/theme'

type Item = { label: string; href?: Href; url?: string; badge?: string }

const SECTIONS: { title: string; items: Item[] }[] = [
  {
    title: 'Explore',
    items: [
      { label: 'Videos', href: '/videos', badge: 'Soon' },
      { label: 'Podcasts', href: '/podcasts', badge: 'Soon' },
      { label: 'Shop', href: '/shop', badge: 'Soon' },
    ],
  },
  {
    title: 'Confessed',
    items: [
      { label: 'About', href: '/about' },
      { label: 'Statement of Faith', href: '/faith' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Follow',
    items: [
      { label: 'YouTube', url: 'https://www.youtube.com/@ConfessedFaith' },
      { label: 'X / Twitter', url: 'https://x.com/ConfessedFaith' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Privacy Policy', url: `${SITE_URL}/privacy` },
      { label: 'Terms of Service', url: `${SITE_URL}/terms` },
    ],
  },
]

export default function More() {
  return (
    <Screen>
      <View style={[pad, { paddingTop: 28 }]}>
        <Title text="{{Confessed}}" size={40} />
        <Text style={{ fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 2.2, color: colors.gold, marginTop: 6, marginBottom: 12 }}>
          REFORMED · CONFESSIONAL · GOSPEL-CENTRED
        </Text>
        {SECTIONS.map(sec => (
          <View key={sec.title} style={{ marginTop: 24 }}>
            <Label>{sec.title}</Label>
            {sec.items.map(i => (
              <Pressable
                key={i.label}
                onPress={() => (i.href ? router.push(i.href) : openUrl(i.url!))}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.borderSoft }}
              >
                <Text style={{ fontFamily: fonts.serif, fontSize: 24, color: colors.cream, flex: 1 }}>{i.label}</Text>
                {i.badge ? (
                  <Text style={{ fontFamily: fonts.sansBold, fontSize: 9, letterSpacing: 1.2, color: colors.gold, borderWidth: 1, borderColor: colors.goldBorder, borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2 }}>
                    {i.badge.toUpperCase()}
                  </Text>
                ) : (
                  <ChevronRight color={colors.faint} size={20} />
                )}
              </Pressable>
            ))}
          </View>
        ))}
        <View style={{ marginTop: 36 }}><Cross /></View>
      </View>
    </Screen>
  )
}
