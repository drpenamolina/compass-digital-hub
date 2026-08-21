# COMPASS Digital Hub

A mobile-first reference portal for J-1 visa-holding medical residents (IMGs) at UTRGV/HCA
Internal Medicine. Full product spec lives outside this repo — see
`COMPASS_Digital_Hub_Dev_Spec.md` shared with the team.

Built with Next.js (App Router, TypeScript, Tailwind CSS) and Firebase (Firestore + Auth).

## Status

This first pass scaffolds the full site navigation and builds out the two highest-priority
features end-to-end:

- **Anticipatory Action Matrix** (`/matrix`, admin at `/admin/matrix`) — filterable by PGY year
  and transition type, with review/expiry logic and per-resident self-tracking.
- **Resource Directory** (`/resources`, admin at `/admin/resources`) — categorized directory with
  the same review/expiry treatment.

`/navigate`, `/belong`, `/cope`, and the buddy-group part of `/restore` are skeleton pages ready
to be filled in next. The static Rapid-Response Protocol on `/restore` is fully built since it's
static content per the spec.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase web app config:

```bash
cp .env.local.example .env.local
```

## Connecting Firebase

This app expects an existing Firebase project (Firestore + Auth enabled, Email/Password sign-in
method turned on).

1. Log in to the Firebase CLI (opens a browser for Google OAuth — must be done interactively by
   whoever owns the project):

   ```bash
   npx firebase-tools login
   npx firebase-tools projects:list
   npx firebase-tools use --add
   ```

2. Fill the real config values (Project settings → General → Your apps → Web app) into
   `.env.local`.

3. Deploy the Firestore security rules:

   ```bash
   npx firebase-tools deploy --only firestore:rules
   ```

4. Seed the allowlist: add a document per approved resident email to the `allowedEmails`
   collection (document ID = lowercased email) so they can create an account on `/login`. Create
   at least one `users/{uid}` document with `role: "reviewer"` or `role: "admin"` (after that
   person signs up once as a resident) to unlock `/admin`.

## Deploying

Static export + Firebase Hosting:

```bash
npm run build
npx firebase-tools deploy --only hosting
```

## Data model

See `src/types/index.ts` for `MatrixItem`, `ResourceEntry`, and `UserProfile`. Firestore security
rules (`firestore.rules`) enforce: residents can read published content and toggle only their own
key in a Matrix item's `residentSelfTrack` map; only `reviewer`/`admin` roles can create, edit, or
publish content. The `buddyGroups` collection is intentionally locked down (`allow read, write: if
false`) until that feature is built, per the spec's requirement to keep buddy/emergency contact
data access-controlled separately from general resource content.

## Design system

Institutional, not consumer-app: neutral background, white cards with hairline borders and 12px
radius, no shadows, single navy accent (`#123A5E`), sentence case copy, Tabler outline icons. See
`src/app/globals.css` for tokens and `src/components/ui/` for the base components.
