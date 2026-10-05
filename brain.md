# 🧠 SehatSaathi Knowledge Brain (`brain.md`)

> **Single Source of Truth** for AI Assistants and Developers working on the **SehatSaathi** codebase.  
> *Read this file to get full structural, architectural, and operational context without scanning the entire repository.*

---

## 1. Executive Summary & Purpose

**SehatSaathi** ("Health Companion") is a rural healthcare web application designed specifically for low-connectivity, vernacular-first Indian rural contexts.

### Primary Objectives:
- **Vernacular Health Literacy & Education**: Myth-busting flip cards, audio guides, simple tutorials, and offline-ready health advice.
- **Doctor Consultation & Q&A**: Community Q&A forum with verified doctor replies.
- **Real-Time Emergency Response & SOS**: 1-click 108 ambulance dispatch, n8n webhook signaling with GPS coordinates, and real-time hospital bed/ETA tracking.
- **Hospital & Clinic Locator**: Dual mapping system (Leaflet + OpenStreetMap + Overpass API with OSRM routing preview, plus Google Places API locator).
- **AI Health Assistant / Myth Buster**: WhatsApp-style floating chatbot powered by Gemini 1.5 Flash via Supabase Edge Functions.

---

## 2. Tech Stack & Environment

| Layer | Technologies | Notes |
|---|---|---|
| **Framework** | React 18.3.1 | Functional components with Hooks |
| **Bundler & Dev Server** | Vite 7.1.12 | Runs locally on port `8080` (or dynamic Vite port) |
| **Language** | TypeScript 5.8 | Static typing with flexible rules (`noImplicitAny: false`) |
| **Styling** | Tailwind CSS 3.4 + PostCSS | Config in `tailwind.config.cjs`; custom fonts: Open Sans & Poppins |
| **Component Library** | Shadcn UI (Radix UI primitives) | Cards, Dialogs, Tabs, Buttons, Sheets, Toasts |
| **Animations** | Framer Motion 12.34 + `tailwindcss-animate` | Magnetic buttons, 3D flip cards, signal flow diagrams |
| **Icons** | Lucide React | Clean, scalable vector icons |
| **Routing** | React Router DOM v6.30 | Client-side routing with `BrowserRouter` in `src/App.tsx` |
| **Server State** | TanStack React Query v5.83 | Query client wrapper in root |
| **Internationalization** | `i18next` + `react-i18next` + `i18next-http-backend` | 8 languages: `en`, `hi`, `mr`, `bn`, `te`, `ta`, `or`, `pa` |
| **Speech (TTS)** | Custom `SpeechService` (Web Speech API) | BCP 47 mappings (e.g. `hi-IN`, `te-IN`), Marathi falls back to Hindi |
| **Backend & DB** | Supabase (PostgreSQL + Realtime + Edge Functions) | **Dual Supabase setup** (see Section 3) |
| **Maps & Routing** | Leaflet + OpenStreetMap + Overpass API + OSRM | No API key required for main map; Google Maps used for directions |
| **Automation** | n8n Webhook | Emergency signal dispatch |

---

## 3. Dual-Project Supabase Architecture (CRITICAL)

The codebase interacts with **two separate Supabase projects**. Antigravity agents must know which client to use:

### Project A: Main App Project (`nqiyyailhxmavrcokrmv`)
- **URL**: `https://nqiyyailhxmavrcokrmv.supabase.co`
- **Client**: `src/integrations/supabase/client.ts` -> export `supabase`
- **Uses**:
  - `patient_access` (Custom patient auth)
  - `health_forum` (Ask Doctor community questions)
  - `doctor_access` (Doctor credentials & profiles)
  - `Hospital_Responses` (Emergency SOS live tracking; **Note capitalized table name!**)
  - Legacy/template tables: `user_progress`, `badges`, `health_tips`, `doctor_questions`
  - Edge Functions: `ask-doctor`, `get-dashboard`, `get-tips`, `nearby-hospitals`, `save-progress`

### Project B: Chatbot AI Engine (Groq Fast LLM / Dedicated Isolation)
- **Primary AI Provider**: **Groq API** (`https://api.groq.com/openai/v1/chat/completions`)
- **Key**: Configured in `.env` via `GROQ_API_KEY` and `VITE_GROQ_API_KEY` (`gsk_...`).
- **Model**: `openai/gpt-oss-120b` (with auto-fallback to `openai/gpt-oss-20b`).
- **Service**: [src/services/ChatService.ts](file:///c:/Users/bajpa/OneDrive/Documents/projects/Sehat-Saathi/src/services/ChatService.ts) provides `askHealthChatbot(message)` with sub-second response times and bilingual output (English + Devanagari Hindi).
- **Edge Function Fallback**: `supabase/functions/health-chat` also updated with Groq support and Gemini fallback.

---

## 4. Database Schema & Tables

### Active Core Tables (PostgreSQL / Supabase)

#### 1. `patient_access`
Used by `src/contexts/AuthContext.tsx` for custom authentication:
- `id` (UUID / Primary Key)
- `full_name` (text)
- `username` (text, unique)
- `password` (text, plain text in current prototype)

#### 2. `health_forum`
Used by `src/pages/AskDoctor.tsx`:
- `id` (UUID)
- `patient_name` (text)
- `category` (text)
- `question_text` (text)
- `answer_text` (text, nullable)
- `answered_at` (timestamptz, nullable)
- `location` (text, nullable)
- `is_answered` (boolean)
- Foreign relationship: `doctor_access` (joins on `doctor_id` / relation) -> provides `full_name`

#### 3. `doctor_access`
Doctor directory & emergency contact info:
- `id` (UUID)
- `full_name` (text)
- `contact` (text, phone number)
- `loc_lat` (numeric)
- `loc_long` (numeric)

#### 4. `Hospital_Responses` ⚠️ *(Case-Sensitive Name!)*
Used by `src/components/EmergencyResponseSheet.tsx`:
- `response_id` (UUID / text)
- `emergency_id` (text / UUID, foreign filter from webhook)
- `hospital_name` (text)
- `bed_availability` (boolean: `true` = Available, `false` = Full)
- `medical_advice` (text)
- `eta` (text, e.g., "12 mins")
- `responded_at` (timestamptz)
- Join: `doctor_access(contact, loc_lat, loc_long)` via **LEFT JOIN**

#### 5. Legacy / Profile Tables (`supabase/migrations/`)
- `user_progress`: Track modules completed (`user_id`, `module_name`, `module_category`, `progress_percentage`, `completed_at`).
- `badges`: Earned badges (`user_id`, `badge_type`, `badge_name`, `badge_icon`, `milestone_value`).
- `health_tips`: English and Hindi tips (`tip_english`, `tip_hindi`, `category`, `priority`).
- `doctor_questions`: Original Lovable schema for questions.

---

## 5. Application Routing & Pages Directory (`src/pages/*`)

Defined in [src/App.tsx](file:///c:/Users/bajpa/OneDrive/Documents/projects/Sehat-Saathi/src/App.tsx):

| Route | Component | Purpose & Architecture |
|---|---|---|
| `/` | `Home.tsx` | Modern landing page rendering `ValleyHero`, `WhatValleyDoes`, `ValleyFeatures`, and `ValleyCTA`. Features animated signal flow diagram. |
| `/education` | `Education.tsx` | Visual library of 9 health modules (Hygiene, Vaccination, Nutrition, etc.) with Unsplash imagery, dialog popups, covered topics, and TTS buttons. |
| `/literacy` | `Literacy.tsx` | Interactive digital healthcare tutorials (Booking appointments, telemedicine, online payments). Features a linear gradient "water-fill" progress card effect and checklist dialogs. |
| `/misconceptions` | `Misconceptions.tsx` | 3D flip-card myth-busting game. Front displays red Myth; clicking flips to green verified Fact + health tips + video link + audio speech button. |
| `/dashboard` | `Dashboard.tsx` | User profile, modules completed, badges progress bar, and achievement cards. *(Note: currently calls `supabase.auth.getUser()`)* |
| `/ask-doctor` | `AskDoctor.tsx` | Medical query submission form (requires login via `AuthContext`). Below form is the live Community Q&A feed showing doctor-verified answers from `health_forum`. |
| `/hospital-finder` | `HospitalFinder.tsx` | **Main active hospital finder**. Integrates `HospitalMap.tsx` (Leaflet, Overpass API, OSRM routing preview, Google Maps redirect, 108 emergency dial button). |
| `/locator` | `HealthLocator.tsx` | Alternative Google Maps JavaScript API locator using `nearby-hospitals` edge function. |
| `/emergency` | `Emergency.tsx` | Emergency helplines (108 Ambulance, 112 National, 1091 Women, 1098 Child), nearby CHC/hospital cards, and first aid tips. |
| `/login` | `Login.tsx` | Patient sign-up / sign-in switching screen connecting to `patient_access` table via `AuthContext`. |
| `*` | `NotFound.tsx` | 404 fallback page. |

---

## 6. Components Architecture (`src/components/*`)

### Global / Layout Components
- **`Navbar.tsx`**: Sticky top navigation with desktop magnetic spotlight buttons (`NavButtonWithSpeech`), active state styling, mobile slide-out `Sheet`, language switcher, dark mode toggle, and login/logout state badge.
- **`HealthTipsBanner.tsx`**: Top cycling ticker (every 8 seconds) fetching health tips via `get-tips` edge function with audio speech support.
- **`WelcomePopup.tsx`**: Automatic first-visit modal explaining health myths with `localStorage` persistence (`hasSeenHealthMythsPopup`).
- **`HealthChatbot.tsx` & `ChatInterface.tsx`**: WhatsApp-styled floating chat bubble (`bottom-28 right-6`) that connects to project `ymcejzgkvlxepjaihqzs` and Gemini 1.5 Flash via `health-chat` edge function. Formats responses into True/False verdict, English, and Hindi.
- **`SOSButton.tsx`**: Persistent floating red/orange button (`bottom-6 right-6`). Long-press triggered with audio feedback (`useLongPressSpeech`). Opens full-screen `EmergencyAccessTab`.

### Emergency System Components
- **`EmergencyAccessTab.tsx`**: Responsive container (Tabs on mobile, two-column grid on desktop). Form on left, live response sheet on right.
- **`EmergencyForm.tsx`**: Captures patient name, emergency type (e.g. Snake Bite, Heart Attack, Heavy Bleeding), custom description, and GPS coordinates. Posts to n8n webhook: `https://n8n-qi63.onrender.com/webhook/emergency-trigger`.
- **`EmergencyResponseSheet.tsx`**: Real-time hospital response viewer. Subscribes to Supabase Realtime channel `hospital_replies` on `Hospital_Responses` table. Includes 1-second interval fallback polling if websocket channel is connecting or failed. Displays bed availability badge, hospital advice, ETA, call doctor button, and Google Maps navigate link.

### Map & Geo Components
- **`HospitalMap.tsx`**:
  - Dynamically loads Leaflet CSS/JS, Leaflet Routing Machine, and Leaflet MarkerCluster.
  - Queries Overpass API (`[out:json]; node["amenity"="hospital"](around:radius, lat, lng); out center;`).
  - Renders user location (blue marker), hospitals (red markers), and clustered pins.
  - Interactive popup with **"⚡ Preview Route"** (OSRM client routing) and **"🗺️ Google Maps"** navigation.
  - Radius selector (5km to 100km).

---

## 7. Contexts, Hooks, and Services

### Contexts (`src/contexts/*`)
- **`AuthContext.tsx`**:
  - Custom patient session management.
  - Reads/writes to `localStorage` key `"sehatsaathi_patient"`.
  - Queries `patient_access` table in Supabase.
  - Provides `user` (`{ id, name, username }`), `login`, `signup`, `logout`, `isLoading`.
- **`LanguageContext.tsx`**:
  - Bridges React state with `i18next`.
  - Synchronizes active language across components.

### Services (`src/services/*`)
- **`SpeechService.ts`**:
  - Encapsulates `window.speechSynthesis`.
  - Maps i18n language codes to BCP 47 tags (`en` -> `en-IN`, `hi` -> `hi-IN`, `bn` -> `bn-IN`, `te` -> `te-IN`, `ta` -> `ta-IN`, `mr` -> `mr-IN`, `pa` -> `pa-IN`, `or` -> `or-IN`).
  - **Fallback Rule**: Marathi (`mr`) falls back to Hindi (`hi`). Other unsupported languages remain silent rather than speaking broken English.
  - Rate: 0.9, Pitch: 1.0 (calm tone for accessibility).

### Custom Hooks (`src/hooks/*`)
- **`useLongPressSpeech.ts`**: Handles button long-press (800ms) with vibration feedback (`navigator.vibrate(50)`) and speaks button labels aloud for low-literacy users. Differentiates normal clicks from long-press actions.
- **`use-mobile.tsx`**: Responsive breakpoint detection (< 768px).
- **`use-toast.ts`**: Toast notification dispatcher.

---

## 8. Supabase Edge Functions (`supabase/functions/*`)

Run on Deno / Supabase Functions runtime:

| Function | Runtime / AI Model | Key Logic |
|---|---|---|
| `health-chat` | Gemini 1.5 Flash | Medical myth-busting & query analysis. Returns strictly structured Status (TRUE/FALSE), English explanation, Hindi explanation. |
| `triage-assist` | Gemini 1.5 Flash | Analyzes body parts & symptoms for rural users. Returns severity ("Low"\|"Medium"\|"High"), Google Maps search term, and English/Hindi first-aid steps. |
| `ask-doctor` | Lovable AI / Gemini 2.5 Flash | Inserts into `doctor_questions`, generates advice under 150 words, updates row status to `answered`. |
| `get-dashboard` | Supabase Postgres | Authenticates user and fetches `user_progress` and `badges`. |
| `get-tips` | Supabase Postgres | Selects active health tips ordered by priority. |
| `nearby-hospitals`| Google Places API | Calls `maps.googleapis.com/maps/api/place/nearbysearch/json` with distance/specialty ranking. |
| `save-progress` | Supabase Postgres | Upserts `user_progress` and awards milestone badges (at 3, 5, 10 completed modules). |

---

## 9. Third-Party Integrations & External Endpoints

1. **n8n Emergency Webhook**:  
   `https://n8n-qi63.onrender.com/webhook/emergency-trigger`  
   Triggered on SOS submission. Delivers patient location & triage details to hospital dispatch workflows.
2. **OpenStreetMap Overpass API**:  
   `https://overpass-api.de/api/interpreter`  
   Executes Overpass QL queries for hospitals, CHCs, and clinics without requiring billing or API tokens.
3. **OSRM (Open Source Routing Machine)**:  
   Via `leaflet-routing-machine` for free, instant driving route previews.
4. **Google Gemini API**:  
   Generates vernacular health analysis and myth-busting via `health-chat` and `triage-assist`.

---

## 10. Critical Quirks, Gotchas & Historical Bug Fixes

When modifying code, **be aware of these historical points**:
1. **Case-Sensitive Table Name**: The database table for hospital replies is **`Hospital_Responses`** (capitalized). Querying `hospital_responses` will fail.
2. **Join Strategy on Responses**: `Hospital_Responses` must use a **LEFT JOIN** on `doctor_access` (i.e. `.select("*, doctor_access(...)")`). Do NOT enforce an inner join (`!responded_by_id`), or automated responses without assigned doctors will be hidden from the user.
3. **Dual Client Awareness**: If editing `ChatInterface.tsx`, note that it connects to `https://ymcejzgkvlxepjaihqzs.supabase.co`. Other app features connect to `https://nqiyyailhxmavrcokrmv.supabase.co`.
4. **Auth Discrepancy**:
   - `Login.tsx` and `AuthContext.tsx` manage users via the `patient_access` table in `localStorage` under key `"sehatsaathi_patient"`.
   - `Dashboard.tsx` was generated from a template using `supabase.auth.getUser()`. If someone is logged in via `patient_access`, `supabase.auth.getUser()` will return null unless unified.
5. **Service Worker Disabled**: `public/sw.js` and `registerServiceWorker()` in `src/main.tsx` were disabled because the service worker was caching and intercepting API calls to Supabase, resulting in network errors.
6. **TTS Navigation Cancel**: In `src/App.tsx`, `StopSpeakingOnNavigation` listens to `location` changes and calls `speechService.stop()`. This prevents audio from previous pages from continuing to play when navigating.

---

## 11. Useful Commands

```bash
# Start local development server (port 8080 or next available)
npm run dev

# Build for production
npm run build

# Run ESLint checks
npm run lint

# Deploy Edge Functions to Supabase Project (Project A)
npx supabase functions deploy health-chat --project-ref nqiyyailhxmavrcokrmv
npx supabase functions deploy triage-assist --project-ref nqiyyailhxmavrcokrmv

# Deploy Edge Functions to Chatbot Project (Project B)
npx supabase functions deploy health-chat --project-ref ymcejzgkvlxepjaihqzs
```
