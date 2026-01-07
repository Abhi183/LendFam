import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { demoTransactions, makeDemoTimestamp } from './demoData'
import { addNotification } from './notifications'
import { fmtUSD } from '../utils/money'

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
    const notifyUid = t.fromUid === t.toUid ? null : (t.status === 'sent' ? t.toUid : t.fromUid)
    if (notifyUid) {
      const verb = t.status === 'sent'
        ? 'A loan was sent'
        : t.status === 'received'
          ? 'A loan was received'
          : 'You received a money request'
      await addNotification({
        toUid: notifyUid,
        title: t.status === 'proposed' ? 'New money request' : 'New lending record',
        message: `${verb} for ${fmtUSD(t.amount)} at ${t.interestRate}%.`,
        kind: 'transaction',
      })
    }
    return
  }

  await addDoc(collection(db, 'transactions'), { ...t, createdAt: Timestamp.now() })
}
