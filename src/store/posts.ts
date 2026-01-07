import { Timestamp, addDoc, collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from '../firebase'

export type Post = {
  authorUid: string
  authorName: string
  authorPhoto?: string
  type: 'loan_request' | 'loan_offer'
  amount: number
  interestRate: number
  durationDays: number
  message: string
  visibility: 'friends' | 'fof' | 'public'
  createdAt: any
}

export async function createPost(p: Omit<Post, 'createdAt'>) {
  await addDoc(collection(db, 'posts'), { ...p, createdAt: Timestamp.now() })
}

export async function getLatestPostsForAuthors(authorUids: string[], max = 50) {
  if (authorUids.length === 0) return []
  // Firestore "in" supports up to 10 items. For MVP, we chunk.
  const chunks: string[][] = []
  for (let i = 0; i < authorUids.length; i += 10) chunks.push(authorUids.slice(i, i + 10))

  const all: any[] = []
  for (const c of chunks) {
    const q = query(
      collection(db, 'posts'),
      where('authorUid', 'in', c),
      orderBy('createdAt', 'desc'),
      limit(max),
    )
    const snaps = await getDocs(q)
    all.push(...snaps.docs.map((d) => ({ id: d.id, ...(d.data() as any) })))
  }
  all.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
  return all.slice(0, max)
}
