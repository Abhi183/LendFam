import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { demoTransactions, makeDemoTimestamp } from './demoData'

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
  if (!db) {
    demoTransactions.unshift({
      id: `demo-transaction-${Date.now()}`,
      ...t,
      createdAt: makeDemoTimestamp(),
    })
    return
  }

  await addDoc(collection(db, 'transactions'), { ...t, createdAt: Timestamp.now() })
}
