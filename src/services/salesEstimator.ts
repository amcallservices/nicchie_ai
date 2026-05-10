// Amazon KDP Sales Estimation Engine
// Estimates sales, revenue, and royalties based on BSR, price, reviews

export interface SalesInput {
  bsr?: number
  price: number
  reviews: number
  category?: string
  marketplace: string
}

export interface SalesOutput {
  estimatedDailySales: number
  estimatedMonthlySales: number
  estimatedMonthlyRevenue: number
  estimatedRoyalties: number
  competitionStrength: 'very_high' | 'high' | 'medium' | 'low' | 'very_low'
  nicheEarningPotential: 'excellent' | 'good' | 'moderate' | 'poor'
  bestSellerProbability: number
  rankTier: string
  confidence: string
  factors: string[]
}

// BSR ranges by category for different marketplaces
const BSR_RANGES: Record<string, Record<string, { max: number; dailySales: number }[]>> = {
  // US Books
  'com': {
    'general': [
      { max: 100, dailySales: 500 },
      { max: 500, dailySales: 200 },
      { max: 1000, dailySales: 100 },
      { max: 5000, dailySales: 50 },
      { max: 10000, dailySales: 25 },
      { max: 50000, dailySales: 10 },
      { max: 100000, dailySales: 5 },
      { max: 200000, dailySales: 2 },
      { max: 500000, dailySales: 1 },
      { max: 9999999, dailySales: 0.5 },
    ],
    'business': [
      { max: 100, dailySales: 400 },
      { max: 500, dailySales: 180 },
      { max: 1000, dailySales: 80 },
      { max: 5000, dailySales: 40 },
      { max: 10000, dailySales: 20 },
      { max: 50000, dailySales: 8 },
      { max: 100000, dailySales: 4 },
      { max: 200000, dailySales: 2 },
      { max: 500000, dailySales: 1 },
      { max: 9999999, dailySales: 0.3 },
    ],
    'self_help': [
      { max: 100, dailySales: 450 },
      { max: 500, dailySales: 200 },
      { max: 1000, dailySales: 90 },
      { max: 5000, dailySales: 45 },
      { max: 10000, dailySales: 22 },
      { max: 50000, dailySales: 9 },
      { max: 100000, dailySales: 4 },
      { max: 200000, dailySales: 2 },
      { max: 500000, dailySales: 1 },
      { max: 9999999, dailySales: 0.3 },
    ],
    'health': [
      { max: 100, dailySales: 400 },
      { max: 500, dailySales: 180 },
      { max: 1000, dailySales: 85 },
      { max: 5000, dailySales: 40 },
      { max: 10000, dailySales: 20 },
      { max: 50000, dailySales: 8 },
      { max: 100000, dailySales: 4 },
      { max: 200000, dailySales: 2 },
      { max: 500000, dailySales: 1 },
      { max: 9999999, dailySales: 0.3 },
    ],
    'diet': [
      { max: 100, dailySales: 380 },
      { max: 500, dailySales: 170 },
      { max: 1000, dailySales: 80 },
      { max: 5000, dailySales: 38 },
      { max: 10000, dailySales: 18 },
      { max: 50000, dailySales: 7 },
      { max: 100000, dailySales: 3 },
      { max: 200000, dailySales: 1.5 },
      { max: 500000, dailySales: 0.8 },
      { max: 9999999, dailySales: 0.3 },
    ],
    'fitness': [
      { max: 100, dailySales: 380 },
      { max: 500, dailySales: 170 },
      { max: 1000, dailySales: 75 },
      { max: 5000, dailySales: 35 },
      { max: 10000, dailySales: 17 },
      { max: 50000, dailySales: 7 },
      { max: 100000, dailySales: 3 },
      { max: 200000, dailySales: 1.5 },
      { max: 500000, dailySales: 0.8 },
      { max: 9999999, dailySales: 0.3 },
    ],
  },
  // UK Books
  'co.uk': {
    'general': [
      { max: 100, dailySales: 200 },
      { max: 500, dailySales: 100 },
      { max: 1000, dailySales: 50 },
      { max: 5000, dailySales: 25 },
      { max: 10000, dailySales: 12 },
      { max: 50000, dailySales: 5 },
      { max: 100000, dailySales: 2 },
      { max: 200000, dailySales: 1 },
      { max: 500000, dailySales: 0.5 },
      { max: 9999999, dailySales: 0.2 },
    ],
  },
  // DE Books
  'de': {
    'general': [
      { max: 100, dailySales: 220 },
      { max: 500, dailySales: 100 },
      { max: 1000, dailySales: 55 },
      { max: 5000, dailySales: 25 },
      { max: 10000, dailySales: 12 },
      { max: 50000, dailySales: 5 },
      { max: 100000, dailySales: 2 },
      { max: 200000, dailySales: 1 },
      { max: 500000, dailySales: 0.5 },
      { max: 9999999, dailySales: 0.2 },
    ],
  },
  // IT Books
  'it': {
    'general': [
      { max: 100, dailySales: 120 },
      { max: 500, dailySales: 55 },
      { max: 1000, dailySales: 28 },
      { max: 5000, dailySales: 14 },
      { max: 10000, dailySales: 7 },
      { max: 50000, dailySales: 3 },
      { max: 100000, dailySales: 1.5 },
      { max: 200000, dailySales: 0.7 },
      { max: 500000, dailySales: 0.3 },
      { max: 9999999, dailySales: 0.1 },
    ],
  },
  // FR Books
  'fr': {
    'general': [
      { max: 100, dailySales: 130 },
      { max: 500, dailySales: 60 },
      { max: 1000, dailySales: 30 },
      { max: 5000, dailySales: 15 },
      { max: 10000, dailySales: 7 },
      { max: 50000, dailySales: 3 },
      { max: 100000, dailySales: 1.5 },
      { max: 200000, dailySales: 0.7 },
      { max: 500000, dailySales: 0.3 },
      { max: 9999999, dailySales: 0.1 },
    ],
  },
}

// Marketplace multipliers
const MARKETPLACE_MULTIPLIERS: Record<string, number> = {
  'com': 1.0,      // US - base
  'co.uk': 0.4,     // UK
  'de': 0.45,     // Germany
  'it': 0.25,     // Italy
  'fr': 0.27,     // France
  'es': 0.22,     // Spain
  'co.jp': 0.35,    // Japan
  'ca': 0.22,     // Canada
  'com.au': 0.18,  // Australia
  'in': 0.12,     // India
}

// Category multipliers
const CATEGORY_MULTIPLIERS: Record<string, number> = {
  'general': 1.0,
  'business': 0.85,
  'self_help': 0.95,
  'health': 0.9,
  'diet': 0.85,
  'fitness': 0.85,
  'finance': 0.9,
  'relationships': 0.8,
  'productivity': 0.8,
  'spirituality': 0.75,
  'parenting': 0.7,
}

// Get rank tier
function getRankTier(bsr: number): string {
  if (bsr < 100) return 'Top 100 - Bestseller'
  if (bsr < 1000) return 'Top 1,000 - Hot'
  if (bsr < 10000) return 'Top 10,000 - Good'
  if (bsr < 50000) return 'Top 50,000 - Moderate'
  if (bsr < 100000) return 'Top 100,000 - Low'
  if (bsr < 200000) return 'Top 200,000 - Niche'
  return '200k+ - Very Low'
}

// Get competition strength
function getCompetitionStrength(reviews: number): 'very_high' | 'high' | 'medium' | 'low' | 'very_low' {
  if (reviews > 1000) return 'very_high'
  if (reviews > 500) return 'high'
  if (reviews > 100) return 'medium'
  if (reviews > 20) return 'low'
  return 'very_low'
}

// Calculate KDP royalty
function calculateRoyalty(price: number, monthlySales: number, format: 'ebook' | 'paperback' | 'hardcover' = 'ebook'): number {
  const royaltyRate = 0.70 // 70% for $2.99-$9.99 ebook
  const kdpSelectRate = 0.35 // 35% for <$2.99 or >$9.99
  
  let rate = royaltyRate
  if (price < 2.99 || price > 9.99) {
    rate = kdpSelectRate
  }
  
  // Subtract delivery costs for Kindle
  if (format === 'ebook') {
    const deliveryCost = Math.min(0.15, monthlySales * 0.0001) // ~$0.0001/MB average
    return (price * rate - deliveryCost) * monthlySales
  }
  
  return price * rate * monthlySales
}

// Estimate daily sales from BSR
function estimateDailySales(bsr: number, category: string, marketplace: string): number {
  const mp = MARKETPLACE_MULTIPLIERS[marketplace] || 1.0
  const cat = CATEGORY_MULTIPLIERS[category] || CATEGORY_MULTIPLIERS['general']
  
  const ranges = BSR_RANGES[marketplace]?.[category] || BSR_RANGES['com']['general']
  
  let dailySales = 0.5 // Base for very high BSR
  
  for (const range of ranges) {
    if (bsr <= range.max) {
      dailySales = range.dailySales
      break
    }
  }
  
  return dailySales * mp * cat
}

// Calculate bestseller probability
function calculateBestSellerProbability(bsr: number, reviews: number, price: number): number {
  let probability = 0
  
  // Based on BSR
  if (bsr < 1000) probability += 40
  else if (bsr < 10000) probability += 25
  else if (bsr < 50000) probability += 10
  else if (bsr < 100000) probability += 5
  
  // Based on reviews (established product)
  if (reviews > 500) probability += 20
  else if (reviews > 100) probability += 12
  else if (reviews > 20) probability += 6
  
  // Based on price (reasonable pricing)
  if (price >= 2.99 && price <= 9.99) probability += 10
  else if (price >= 0.99 && price <= 14.99) probability += 5
  
  // Based on BSR trend potential
  if (bsr < 100) probability += 15
  
  return Math.min(100, Math.max(0, probability))
}

// Main estimation function
export function estimateSales(input: SalesInput): SalesOutput {
  let {
    bsr = 500000, // Default high BSR if not provided
    price,
    reviews = 0,
    category = 'general',
    marketplace = 'com',
  } = input
  
  const factors: string[] = []
  
  // Get marketplace multiplier
  const mpMultiplier = MARKETPLACE_MULTIPLIERS[marketplace] || 1.0
  if (mpMultiplier < 0.5) {
    factors.push(`Lower marketplace reach (${mpMultiplier * 100}% of US)`)
  }
  
  // Get category multiplier
  const catMultiplier = CATEGORY_MULTIPLIERS[category] || 1.0
  if (catMultiplier < 0.9) {
    factors.push(`Category has lower sales velocity`)
  }
  
  // Estimate daily sales
  const dailySales = estimateDailySales(bsr, category, marketplace)
  const monthlySales = Math.round(dailySales * 30)
  
  // Calculate revenue
  const monthlyRevenue = monthlySales * price
  
  // Calculate royalties
  const royalties = calculateRoyalty(price, monthlySales)
  
  // Competition strength
  const competition = getCompetitionStrength(reviews)
  
  // Add factors based on reviews
  if (reviews > 500) {
    factors.push('High competition (established titles)')
  } else if (reviews < 10) {
    factors.push('Low competition (new opportunity)')
  }
  
  // Best seller probability
  const bestSellerProb = calculateBestSellerProbability(bsr, reviews, price)
  
  // Niche earning potential
  let nicheEarning: 'excellent' | 'good' | 'moderate' | 'poor' = 'moderate'
  if (monthlyRevenue > 5000) {
    nicheEarning = 'excellent'
    factors.push('Excellent earning potential')
  } else if (monthlyRevenue > 1000) {
    nicheEarning = 'good'
    factors.push('Good earning potential')
  } else if (monthlyRevenue > 100) {
    nicheEarning = 'moderate'
  } else {
    nicheEarning = 'poor'
    factors.push('Low earning potential - high BSR barrier')
  }
  
  // Confidence level
  let confidence = 'Low'
  if (bsr < 50000 && reviews > 10) {
    confidence = 'High'
    factors.push('High confidence - good data')
  } else if (bsr < 100000) {
    confidence = 'Medium'
  } else {
    factors.push('Lower confidence - estimate based on BSR')
  }
  
  return {
    estimatedDailySales: Math.max(0.1, Math.round(dailySales * 10) / 10),
    estimatedMonthlySales: monthlySales,
    estimatedMonthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
    estimatedRoyalties: Math.round(royalties * 100) / 100,
    competitionStrength: competition,
    nicheEarningPotential: nicheEarning,
    bestSellerProbability: bestSellerProb,
    rankTier: getRankTier(bsr),
    confidence,
    factors,
  }
}

// Export for use in API
export default { estimateSales }