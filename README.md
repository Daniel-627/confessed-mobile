# confessed-mobile

Expo (React Native) port of `confessed-web`. The contributor portal is **not** part of this app; contributor and apply links open `contribute.confessed.faith` in the in-app browser.

## Run
```powershell
npm install
copy .env.example .env      # then fill EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
npx expo start
```
Use a development build for Google sign-in: `npx expo run:android` or EAS Build.

## Screens (web → mobile)
| Web | Mobile |
|---|---|
| `/` | Home tab |
| `/articles`, `/articles/[slug]` | Articles tab, `article/[slug]` |
| `/resources` (Sanity) | Resources tab |
| `/dashboard` | Account tab (profile + preferences) |
| `/sign-in`, `/sign-up` | Modals (email + password + code, Google) |
| `/about`, `/statement-of-faith`, `/contact` | More tab |
| `/videos`, `/podcasts`, `/shop` | Coming-soon screens |
| `/privacy`, `/terms` | Open on the website |

## Notes
- Clerk uses `@clerk/expo`. Add `confessed://` to the Clerk dashboard's allowed redirect URLs for OAuth.
- API: the same `confessed-api`. Native requests are not subject to CORS.
- Static copy lives in `src/lib/content.ts`.
- `punycode` is installed because `markdown-it` requires it and React Native has no built-in one.
- Not yet done: Apple sign-in (required by App Store rules once Google sign-in is offered), push tokens, Bible reader.
