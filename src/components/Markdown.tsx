import Markdown from 'react-native-markdown-display'
import { colors, fonts } from '@/lib/theme'
import { openUrl } from './ui'

const styles = {
  body: { color: colors.muted, fontFamily: fonts.sans, fontSize: 17, lineHeight: 29 },
  heading1: { color: colors.cream, fontFamily: fonts.serif, fontSize: 30, marginTop: 28, marginBottom: 10 },
  heading2: { color: colors.cream, fontFamily: fonts.serif, fontSize: 25, marginTop: 26, marginBottom: 8 },
  heading3: { color: colors.cream, fontFamily: fonts.serif, fontSize: 21, marginTop: 22, marginBottom: 6 },
  paragraph: { marginTop: 0, marginBottom: 16 },
  strong: { color: colors.cream, fontFamily: fonts.sansSemi },
  em: { fontFamily: fonts.serifItalic, color: colors.cream },
  link: { color: colors.gold, textDecorationLine: 'underline' as const },
  blockquote: {
    backgroundColor: 'transparent', borderLeftWidth: 2, borderLeftColor: colors.gold,
    paddingLeft: 16, marginVertical: 16,
  },
  code_inline: { backgroundColor: colors.card, color: colors.gold, borderRadius: 4, paddingHorizontal: 4 },
  code_block: { backgroundColor: colors.card, color: colors.cream, borderColor: colors.border, padding: 12 },
  fence: { backgroundColor: colors.card, color: colors.cream, borderColor: colors.border, padding: 12 },
  hr: { backgroundColor: colors.border, height: 1, marginVertical: 24 },
  bullet_list_icon: { color: colors.gold },
  ordered_list_icon: { color: colors.gold },
  list_item: { marginBottom: 6 },
  image: { borderRadius: 8 },
}

export default function ArticleMarkdown({ children }: { children: string }) {
  return (
    <Markdown
      style={styles}
      onLinkPress={url => {
        openUrl(url)
        return false
      }}
    >
      {children}
    </Markdown>
  )
}
