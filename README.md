# LendFam (MVP website)

A green “money” themed, fully functional React + Firebase web app for **student-to-student social lending**:
- Google Sign-in
- Profiles (bio, school, country)
- Add friends (by email), accept requests
- Feed: post loan requests/offers with interest rate + duration
- Friends-of-friends discovery
- “Send / Receive” records (as transactions) to track lending

> This is an MVP. It is production-structured, but you should still add compliance, KYC/AML, payment rails, and stronger security rules before real money.

---

## 1) Quick start

1. Create a Firebase project: Firebase Console → **Add app (Web)**
2. Enable **Authentication → Sign-in method → Google**
3. Create Firestore database (Native mode)
4. Copy `.env.example` to `.env` and fill the values from Firebase “Web app config”.

Then run:

```bash
npm install
npm run dev
```

Open the URL shown in the terminal.

---

## 2) Firestore data model (simple)

- `users/{uid}`
- `users/{uid}/friends/{friendUid}`
- `friendRequests/{requestId}`
- `posts/{postId}`
- `transactions/{txId}`

---

## 3) Firestore Security Rules (starter)

Use these as a starting point and harden them:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isMe(uid) { return request.auth != null && request.auth.uid == uid; }

    match /users/{uid} {
      allow read: if isSignedIn();
      allow create: if isMe(uid);
      allow update: if isMe(uid);
      allow delete: if false;

      match /friends/{friendUid} {
        allow read: if isSignedIn();
        allow write: if isMe(uid);
      }
    }

    match /friendRequests/{id} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn();
      allow delete: if false;
    }

    match /posts/{id} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn();
      allow delete: if false;
    }

    match /transactions/{id} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn();
      allow delete: if false;
    }
  }
}
```

---

## 4) Deploy

### Netlify / Vercel / Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- Add the same `.env` variables in your hosting dashboard.

---

## 5) Notes / Next upgrades
- Real payments: Stripe, Dwolla, or bank transfers (country-dependent)
- Credit/repayments + schedules
- Ratings, trust score, reporting, dispute resolution
- Privacy controls: friends vs friends-of-friends vs campus-only
- Notifications (Firebase Cloud Messaging)
