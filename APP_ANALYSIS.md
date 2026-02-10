# SehatSaathi App Analysis

## 📱 Visible Tabs & Functionality
Here is an explanation of the visible sections of the application relative to the UI (Navigation & Features):

### 1. Login (`/login`)
*   **What it calls**: `src/pages/Login.tsx`
*   **What it does**: User authentication entry point. Integrated with Supabase Auth.
*   **Tech Stack**:
    *   **Auth**: Supabase Auth (`AuthProvider` context).
    *   **UI**: Shadcn Forms, Validation (likely Zod/React Hook Form based on `package.json`).

### 2. Home (`/`)
*   **What it calls**: `src/pages/Home.tsx`
*   **What it does**: The landing page of the application. It features a "Hero" section with a call to action to explore education or healthcare. It highlights key features (Education, Literacy, Voice support) using valid cards. It includes a prominent "Health Myths" flip-card widget that leads to the Misconceptions page. It also showcases impact statistics and the project vision.
*   **Tech Stack**:
    *   **UI**: Shadcn UI (Cards, Buttons), Lucide Icons, Custom CSS Gradients.
    *   **Routing**: `react-router-dom` (`Link` components).
    *   **Translation**: `react-i18next` (`useTranslation`).

### 2. Education (`/education`)
*   **What it calls**: `src/pages/Education.tsx`
*   **What it does**: A library of health education modules (e.g., Hygiene, Vaccination, Nutrition, Mental Health). Users see a grid of topics with images. Clicking a topic opens a detailed pop-up (Dialog) with an overview, covered sub-topics, and audio support.
*   **Tech Stack**:
    *   **State**: `useState` (for managing selected topic dialog).
    *   **UI**: Shadcn UI (`Dialog`, `Card`), Tailwind Grid.
    *   **Features**: Custom `AudioIcon` component for Text-to-Speech (TTS).
    *   **Assets**: Unsplash images for dynamic content.

### 3. Literacy (`/literacy`)
*   **What it calls**: `src/pages/Literacy.tsx`
*   **What it does**: Teaches digital health literacy skills (e.g., "How to use health apps", "Booking appointments", "Online payments"). It presents tutorials with difficulty levels (Beginner, Intermediate) and step-by-step instructions. It tracks "progress" visually (mock data).
*   **Tech Stack**:
    *   **Data Structure**: Array of tutorial objects with steps.
    *   **UI**: Shadcn `Badge` for difficulty levels, `Card` for layout.
    *   **Logic**: Helper function `getLevelColor` for dynamic styling.

### 4. Misconceptions (`/misconceptions`)
*   **What it calls**: `src/pages/Misconceptions.tsx`
*   **What it does**: An interactive page to debunk health myths. It uses a 3D "Flip Card" interaction: the front shows the "Myth" (with a cross icon), and clicking it flips the card to reveal the "Fact" (with a checkmark) and a helpful tip on the back.
*   **Tech Stack**:
    *   **Animation**: CSS 3D Transforms (`perspective`, `rotate-y-180`, `backface-hidden`) for the flip effect.
    *   **State**: Local state per card to track flip status.
    *   **Audio**: Integrated TTS for reading myths/facts aloud.

### 5. Dashboard (`/dashboard`)
*   **What it calls**: `src/pages/Dashboard.tsx`
*   **What it does**: A user profile area that tracks learning progress. It shows statistics (Modules completed, Badges earned), a progress bar for the overall course, and a list of earned achievements/badges.
*   **Tech Stack**:
    *   **Backend**: **Supabase**. Uses `supabase.auth.getUser()` to identify the user and `supabase.functions.invoke('get-dashboard')` to fetch analytics data.
    *   **UI**: Recharts (or Shadcn `Progress` bar), `Badge` component.
    *   **State Management**: React `useEffect` for data fetching.

### 6. Ask Doctor (`/ask-doctor`)
*   **What it calls**: `src/pages/AskDoctor.tsx`
*   **What it does**: A form where users can ask health-related questions. It categorizes questions (General, Nutrition, etc.) and provides an AI-generated (or backend-processed) response.
*   **Tech Stack**:
    *   **Backend**: **Supabase Edge Functions**. specific call to `supabase.functions.invoke('ask-doctor')`.
    *   **Form**: React State for form inputs (not React Hook Form here, just controlled inputs).
    *   **UI**: Shadcn `Textarea`, `Select`, `Input`.

### 7. Live Map / Hospital Finder (`/hospital-finder`)
*   **What it calls**: `src/pages/HospitalFinder.tsx` & `src/components/HospitalMap.tsx`
*   **What it does**: Displays a live map of nearby hospitals based on the user's geolocation. Key features include:
    *   Locating the user (Blue dot).
    *   Finding hospitals within a radius (Red markers).
    *   Previewing a route to a hospital (OSRM integration).
    *   Redirecting to Google Maps for actual navigation.
*   **Tech Stack**:
    *   **Map Engine**: **Leaflet** (via `window.L`), **OpenStreetMap** (Tiles).
    *   **Data Source**: **Overpass API** (querying OpenStreetMap data for `amenity=hospital`).
    *   **Routing**: **OSRM** (Open Source Routing Machine) via `leaflet-routing-machine`.
    *   **Clustering**: `leaflet.markercluster` for grouping markers.
    *   **Geolocation**: Browser `navigator.geolocation` API.

### 8. SOS / Emergency (Floating Button)
*   **What it calls**: `src/components/SOSButton.tsx` (which uses `EmergencyAccessTab.tsx`)
*   **What it does**: A persistent floating button. When long-pressed, it opens an Emergency Interface where users can:
    *   Call an Ambulance (108).
    *   Send an emergency distress signal (Webhook) with their live location and situation (e.g., Snake Bite).
*   **Tech Stack**:
    *   **Interaction**: `useLongPressSpeech` hook (Custom hook for ease of use/accessibility).
    *   **Backend**: **Webhooks** (`https://n8n-qi63.onrender.com/webhook/emergency-trigger`) for sending alerts.
    *   **Geolocation**: Real-time coordinate capture.

---

## 🛠 Overall Tech Stack (Codebase)

### **Frontend Core**
*   **Framework**: [React](https://react.dev/) (v18.3)
*   **Build Tool**: [Vite](https://vitejs.dev/) (v7.1.12) - configured on port `8080`.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (Static typing, loose config with `noImplicitAny: false`).
*   **Project Structure**:
    *   `src/components`: UI components (Shadcn + Custom).
    *   `src/pages`: Route handlers.
    *   `src/services`: Business logic (e.g., `SpeechService`).
    *   `src/contexts`: Global state (`AuthContext`, `LanguageContext`).

### **UI & Styling**
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS)
*   **Component Library**: [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI primitives)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Animations**: `tailwindcss-animate`, standard CSS transitions.

### **Navigation & State**
*   **Routing**: [React Router DOM](https://reactrouter.com/) (v6)
*   **State Management**: [React Query](https://tanstack.com/query/latest) (`@tanstack/react-query`) for server state.
*   **Local State**: React Hooks (`useState`, `useEffect`, `useContext`).

### **Backend & Services**
*   **BaaS (Backend as a Service)**: [Supabase](https://supabase.com/)
    *   **Auth**: User authentication.
    *   **Database**: Postgres (for dashboard data).
    *   **Edge Functions**: Serverless functions for logic (`ask-doctor`, `get-dashboard`).
*   **Maps**: OpenStreetMap ecosystem (Leaflet, Overpass API, OSRM).
*   **AI/External**: N8N Webhook (for SOS alerts).

### **Accessibility & Internationalization**
*   **i18n**: [i18next](https://www.i18next.com/) & `react-i18next` (Translation management).
*   **Text-to-Speech**: `SpeechService.ts` wraps Web Speech API.
    *   **Logic**: Maps language codes to BCP 47 tags (e.g., `te` -> `te-IN`).
    *   **Fallback**: Marathi falls back to Hindi; others stay silent if no voice is available.

