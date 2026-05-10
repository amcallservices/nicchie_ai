// Minimal fallback mock data
// Used when API calls fail or during initial load

export const mockNiches = [
  {
    id: '1',
    name: 'Getting Started',
    scores: {
      nicheScore: 0,
      profitScore: 0,
      saturationScore: 0,
      evergreenScore: 0,
      trendScore: 0,
    },
    analysis: {
      demand: '',
      competition: '',
      opportunities: '',
      risks: '',
      recommendations: [] as string[],
    },
    realData: null as any,
  },
]

export const scoreData = [
  { name: 'Domanda', value: 75, fullMark: 100 },
  { name: 'Concorrenza', value: 45, fullMark: 100 },
  { name: 'Profitto', value: 80, fullMark: 100 },
  { name: 'Trend', value: 65, fullMark: 100 },
  { name: 'Evergreen', value: 85, fullMark: 100 },
]

export const trendChartData = [
  { month: 'Gen', searches: 1200 },
  { month: 'Feb', searches: 1350 },
  { month: 'Mar', searches: 1100 },
  { month: 'Apr', searches: 1450 },
  { month: 'Mag', searches: 1600 },
  { month: 'Giu', searches: 1750 },
]

export const saturationData = [
  { category: 'Low', value: 40, color: '#8b5cf6' },
  { category: 'Medium', value: 35, color: '#06b6d4' },
  { category: 'High', value: 25, color: '#10b981' },
]

export const mockDashboardStats = [
  { label: 'Total Searches', value: '1,234', change: '+12%', trend: 'up' },
  { label: 'Avg Score', value: '72', change: '+5%', trend: 'up' },
  { label: 'Profitable Niches', value: '89', change: '+23%', trend: 'up' },
  { label: 'Saved Projects', value: '12', change: '0%', trend: 'stable' },
]

export const mockMicroNiches = [
  {
    id: '1',
    target: 'Enter a niche above',
    problema: 'Click analyze to generate micro-niches',
    risultato: '',
    competition: 'medium',
    monetization: 70,
    difficulty: 'medium',
  },
]

export const mockKeywords = [
  {
    id: '1',
    keyword: 'Enter a keyword above',
    volume: 0,
    difficulty: 0,
    opportunityScore: 0,
    intent: 'informational',
    saved: false,
  },
]

export const mockCompetitors = [
  {
    id: '1',
    title: 'Enter a niche to analyze competitors',
    author: '',
    price: 0,
    reviews: 0,
    rating: 0,
    bsr: '',
  },
]

export const mockProjects = [
  {
    id: '1',
    name: 'Sample Project',
    niche: 'example',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
]

export const mockTrends = [
  { id: '1', name: 'Trending Topic', growth: 150, category: 'health' },
  { id: '2', name: 'Emerging Topic', growth: 85, category: 'self-help' },
  { id: '3', name: 'Stable Topic', growth: 20, category: 'business' },
]