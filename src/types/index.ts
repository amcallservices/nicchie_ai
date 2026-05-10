export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  createdAt: string
}

export interface Niche {
  id: string
  name: string
  slug: string
  scores: NicheScores
  analysis: NicheAnalysis
  trend: 'up' | 'down' | 'stable'
  competition: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

export interface NicheScores {
  nicheScore: number
  profitScore: number
  saturationScore: number
  evergreenScore: number
  trendScore: number
}

export interface NicheAnalysis {
  demand: string
  competition: string
  opportunities: string
  risks: string
  recommendations: string[]
}

export interface MicroNiche {
  id: string
  target: string
  problema: string
  risultato: string
  competition: 'low' | 'medium' | 'high'
  monetization: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface Keyword {
  id: string
  keyword: string
  volume: number
  difficulty: number
  opportunityScore: number
  intent: 'informational' | 'transactional' | 'navigational'
}

export interface Competitor {
  id: string
  title: string
  author: string
  url: string
  price: number
  reviews: number
  rating: number
  bsr: number
  coverUrl?: string
  analysis?: CompetitorAnalysis
}

export interface CompetitorAnalysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface Trend {
  id: string
  name: string
  category: 'google' | 'reddit' | 'youtube' | 'tiktok'
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
}

export interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'completed' | 'archived'
  niches: string[]
  createdAt: string
  updatedAt: string
}

export interface Folder {
  id: string
  name: string
  color: string
}

export interface SearchHistory {
  id: string
  query: string
  results: any
  createdAt: string
}

export interface Subscription {
  plan: 'free' | 'pro' | 'elite'
  searchesPerDay: number
  exportsPerDay: number
  aiAnalysis: boolean
  trendReports: boolean
  apiAccess: boolean
}

export interface PricingPlan {
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  popular?: boolean
}

export interface DashboardStats {
  totalSearches: number
  activeProjects: number
  savedNiches: number
  creditsRemaining: number
}