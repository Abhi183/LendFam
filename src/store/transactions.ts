import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'

export type Transaction = {
  fromUid: string
  toUid: string
  amount: number
  interestRate: number
  note?: string
  status: 'proposed' | 'sent' | 'received' | 'repaid'
  createdAt: any
}

export async function recordTransaction(t: Omit<Transaction, 'createdAt'>) {
  await addDoc(collection(db, 'transactions'), { ...t, createdAt: Timestamp.now() })
}
