// Read-only Sanity client (ported from confessed-web/lib/sanity.ts)
const PROJECT_ID = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID ?? 'clfxgc6n'
const DATASET = process.env.EXPO_PUBLIC_SANITY_DATASET ?? 'production'
const API_VER = 'v2021-10-21'
const QUERY_URL = `https://${PROJECT_ID}.api.sanity.io/${API_VER}/data/query/${DATASET}`

export interface Resource {
  _id: string
  _createdAt: string
  title: string
  description: string
  type: string
  series: string | null
  fileUrl: string
}

export async function fetchPublishedResources(): Promise<Resource[]> {
  const groq = `*[_type == "resource" && published == true] | order(_createdAt desc) {
    _id, _createdAt, title, description, type, series,
    "fileUrl": file.asset->url
  }`
  const res = await fetch(`${QUERY_URL}?query=${encodeURIComponent(groq)}`)
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`)
  const data = await res.json()
  return (data.result ?? []) as Resource[]
}
