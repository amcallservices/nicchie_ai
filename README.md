# KDP Niche Hunter AI

Professional SaaS web app for Amazon KDP niche research. AI-powered analysis, competitor insights, and data-driven strategies for self-publishers.

## Features

- 🔍 **Niche Research** - AI-powered niche analysis with scores
- 🎯 **Micro-Niche Generator** - Generate 50+ profitable micro-niches
- 🔑 **Keyword Explorer** - Find the best keywords
- 👥 **Competitor Analysis** - Analyze market competitors
- 📈 **Trend Radar** - Discover emerging trends
- 📚 **AI Book Generator** - Generate book ideas

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **UI**: shadcn/ui + Recharts + Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **AI**: OpenAI API (ready)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Project Structure

```
src/
├── app/              # Next.js pages
│   ├── dashboard/   # Main dashboard
│   ├── research/   # Niche research
│   ├── keywords/   # Keyword explorer
│   ├── competitors/ # Competitor analysis
│   └── ...
├── components/       # React components
│   └── ui/       # UI components
├── lib/           # Utilities & mock data
└── types/         # TypeScript types
```

## License

MIT