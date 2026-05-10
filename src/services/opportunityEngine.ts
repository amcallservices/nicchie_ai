// OPPORTUNITY ENGINE: Simple market opportunity analyzer
import type { AmazonBook } from './amazonScraper'

export interface OpportunityScores {
  demandScore: number
  competitionScore: number
  revenueScore: number
  saturationScore: number
  opportunityScore: number
  riskLevel: 'low' | 'medium' | 'high'
  recommendation: OpportunityRecommendation
  breakdown: {
    avgBsr: number
    avgReviews: number
    avgRating: number
    avgPrice: number
    totalBooks: number
    topSellerShare: number
    keywordDensity: number
    competitionIntensity: 'low' | 'medium' | 'high'
    estimatedMonthlySales: number
    estimatedRevenue: number
    royaltyEstimate: number
  }
  indicators: string[]
  emoji: string
  label: string
}

export interface OpportunityRecommendation {
  action: string
  title: string
  description: string
  color: string
  bgColor: string
  emoji: string
}

export function calculateOpportunity(
  books: AmazonBook[],
  keyword: string,
  searchSuggestions?: string[]
): OpportunityScores {
  const validBooks = books.filter(b => b.title && b.title.length > 3)
  
  if (validBooks.length === 0) {
    return createEmptyOpportunity(keyword)
  }
  
  // Calculate averages
  const bsrValues = validBooks.map(b => b.bsr).filter((n): n is number => !!n)
  const avgBsr = bsrValues.length > 0
    ? bsrValues.reduce((a, b) => a + b, 0) / bsrValues.length 
    : 50000
  
  const reviewValues = validBooks.map(b => b.reviews).filter((n): n is number => n > 0)
  const avgReviews = reviewValues.length > 0
    ? reviewValues.reduce((a, b) => a + b, 0) / reviewValues.length
    : 0
  
  const ratingValues = validBooks.map(b => b.rating).filter((n): n is number => n > 0)
  const avgRating = ratingValues.length > 0
    ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
    : 0
  
  // Average price
  let priceTotal = 0, priceCount = 0
  for (const b of validBooks) {
    if (b.price) {
      const match = b.price.match(/[\d.]+/)
      if (match) {
        const num = parseFloat(match[0])
        if (num > 0 && num < 500) {
          priceTotal += num
          priceCount++
        }
      }
    }
  }
  const avgPrice = priceCount > 0 ? priceTotal / priceCount : 9.99
  
  // Best seller share
  const bestSellers = validBooks.filter(b => b.bsr && b.bsr < 10000).length
  const topSellerShare = validBooks.length > 0 
    ? (bestSellers / validBooks.length) * 100 
    : 0
  
  const keywordDensity = searchSuggestions?.length || 0
  
  // Calculate scores
  const demandScore = calculateDemandScore(avgBsr, keywordDensity, validBooks.length)
  const competitionScore = calculateCompetitionScore(avgReviews, avgRating, topSellerShare)
  const estimatedSales = Math.max(10, Math.round(500000 / Math.sqrt(avgBsr)))
  const estimatedRevenue = estimatedSales * avgPrice
  const royaltyEstimate = estimatedRevenue * 0.70 * 0.35
  const revenueScore = calculateRevenueScore(estimatedRevenue, avgPrice, royaltyEstimate)
  const saturationScore = calculateSaturationScore(validBooks.length, avgReviews, topSellerShare, avgRating)
  
  const opportunityScore = Math.round(
    demandScore * 0.25 +
    competitionScore * 0.20 +
    revenueScore * 0.30 +
    saturationScore * 0.25
  )
  
  const riskLevel = calculateRiskLevel(opportunityScore, avgReviews, bestSellers)
  const recommendation = getRecommendation(demandScore, competitionScore, saturationScore)
  const indicators = generateIndicators(demandScore, competitionScore, revenueScore, saturationScore, avgBsr, avgReviews, avgRating, avgPrice)
  
  return {
    demandScore,
    competitionScore,
    revenueScore,
    saturationScore,
    opportunityScore,
    riskLevel,
    recommendation,
    breakdown: {
      avgBsr: Math.round(avgBsr),
      avgReviews: Math.round(avgReviews * 10) / 10,
      avgRating: Math.round(avgRating * 10) / 10,
      avgPrice: Math.round(avgPrice * 100) / 100,
      totalBooks: validBooks.length,
      topSellerShare: Math.round(topSellerShare),
      keywordDensity,
      competitionIntensity: avgReviews < 100 ? 'low' : avgReviews < 1000 ? 'medium' : 'high',
      estimatedMonthlySales: Math.round(estimatedSales),
      estimatedRevenue: Math.round(estimatedRevenue),
      royaltyEstimate: Math.round(royaltyEstimate),
    },
    indicators,
    emoji: recommendation.emoji,
    label: recommendation.title,
  }
}

function calculateDemandScore(avgBsr: number, keywordDensity: number, totalBooks: number): number {
  const bsrFactor = avgBsr > 0 ? Math.max(0, 100 - Math.log10(avgBsr) * 10) : 50
  const keywordFactor = Math.min(100, keywordDensity * 10)
  const inventoryFactor = totalBooks > 0 ? Math.min(100, totalBooks * 5) : 0
  return Math.round(Math.min(100, (bsrFactor * 0.5) + (keywordFactor * 0.25) + (inventoryFactor * 0.25)))
}

function calculateCompetitionScore(avgReviews: number, avgRating: number, topSellerShare: number): number {
  const reviewFactor = Math.min(100, Math.log10(avgReviews + 1) * 20)
  const ratingFactor = avgRating * 20
  const dominanceFactor = Math.min(100, topSellerShare * 0.5)
  return Math.round(Math.min(100, reviewFactor + ratingFactor + dominanceFactor))
}

function calculateRevenueScore(estimatedRevenue: number, avgPrice: number, royaltyEstimate: number): number {
  const priceFactor = avgPrice > 0 ? Math.min(100, (avgPrice / 29.99) * 100) : 30
  const revenueFactor = estimatedRevenue > 0 ? Math.min(100, Math.log10(estimatedRevenue + 1) * 15) : 20
  const royaltyFactor = Math.min(100, royaltyEstimate > 0 ? Math.min(100, royaltyEstimate / 10) : 20)
  return Math.round((priceFactor * 0.3) + (revenueFactor * 0.35) + (royaltyFactor * 0.35))
}

function calculateSaturationScore(totalBooks: number, avgReviews: number, topSellerShare: number, avgRating: number): number {
  const countFactor = Math.min(100, totalBooks * 3)
  const reviewSaturation = Math.min(100, Math.log10(avgReviews + 1) * 25)
  const dominanceFactor = Math.min(100, topSellerShare * 0.8)
  const maturityFactor = avgRating > 4 ? 30 : avgRating > 3 ? 15 : 0
  return Math.round(Math.min(100, countFactor * 0.3 + reviewSaturation * 0.25 + dominanceFactor * 0.25 + maturityFactor * 0.2))
}

function calculateRiskLevel(opportunityScore: number, avgReviews: number, bestSellers: number): 'low' | 'medium' | 'high' {
  if (opportunityScore >= 70 && bestSellers >= 3) return 'low'
  if (opportunityScore >= 50 && bestSellers >= 1) return 'medium'
  return 'high'
}

function getRecommendation(demandScore: number, competitionScore: number, saturationScore: number): OpportunityRecommendation {
  if (demandScore >= 60 && competitionScore <= 40 && saturationScore <= 40) {
    return { action: 'strong_opportunity', title: 'Strong Opportunity', description: 'High demand with manageable competition', color: '#10b981', bgColor: '#d1fae5', emoji: 'FIRE' }
  }
  if (demandScore >= 50 && saturationScore <= 30) {
    return { action: 'emerging_trend', title: 'Emerging Trend', description: 'Growing market with low saturation', color: '#8b5cf6', bgColor: '#ede9fe', emoji: 'ROCKET' }
  }
  if (competitionScore > 40 && competitionScore <= 70) {
    return { action: 'medium_competition', title: 'Medium Competition', description: 'Established market with room for differentiation', color: '#f59e0b', bgColor: '#fef3c7', emoji: 'WARNING' }
  }
  if (saturationScore >= 70 || competitionScore >= 70) {
    return { action: 'oversaturated', title: 'Oversaturated', description: 'Too many competitors', color: '#ef4444', bgColor: '#fee2e2', emoji: 'NO' }
  }
  if (demandScore < 40) {
    return { action: 'niche_play', title: 'Niche Play', description: 'Small but dedicated audience', color: '#06b6d4', bgColor: '#cffafe', emoji: 'TARGET' }
  }
  return { action: 'avoid', title: 'Avoid', description: 'Low opportunity', color: '#6b7280', bgColor: '#f3f4f6', emoji: 'STOP' }
}

function generateIndicators(demandScore: number, competitionScore: number, revenueScore: number, saturationScore: number, avgBsr: number, avgReviews: number, avgRating: number, avgPrice: number): string[] {
  const indicators: string[] = []
  if (demandScore >= 60) indicators.push('High demand')
  if (demandScore < 30) indicators.push('Low demand')
  if (competitionScore < 40) indicators.push('Low competition')
  if (competitionScore >= 70) indicators.push('High competition')
  if (revenueScore >= 60) indicators.push('High revenue potential')
  if (saturationScore < 30) indicators.push('Unsaturated market')
  if (saturationScore >= 70) indicators.push('Saturated market')
  if (avgBsr > 0 && avgBsr < 5000) indicators.push('BSR #' + Math.round(avgBsr).toLocaleString())
  if (avgReviews > 500) indicators.push('Avg ' + Math.round(avgReviews) + ' reviews')
  if (avgRating >= 4.5) indicators.push('Highly rated')
  if (avgPrice >= 20) indicators.push('Premium price')
  if (avgPrice < 10) indicators.push('Budget-friendly')
  return indicators
}

function createEmptyOpportunity(keyword: string): OpportunityScores {
  return {
    demandScore: 0,
    competitionScore: 0,
    revenueScore: 0,
    saturationScore: 0,
    opportunityScore: 0,
    riskLevel: 'high',
    recommendation: { action: 'avoid', title: 'No Data', description: 'Unable to analyze', color: '#6b7280', bgColor: '#f3f4f6', emoji: 'STOP' },
    breakdown: { avgBsr: 0, avgReviews: 0, avgRating: 0, avgPrice: 0, totalBooks: 0, topSellerShare: 0, keywordDensity: 0, competitionIntensity: 'low', estimatedMonthlySales: 0, estimatedRevenue: 0, royaltyEstimate: 0 },
    indicators: ['No books found'],
    emoji: 'STOP',
    label: 'No Data',
  }
}