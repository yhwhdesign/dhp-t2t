# DHP T2T — Project State Doc
# Paste this at the top of a new Claude conversation to resume instantly.

---

## Start of session prompt
"I am building a browser-based parts transfer app called DHP T2T. Here is 
my project state doc — please read it and continue from exactly where we 
left off."

---

## Project identity
- App name: DHP T2T
- Platform: React single-page app, runs entirely in browser, no download
- Purpose: Field techs scan QR codes to log parts transfers, managers
  view history, PDFs emailed via daily summary
- Users: Field technicians + managers
- Auth: Supabase (PIN-based login for managers, warehouse number for techs)
- Database: Supabase (free PostgreSQL)
- Email: Resend (PDF delivery via daily summary only)
- QR: Generated and scanned natively in browser
- Deployment: Vercel (free)

## Tech stack — final decisions
- React (single-page app, scaffolded with Vite)
- Supabase — everything: users, parts, transfers, auth, row level security
- Resend — PDF email delivery via daily summary only
- QR codes over barcodes — scans on any phone, no special hardware
- html5-qrcode — library used for QR scanning in browser
- jspdf + jspdf-autotable — PDF generation in browser
- qrcode — QR code generation for label printing
- Supabase Edge Functions — middleman for Resend API calls (bypasses CORS)
- @vitejs/plugin-basic-ssl — HTTPS dev server for phone testing
- Auto-delete transfers after 30 days via Supabase scheduled function (planned)
- No backend server — everything runs in the browser
- NO Google Sheets — removed from stack, Supabase handles all data

## Supabase tables (all created and confirmed working)
- users — id, name, email, pin, role (tech, manager, or admin), active, created_at
- parts — id, part_number, description, qr_data, photo_url, created_at
- transfers — id, warehouse_number, tech_id, tech_name, notes, status, pdf_url, actioned_by, created_at
- transfer_items — id, transfer_id, part_id, part_number, description, quantity, created_at
- recipients — id, name, email, active, created_at
- return_requests — id, tech_id, tech_name, warehouse_number, reason, items (jsonb), status, pdf_url, actioned_by, created_at

## Supabase Storage
- Bucket: transfer-pdfs (private)
- Folder structure:
  - warehouse_return/<filename>.pdf
  - truck_transfer/<filename>.pdf
- Filename format: TechName_TransferType_YYYY-MM-DD_HH-MM_shortId.pdf

## Supabase Edge Functions
- send-approval-email — deployed and working
  - Supports single PDF (legacy) and multiple attachments (daily summary)
  - Receives: recipients, subject, htmlBody, and either pdfBase64+filename OR attachments array
  - Calls Resend API with PDF(s) attached
  - RESEND_API_KEY stored as Supabase secret
  - URL: https://<project-ref>.supabase.co/functions/v1/send-approval-email

## Transfer status flow
- pending → approved (manager approves, PDF regenerated, saved to storage, NO email)
- pending → cancelled (manager cancels, no email)
- Daily Summary → manager manually triggers combined PDF email to all active recipients

## Email flow
- Individual approvals do NOT send email
- Daily Summary tab generates two combined PDFs (truck transfers + warehouse returns)
  approved today and emails them to all active recipients in one email
- Manager can add optional notes to the daily summary email before sending

## User roles
- admin — full access including Manage Users tab, can add/edit/deactivate all users
- manager — access to all admin panel tabs except Manage Users
- tech — access to tech flow only (warehouse number entry, transfer or return)
- Login: admin and manager use email + PIN via ManagerLogin.jsx
  (.in('role', ['manager', 'admin']) query)
- Login: techs enter warehouse number only via TechFlow.jsx

## Test accounts in Supabase
- admin@dhp.com / PIN: 1234 / role: admin / name: Admin User
- tech@dhp.com / PIN: 5678 / role: tech / name: Test Tech

## Test parts in Supabase
- Part #: HV-4402 / Description: High Voltage Capacitor 440V 2MFD / qr_data: HV-4402

## Build stages
- [X] Stage 1 — Login screen + Supabase PIN auth. COMPLETE.
- [X] Stage 2 — Tech flow: Warehouse Return. COMPLETE.
- [X] Stage 3 — Tech flow: Start Transfer. COMPLETE.
- [X] Stage 4 — Admin panel: QR code generator + print PDF. COMPLETE.
- [X] Stage 5 — Admin panel: Transfer History + Recipients + Resend email. COMPLETE.
- [X] Stage 5b — Daily Summary tab with combined PDF email. COMPLETE.
- [X] Stage 5c — Manage Users tab (admin only). COMPLETE.
- [ ] Stage 6 — Polish, error handling, mobile optimization, PWA. IN PROGRESS.
- [ ] Stage 7 — Deploy to Vercel. NOT STARTED.

## Stage 7 build list
- [ ] Warehouse management — admin can add, edit, deactivate warehouse numbers
- [ ] TechFlow updated to pick from warehouse list instead of free-text

## External services
- [X] Supabase account created — project: dhp-t2t
- [X] Supabase tables created and confirmed working
- [X] Supabase Storage bucket created — transfer-pdfs
- [X] Supabase Edge Function deployed — send-approval-email
- [X] Resend account created — free plan, tested and working
- [ ] Resend domain verified (needed before production — currently using onboarding@resend.dev)
- [ ] Vercel account created at vercel.com (needed for Stage 7)

## Environment
- Node.js: v24
- npm: v11
- VS Code: v1.114.0
- Supabase CLI: installed via Homebrew
- Project folder: dhp-t2t
- Dev server: npm run dev → https://localhost:5173
- Phone testing: https://<your-mac-ip>:5173 (same WiFi, accept cert warning)
- GitHub repo: dev branch → Vercel preview URL (auto-builds on every push)
- GitHub repo: main branch → Vercel production URL (deploy by merging dev → main)
- Vercel: connected to GitHub repo, environment variables set

## Current file structure
dhp-t2t/
├── supabase/
│   └── functions/
│       └── send-approval-email/
│           └── index.ts              ← Edge function — calls Resend API
├── src/
│   ├── components/
│   │   └── PartPreviewModal.jsx      ← Part confirm modal with photo + qty selector
│   ├── lib/
│   │   ├── supabase.js               ← Supabase client
│   │   ├── generatePDF.js            ← generateTransferPDF + generateCombinedPDF
│   │   ├── generateLabelPDF.js       ← QR label generator (single + all sheet)
│   │   ├── uploadPDF.js              ← Supabase Storage upload + signed URL helper
│   │   └── sendEmail.js              ← Calls edge function to send daily summary email
│   ├── pages/
│   │   ├── LandingScreen.jsx         ← Branded landing: Tech or Management choice
│   │   ├── TechFlow.jsx              ← Tech: enter warehouse # → Transfer or Return
│   │   ├── ManagerLogin.jsx          ← Manager/Admin: email + PIN login
│   │   ├── StartTransfer.jsx         ← Truck transfer form (warehouse # pre-filled)
│   │   ├── WarehouseReturn.jsx       ← Return form (warehouse # pre-filled)
│   │   ├── AdminPanel.jsx            ← Manager panel with bottom nav
│   │   ├── AdminPendingTransfers.jsx ← Pending: edit + approve + cancel (no email)
│   │   ├── AdminTransferHistory.jsx  ← History: approved + cancelled, expandable
│   │   ├── AdminManageParts.jsx      ← Parts list + add + QR generator + print
│   │   ├── AdminRecipients.jsx       ← Recipients CRUD + active toggle
│   │   ├── AdminDailySummary.jsx     ← Daily summary + combined PDF email
│   │   └── AdminManageUsers.jsx      ← Admin only: add/edit/deactivate all users
│   ├── App.jsx                       ← Routes: landing → tech or manager/admin flow
│   └── index.css                     ← Global reset styles
├── index.html                        ← viewport meta: user-scalable=no (zoom fix)
├── vite.config.js                    ← HTTPS enabled via @vitejs/plugin-basic-ssl
├── .env                              ← VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
└── package.json

## Key UX decisions made
- Landing screen: blurred DH Pace facility background, white overlay, logo centered,
  two cards — Field Technician and Management
- Tech flow: enter warehouse number once → two buttons: Transfer to Truck / Return to Warehouse
  warehouse number is pre-filled in both forms, not shown again
- Manager/Admin flow: email + PIN login → admin panel with premium bottom nav
- Bottom nav icons: 🕐 Pending / 🗂 History / 📦 Parts / 📤 Daily / 📬 Recipients / 👤 Users (admin only)
- Part search: live debounced search as tech types (500ms), modal on match
- QR scan also triggers part confirmation modal on match
- Modal shows part photo (or placeholder), part # and description, quantity +/- selector
- PDF filenames are human-readable: TechName_TransferType_Date_ShortId.pdf
- PDFs stored in Supabase Storage
- Manager can edit qty/part numbers, preview PDF, then approve or cancel
- Approve regenerates PDF and saves to storage — NO email fired on individual approval
- Daily Summary: manager clicks Send Daily Transfers to email combined PDFs for today
- Combined PDFs include all transfers approved today — one for truck, one for warehouse
- Transfer History: two sub-tabs (Truck / Warehouse), expandable rows, shows actioned_by
- Recipients tab: add/remove/toggle active — only active recipients receive daily emails
- Email from onboarding@resend.dev (temp until domain verified)
- Mobile viewport fixed: user-scalable=no prevents unwanted zoom
- HTTPS dev server enabled for phone QR testing via @vitejs/plugin-basic-ssl
- Supabase CLI installed via Homebrew (sudo npm install -g failed on Mac)
- Manage Users tab visible to admin role only, hidden from manager role

## Admin Panel tabs — build status
- [X] Pending Transfers — fully built and working (no email on approve)
- [X] Transfer History — fully built and working
- [X] Manage Parts — fully built and working
- [X] Daily Summary — fully built and working
- [X] Manage Users — fully built, admin only
- [X] Recipients — fully built and working

## Stage 6 — remaining work
- [ ] Consolidate all CSS into one global stylesheet (src/styles.js or styles.css)
      — commented by page and section, replacing all inline style objects in every .jsx file
- [ ] Build page commentary doc (PAGES.md) — one entry per page describing what it does
      and what each section/function handles
- [ ] Bulk parts import from Excel/Google Sheets (generates QR codes automatically)
- [ ] PWA support — Add to Home Screen on iOS/Android
- [ ] Pre-deployment checklist and .gitignore review
- [ ] Auto-delete transfers after 30 days (Supabase scheduled function)

## Stage 7 — deployment
- [ ] Create Vercel account at vercel.com
- [ ] Connect GitHub repo to Vercel
- [ ] Set environment variables in Vercel dashboard
- [ ] Verify Resend domain before go-live
- [ ] Final smoke test on mobile

## Open questions / decisions still to make
- Whether techs can view their own transfer history
- Location picker for techs (planned future feature — currently just warehouse number)
- Role-based manager permissions (some managers can add/remove other managers — future)
- Color scheme / branding refinements
- App icon
- PWA details

## Key notes
- Separate project from Caps (macOS screen recorder)
- Caps has its own PROJECT_STATE.md — keep these two docs separate
- Two services total: Supabase + Resend. That's it.
- .env file must never be committed to git — add to .gitignore before deploying
- No backend server — all logic runs in browser via Supabase anon key
- DH Pace logo URL: https://www.dhpace.com/wp-content/uploads/2026/01/DHP-100-Years-RGB_FULL-COLOR_368x60px.jpg
- Background image URL: https://www.dhpace.com/wp-content/uploads/2017/11/distribution-logistics-doors.jpg
- Resend free plan limit: 100 emails/day, sends only to verified email until domain verified
- Phone testing requires HTTPS — use Network URL from npm run dev output
- CSS consolidation and PAGES.md doc are the final two polish tasks before deployment prep

## Supabase key notes to remember
- Supabase Edge Function JWT verification must be TURNED OFF on send-approval-email
  function — found in Supabase Dashboard → Edge Functions → send-approval-email → settings
  (401 Unauthorized error is the symptom when this is accidentally turned on)

## Stage 7 — First Run Setup Wizard + Deployment

### Deployment
- [X] Create Vercel account at vercel.com
- [X] Connect GitHub repo to Vercel — dev branch auto-deploys to preview URL
- [X] Set environment variables in Vercel dashboard
- [ ] Verify Resend domain before go-live
- [ ] Final smoke test on mobile

### First Run Setup Wizard
Each deployed instance of DHP T2T should detect if it has been initialized.
If not, it runs a setup wizard before allowing normal app use.

Setup wizard steps (in order):
1. Welcome screen — app name, DH Pace branding
2. Create main admin account (name, email, PIN)
3. Set up location/warehouse info (location name, address, identifiers)
4. Bulk parts import (Excel or CSV — part number, description, QR data)
5. Set up tech warehouse numbers (list of valid warehouse numbers for this location)
6. Optional — add additional managers
7. Optional — add email recipients for daily summary
8. Finalize setup — marks instance as initialized in Supabase

### How initialization is detected
- A settings table in Supabase with a single row
- Contains: initialized (boolean), location_name, setup_completed_at, setup_by
- App checks this on first load — if no row or initialized = false → show wizard
- After wizard completes → sets initialized = true

### New Supabase table needed
- settings — id, initialized, location_name, location_address, setup_completed_at, setup_by

### Bulk parts import (moved from Stage 6)
- Accepts Excel (.xlsx) or CSV
- Columns: part number, description, QR data
- Shows preview table with delete icons per row
- Imports all remaining rows to parts table
- Used during first-run setup AND available in Manage Parts for ongoing imports

### Tech warehouse numbers
- A new table: warehouses — id, warehouse_number, location, active, created_at
- During setup: admin enters all valid warehouse numbers for this location
- Tech flow: instead of free-text warehouse number, tech picks from the list
- This replaces the free-text warehouse entry on TechFlow.jsx

## Open questions for Stage 7
- Will each location have its own Supabase project or share one?
  (Separate projects = true isolation, shared = easier management)
- Will the Vercel URL be the same for all locations or unique per location?
- Should the setup wizard be lockable — ie only accessible once and then hidden?
- What warehouse/location info needs to be captured during setup?

- warehouses — id, warehouse_number, location, active, created_at
  - Admin can add, edit, and deactivate warehouse numbers
  - Managed via a new Warehouses tab or section in Manage Users (admin only)
  - Tech flow pulls from this table instead of free-text entry
  - If a warehouse number is deactivated, techs can no longer select it