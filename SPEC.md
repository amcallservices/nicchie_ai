# KDP Niche Hunter AI - Spefiche Tecniche Complete

## 1. Panoramica Progetto

**Nome**: KDP Niche Hunter AI  
**Descrizione**: SaaS professionale per l'analisi automatizzata delle nicchie Amazon KDP, progettato per aiutare gli autori a trovare, validare e sfruttare nicchie profittevoli.  
**Target**: Autori Amazon KDP, content creators, indie publishers  
**Stack**: Next.js 14 + TypeScript + TailwindCSS + shadcn/ui + Supabase + OpenAI API + Recharts

---

## 2. UI/UX Specification

### 2.1 Design System

**Color Palette**:
- `--background`: #0a0a0f (rich black)
- `--background-secondary`: #12121a (dark surface)
- `--background-tertiary`: #1a1a24 (elevated surface)
- `--foreground`: #fafafa (white text)
- `--foreground-muted`: #a1a1aa (muted text)
- `--primary`: #8b5cf6 (violet-500)
- `--primary-hover`: #7c3aed (violet-600)
- `--primary-light`: #a78bfa (violet-400)
- `--primary-dark`: #6d28d9 (violet-700)
- `--accent`: #06b6d4 (cyan-500)
- `--accent-hover`: #0891b2 (cyan-600)
- `--success`: #10b981 (emerald-500)
- `--warning`: #f59e0b (amber-500)
- `--error`: #ef4444 (red-500)
- `--border`: #27272a (zinc-800)
- `--border-light`: #3f3f46 (zinc-700)

**Font Family**:
- Headings: "Plus Jakarta Sans", sans-serif (Google Fonts)
- Body: "Inter", sans-serif (Google Fonts)
- Mono: "JetBrains Mono", monospace

**Font Sizes**:
- h1: 3rem (48px), font-weight: 700
- h2: 2.25rem (36px), font-weight: 600
- h3: 1.5rem (24px), font-weight: 600
- h4: 1.25rem (20px), font-weight: 500
- body: 1rem (16px), font-weight: 400
- small: 0.875rem (14px), font-weight: 400
- xs: 0.75rem (12px), font-weight: 400

**Spacing System** (4px base):
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

**Border Radius**:
- sm: 6px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px

**Shadows**:
- sm: 0 1px 2px rgba(0, 0, 0, 0.3)
- md: 0 4px 6px rgba(0, 0, 0, 0.3)
- lg: 0 10px 15px rgba(0, 0, 0, 0.3)
- glow: 0 0 20px rgba(139, 92, 246, 0.3)

### 2.2 Layout Structure

**Sidebar** (280px fixed):
- Logo + brand
- Navigation menu
- User avatar + name
- Theme toggle
- Logout button

**Main Content**:
- Max width: 1400px
- Padding: 32px
- Responsive fluid

**Responsive Breakpoints**:
- Mobile: < 640px (sidebar becomes bottom nav)
- Tablet: 640px - 1024px (collapsible sidebar)
- Desktop: > 1024px (full sidebar)

### 2.3 Component Library

**Cards**:
- Glass morphism with subtle blur
- Border: 1px solid var(--border)
- Background: rgba(18, 18, 26, 0.8)
- Hover: subtle glow effect

**Buttons**:
- Primary: Violet gradient background
- Secondary: Transparent with border
- Ghost: No background, hover shows bg
- Sizes: sm (32px), md (40px), lg (48px)

**Inputs**:
- Dark background (#1a1a24)
- Border on focus (violet)
- Smooth transition animations

**Charts**:
- Recharts with custom theme
- Gradient fills
- Animated on load

---

## 3. Pagine Application

### 3.1 Landing Page (/)

**Hero Section**:
- Headline: "Trova nicchie Amazon KDP profittevoli prima degli altri."
- Subheadline: "Analisi AI avanzate, dati reali, approccio data-driven per autori KDP."
- CTA Primary: "Inizia la prova gratuita"
- CTA Secondary: "Analizza la tua prima nicchia"
- Animated gradient background

**Features Section** (6 feature cards):
1. Ricerca Nicchie AI
2. Analisi Competitor
3. Keyword Research
4. Trend Analysis
5. Validatore Economico
6. Book Idea Generator

**How It Works** (3 step cards):
1. Inserisci una nicchia
2. AI analizza i dati
3. Ottieni insight actionable

**Testimonials** (3 cards con avatar, nome, ruolo, testimonial)

**Pricing Section**:
- Free Plan: €0/mese, 5 ricerche/mese
- Pro Plan: €29/mese, ricerche illimitate, export PDF
- Elite Plan: €79/mese, tutto + API access, priority support

**FAQ Section** (6 accordion items)

**Footer**:
- Logo
- Links: Features, Pricing, Login, Register
- Social links
- Copyright

### 3.2 Auth Pages (/login, /register)

**Login**:
- Email input
- Password input (show/hide toggle)
- "Remember me" checkbox
- "Forgot password?" link
- Login button
- Social login (Google, GitHub)
- Register link

**Register**:
- Name input
- Email input
- Password input
- Confirm password
- Terms checkbox
- Register button
- Social login
- Login link

### 3.3 Dashboard (/dashboard)

**Header**:
- Welcome message con user name
- Quick actions buttons

**KPI Cards Row** (4 cards):
1. Total Niche Searches
2. Active Projects
3. Saved Niches
4. Credits Remaining

**Market Overview Chart** (Area chart - Google Trends data mock)

**Hot Niches Table** (5 items):
- Niche name
- Score
- Trend indicator
- Action buttons

**Emerging Niches** (List - 5 items)

**Recent Searches** (List - 5 items)

**Opportunity Score Gauge** (Gauge chart)

### 3.4 Niche Research (/research)

**Search Section**:
- Large input field
- Search button
- Recent searches dropdown
- Example tags

**Results Panel**:
- Niche Name display
- Overall Score gauge

**Score Cards** (5 cards in grid):
1. Niche Score (0-100)
2. Profit Score
3. Saturation Score
4. Evergreen Score
5. Trend Score

**AI Analysis Section**:
- Demanda analysis
- Competition analysis
- Opportunities
- Risks
- Recommendations

**Micro-Niches Generated** (List - 10 items)

**Save/Export buttons**

### 3.5 Micro-Niche Generator (/micro-niches)

**Input Section**:
- Macro niche input
- Generate button

**Results** (50 micro-niches):
- Target + Problema + Risultato format
- Competition level indicator
- Monetization potential
- Difficulty indicator
- Save button per each

### 3.6 Keyword Explorer (/keywords)

**Search Bar**:
- Keyword input
- Search button

**Results Table**:
- Keyword
- Volume (mock)
- Difficulty
- Opportunity Score
- Intent (Informational/Transactional)
- Save button

**Filters**:
- Low Competition
- High Demand
- Evergreen
- Emerging

**Export CSV button**

### 3.7 Competitor Analysis (/competitors)

**Input Section**:
- URL input OR keyword input
- Analyze button

**Competitor Cards** (Analyzes top 10):
- Title
- Cover image (placeholder)
- Price
- Reviews count
- BSR estimate
- Score card

**SWOT Analysis** (AI generated)

**Pattern Insights** (AI generated list)

**Gaps & Opportunities** (AI generated list)

### 3.8 Trend Radar (/trends)

**Trend Categories**:
- Google Trends
- Reddit
- YouTube
- TikTok

**Trending Now** (Chart + List)

**Growing Trends** (List)

**Declining Trends** (List)

**Seasonal Patterns** (Chart)

### 3.9 AI Book Generator (/book-generator)

**Input Section**:
- Niche/Topic input
- Generate button

**Results**:
- Title suggestions (5)
- Subtitle suggestions (5)
- Outline (chapter by chapter)
- USP
- Marketing hook
- Target audience
- Serie ideas

### 3.10 Saved Projects (/projects)

**Projects Table**:
- Name
- Created date
- Last modified
- Status
- Actions (View, Edit, Delete)

**Folders/Categories**

### 3.11 Settings (/settings)

**Profile Section**:
- Name
- Email
- Avatar upload

**Subscription Section**:
- Current plan
- Usage stats
- Upgrade button

**Preferences**:
- Theme toggle (dark/light)
- Notifications toggle
- Email preferences

---

## 4. Database Schema (Supabase)

### 4.1 Tables

**users**
```sql
id: uuid PRIMARY KEY
email: text UNIQUE
name: text
avatar_url: text
created_at: timestamp
updated_at: timestamp
```

**niches**
```sql
id: uuid PRIMARY KEY
user_id: uuid FK
name: text
slug: text
scores: jsonb
analysis: jsonb
status: text
folder_id: uuid FK
created_at: timestamp
updated_at: timestamp
```

**folders**
```sql
id: uuid PRIMARY KEY
user_id: uuid FK
name: text
color: text
created_at: timestamp
```

**projects**
```sql
id: uuid PRIMARY KEY
user_id: uuid FK
name: text
description: text
status: text
created_at: timestamp
updated_at: timestamp
```

**keywords**
```sql
id: uuid PRIMARY KEY
user_id: uuid FK
keyword: text
volume: integer
difficulty: integer
opportunity_score: integer
saved_at: timestamp
```

**competitors**
```sql
id: uuid PRIMARY KEY
user_id: uuid FK
name: text
url: text
analysis: jsonb
saved_at: timestamp
```

**search_history**
```sql
id: uuid PRIMARY KEY
user_id: uuid FK
query: text
results: jsonb
created_at: timestamp
```

### 4.2 Row Level Security

- Users can only access their own data
- Public data is read-only for all authenticated users

---

## 5. API Routes

### 5.1 Auth Routes
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- GET /api/auth/me

### 5.2 Niche Routes
- POST /api/niches/analyze
- GET /api/niches
- GET /api/niches/:id
- PUT /api/niches/:id
- DELETE /api/niches/:id

### 5.3 Micro-Niche Routes
- POST /api/micro-niches/generate
- GET /api/micro-niches

### 5.4 Keyword Routes
- GET /api/keywords/search
- GET /api/keywords
- POST /api/keywords/save
- DELETE /api/keywords/:id

### 5.5 Competitor Routes
- POST /api/competitors/analyze
- GET /api/competitors
- POST /api/competitors/save
- DELETE /api/competitors/:id

### 5.6 Trend Routes
- GET /api/trends/google
- GET /api/trends/reddit
- GET /api/trends/youtube

### 5.7 AI Routes
- POST /api/ai/book-generator
- POST /api/ai/analysis

### 5.8 Subscription Routes
- GET /api/subscription
- POST /api/subscription/upgrade

---

## 6. Autenticazione e Sicurezza

### 6.1 Authentication
- Supabase Auth con email/password
- Social login: Google, GitHub
- JWT tokens
- Session management

### 6.2 Security
- Rate limiting: 100 req/min per user
- Input validation su tutti gli endpoint
- CORS configuration
- Helmet.js per headers
- XSS protection
- CSRF tokens

---

## 7. Performance

### 7.1 Frontend Optimization
- Lazy loading per immagini e componenti
- Code splitting automatico Next.js
- Font optimization
- Image optimization

### 7.2 Caching
- React Query per data fetching
- SWR per cache
- API response caching

### 7.3 Loading States
- Skeleton loaders
- Loading spinners
- Progressive loading

---

## 8. Mock Data

### 8.1 Niche Data
```typescript
const mockNiches = [
  { name: 'Meal Prep', score: 82, trend: 'up', competition: 'medium' },
  { name: 'Journaling for Anxiety', score: 91, trend: 'up', competition: 'low' },
  { name: 'Fitness Over 50', score: 78, trend: 'stable', competition: 'high' },
  { name: 'Digital Minimalism', score: 85, trend: 'up', competition: 'low' },
  { name: 'ADHD Productivity', score: 88, trend: 'up', competition: 'low' },
]
```

### 8.2 Keyword Data
```typescript
const mockKeywords = [
  { keyword: 'meal prep cookbook', volume: 12400, difficulty: 45, opportunity: 72 },
  { keyword: 'meal prep for weight loss', volume: 8900, difficulty: 38, opportunity: 81 },
  { keyword: 'meal prep recipes easy', volume: 15600, difficulty: 52, opportunity: 65 },
]
```

### 8.3 Competitor Data
```typescript
const mockCompetitors = [
  { title: 'The Meal Prep Cookbook', author: 'Jane Smith', price: 14.99, reviews: 342, bsr: 1200 },
  { title: 'Meal Prep in Minutes', author: 'John Doe', price: 9.99, reviews: 567, bsr: 890 },
]
```

### 8.4 Trend Data
```typescript
const mockTrends = [
  { date: '2024-01', value: 45 },
  { date: '2024-02', value: 52 },
  { date: '2024-03', value: 61 },
  { date: '2024-04', value: 58 },
  { date: '2024-05', value: 72 },
]
```

---

## 9. Acceptance Criteria

### 9.1 Core Functionality
- [ ] Landing page loads with all sections
- [ ] Authentication flow works
- [ ] Dashboard displays KPIs and charts
- [ ] Niche search returns results
- [ ] Keyword search returns results
- [ ] Competitor analysis works
- [ ] Trend radar shows data
- [ ] Book generator produces titles
- [ ] Projects can be saved/loaded

### 9.2 UI/UX
- [ ] Dark theme renders correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Animations are smooth
- [ ] Loading states appear correctly
- [ ] Error states are handled

### 9.3 Performance
- [ ] Page loads < 3s
- [ ] No console errors
- [ ] Lighthouse score > 80

---

## 10. Deployment

### 10.1 Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### 10.2 Build Command
```bash
npm run build
```

### 10.3 Start Command
```bash
npm run start
```