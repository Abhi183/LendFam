export type DemoTimestamp = {
  toDate: () => Date
  seconds: number
}

export type DemoUserProfile = {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  bio?: string
  school?: string
  country?: string
  createdAt: DemoTimestamp
  updatedAt: DemoTimestamp
}

export const makeDemoTimestamp = (date = new Date()): DemoTimestamp => ({
  toDate: () => date,
  seconds: Math.floor(date.getTime() / 1000),
})

const seedTime = new Date(Date.now() - 1000 * 60 * 60 * 24)

export const demoUsers: Record<string, DemoUserProfile> = {
  'demo-001': {
    uid: 'demo-001',
    displayName: 'Avery Chen',
    email: 'avery@lendfam.app',
    photoURL: 'https://i.pravatar.cc/100?img=32',
    bio: 'CS major who loves building fintech tools.',
    school: 'UC Davis',
    country: 'United States',
    createdAt: makeDemoTimestamp(seedTime),
    updatedAt: makeDemoTimestamp(seedTime),
  },
  'demo-002': {
    uid: 'demo-002',
    displayName: 'Jordan Lee',
    email: 'jordan@lendfam.app',
    photoURL: 'https://i.pravatar.cc/100?img=12',
    bio: 'Studying economics and community lending.',
    school: 'UT Austin',
    country: 'United States',
    createdAt: makeDemoTimestamp(seedTime),
    updatedAt: makeDemoTimestamp(seedTime),
  },
}

export const demoPasswords: Record<string, string> = {
  'demo-001': 'lendfam2024',
  'demo-002': 'lendfam2024',
}

export const demoAuthUser = demoUsers['demo-001']

export const demoFriendRequests: Array<{
  id: string
  fromUid: string
  fromEmail: string
  fromName: string
  toEmail: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: DemoTimestamp
  updatedAt: DemoTimestamp
}> = []

export const demoFriendsByUser: Record<string, Set<string>> = {
  'demo-001': new Set([]),
  'demo-002': new Set([]),
}

export const demoPosts: Array<any> = [
  {
    id: 'demo-post-001',
    authorUid: 'demo-002',
    authorName: 'Jordan Lee',
    authorPhoto: 'https://i.pravatar.cc/100?img=12',
    type: 'loan_request',
    amount: 120,
    interestRate: 3,
    durationDays: 21,
    message: 'Need help with a short-term tuition gap. Happy to repay early.',
    visibility: 'friends',
    createdAt: makeDemoTimestamp(new Date(Date.now() - 1000 * 60 * 60 * 6)),
  },
  {
    id: 'demo-post-002',
    authorUid: 'demo-001',
    authorName: 'Avery Chen',
    authorPhoto: 'https://i.pravatar.cc/100?img=32',
    type: 'loan_offer',
    amount: 200,
    interestRate: 4,
    durationDays: 30,
    message: 'Offering a small cushion for campus expenses this month.',
    visibility: 'friends',
    createdAt: makeDemoTimestamp(new Date(Date.now() - 1000 * 60 * 60 * 1)),
  },
]

export const demoNotifications: Array<any> = []

export const demoTransactions: Array<any> = []
