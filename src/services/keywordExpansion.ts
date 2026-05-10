import { chromium, Browser } from 'playwright'
import * as cheerio from 'cheerio'

const AMAZON_MARKETPLACES: Record<string, { baseUrl: string; name: string }> = {
  'com': { baseUrl: 'https://www.amazon.com', name: 'Amazon.com (US)' },
  'co.uk': { baseUrl: 'https://www.amazon.co.uk', name: 'Amazon.co.uk (UK)' },
  'de': { baseUrl: 'https://www.amazon.de', name: 'Amazon.de (Germany)' },
  'it': { baseUrl: 'https://www.amazon.it', name: 'Amazon.it (Italy)' },
  'fr': { baseUrl: 'https://www.amazon.fr', name: 'Amazon.fr (France)' },
  'es': { baseUrl: 'https://www.amazon.es', name: 'Amazon.es (Spain)' },
}

export interface KeywordSuggestion {
  keyword: string
  type: 'autocomplete' | 'related' | 'alphabet' | 'buyer-intent'
  source: string
  searchVolume?: number
}

export interface KeywordCluster {
  name: string
  keywords: string[]
  volume: number
  competition: 'low' | 'medium' | 'high'
}

export interface ExpansionResult {
  original: string
  suggestions: KeywordSuggestion[]
  clusters: KeywordCluster[]
  totalKeywords: number
  expandedAt: string
}

// Browser singleton
let browser: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-scheduler',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    })
  }
  return browser
}

// Random delay
function randomDelay(min: number = 500, max: number = 1500): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Get autocomplete from Amazon search page
async function getAutocomplete(keyword: string, marketplace: string = 'com'): Promise<string[]> {
  const marketplaceConfig = AMAZON_MARKETPLACES[marketplace] || AMAZON_MARKETPLACES['com']
  
  try {
    const browser = await getBrowser()
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })
    
    const pageInstance = await context.newPage()
    const url = `${marketplaceConfig.baseUrl}/s?k=${encodeURIComponent(keyword)}&i=books`
    
    await pageInstance.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await pageInstance.waitForTimeout(randomDelay(800, 1500))
    
    const html = await pageInstance.content()
    const $ = cheerio.load(html)
    
    const suggestions: string[] = []
    
    // Amazon search suggestions
    const suggestionEls = $('.s-suggestion, .a-dropdown-item a, .a-list-item a')
    suggestionEls.each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 2 && text.length < 100 && text.includes(keyword)) {
        suggestions.push(text)
      }
    })
    
    // Also get related searches
    const relatedEls = $('#spc-sec #spc-g .a卡片, .sb_ans_mid')
    relatedEls.each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 2 && text.length < 80) {
        suggestions.push(text)
      }
    })
    
    await context.close()
    
    // Deduplicate
    return Array.from(new Set(suggestions))
  } catch (error) {
    console.error('Autocomplete error:', error)
    return []
  }
}

// Alphabet expansion - try a b c... with keyword
async function expandAlphabet(keyword: string, marketplace: string = 'com'): Promise<string[]> {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const results: string[] = []
  
  const browser = await getBrowser()
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  
  // Only try first 10 letters to avoid too many requests
  for (const letter of alphabet.slice(0, 10)) {
    const pageInstance = await context.newPage()
    const searchTerm = `${keyword} ${letter}`
    const url = `${AMAZON_MARKETPLACES[marketplace]?.baseUrl || AMAZON_MARKETPLACES['com'].baseUrl}/s?k=${encodeURIComponent(searchTerm)}&i=books`
    
    await pageInstance.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 })
    await pageInstance.waitForTimeout(randomDelay(300, 600))
    
    const html = await pageInstance.content()
    const $ = cheerio.load(html)
    
    const suggestionEls = $('.s-suggestion, .a-dropdown-item a, .a-list-item a')
    suggestionEls.each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 2 && text.length < 100) {
        results.push(text)
      }
    })
    
    await pageInstance.close()
  }
  
  await context.close()
  return Array.from(new Set(results))
}

// Expand with common modifiers (simplified for efficiency)
async function expandWithModifiers(keyword: string, marketplace: string = 'com'): Promise<KeywordSuggestion[]> {
  // Common modifier patterns for KDP keywords
  const modifierPatterns = [
    // Type modifiers
    'book', 'guide', 'manual', 'workbook', 'journal', 'planner',
    // Format modifiers  
    'pdf', 'ebook', 'kindle', 'audiobook',
    // Level modifiers
    'beginner', 'intermediate', 'advanced', 'experts',
    // Target modifiers
    'for women', 'for men', 'for kids', 'for teens', 'for adults', 'for seniors',
    // Problem modifiers
    'anxiety', 'stress', 'depression', 'focus', 'energy', 'sleep',
    // Diet modifiers
    'keto', 'vegan', 'vegetarian', 'low carb', 'diabetic', 'weight loss',
    // Style modifiers
    'easy', 'simple', 'quick', 'healthy', 'quick & easy',
    // Intent modifiers
    'recipes', 'tips', 'strategies', 'secrets', 'system',
  ]
  
  const suggestions: KeywordSuggestion[] = []
  const results: string[] = []
  
  const browser = await getBrowser()
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  })
  
  // Test a subset of modifiers (limit to avoid too many requests)
  for (const mod of modifierPatterns.slice(0, 15)) {
    const pageInstance = await context.newPage()
    const searchTerm = `${keyword} ${mod}`
    const url = `${AMAZON_MARKETPLACES[marketplace]?.baseUrl || AMAZON_MARKETPLACES['com'].baseUrl}/s?k=${encodeURIComponent(searchTerm)}&i=books`
    
    try {
      await pageInstance.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 })
      await pageInstance.waitForTimeout(randomDelay(400, 800))
      
      const html = await pageInstance.content()
      const $ = cheerio.load(html)
      
      const suggestionEls = $('.s-suggestion, .a-list-item a, .a-text-bold')
      suggestionEls.each((_, el) => {
        const text = $(el).text().trim()
        if (text && text.length > 3 && text.length < 80 && text.toLowerCase().includes(keyword.toLowerCase())) {
          results.push(text)
        }
      })
    } catch (e) {}
    
    await pageInstance.close()
  }
  
  await context.close()
  
  // Convert to suggestions
  for (const kw of Array.from(new Set(results)).slice(0, 30)) {
    suggestions.push({
      keyword: kw,
      type: 'related',
      source: 'modifier',
    })
  }
  
  return suggestions
}

export function generateClusters(suggestions: KeywordSuggestion[]): KeywordCluster[] {
  const clustersMap: Record<string, string[]> = {}

  for (const suggestion of suggestions) {
    const words = suggestion.keyword.toLowerCase().split(' ')
    
    // Create clusters based on words
    for (let i = 2; i <= Math.min(words.length, 5); i++) {
      const clusterName = words.slice(0, i).join(' ')
      if (!clustersMap[clusterName]) {
        clustersMap[clusterName] = []
      }
      if (!clustersMap[clusterName].includes(suggestion.keyword)) {
        clustersMap[clusterName].push(suggestion.keyword)
      }
    }
  }
  
  // Convert to array and sort by size
  const clusters: KeywordCluster[] = Object.entries(clustersMap)
    .map(([name, keywords]) => ({
      name,
      keywords,
      volume: keywords.length,
      competition: keywords.length > 10 ? 'high' as const : keywords.length > 5 ? 'medium' as const : 'low' as const,
    }))
    .filter(c => c.keywords.length >= 2)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 20)
  
  return clusters
}

// Main expansion function
export async function expandKeyword(
  keyword: string,
  marketplace: string = 'com'
): Promise<ExpansionResult> {
  console.log(`Expanding keyword: ${keyword}`)
  
  const startTime = Date.now()
  
  // Get base autocomplete
  const baseSuggestions = await getAutocomplete(keyword, marketplace)
  console.log(`Base suggestions: ${baseSuggestions.length}`)
  
  // Get modifier-based suggestions
  const modifierSuggestions = await expandWithModifiers(keyword, marketplace)
  console.log(`Modifier suggestions: ${modifierSuggestions.length}`)
  
  // Get alphabet suggestions
  const alphabetSuggestions = await expandAlphabet(keyword, marketplace)
  console.log(`Alphabet suggestions: ${alphabetSuggestions.length}`)
  
  // Combine all suggestions
  const allSuggestions: KeywordSuggestion[] = [
    ...baseSuggestions.map(k => ({ keyword: k, type: 'autocomplete' as const, source: 'base' })),
    ...modifierSuggestions,
    ...alphabetSuggestions.map(k => ({ keyword: k, type: 'alphabet' as const, source: 'alphabet' })),
  ]
  
  // Deduplicate
  const seen = new Set<string>()
  const uniqueSuggestions = allSuggestions.filter(s => {
    const normalized = s.keyword.toLowerCase().trim()
    if (seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
  
  // Sort by length (longer = more specific = often better)
  uniqueSuggestions.sort((a, b) => b.keyword.length - a.keyword.length)
  
  // Generate clusters
  const clusters = generateClusters(uniqueSuggestions)
  
  console.log(`Total unique keywords: ${uniqueSuggestions.length}`)
  console.log(`Clusters: ${clusters.length}`)
  
  return {
    original: keyword,
    suggestions: uniqueSuggestions.slice(0, 100), // Limit to 100
    clusters,
    totalKeywords: uniqueSuggestions.length,
    expandedAt: new Date().toISOString(),
  }
}

// Get keyword opportunity score
export function calculateKeywordOpportunity(
  keyword: string,
  avgReviews: number,
  totalBooks: number
): { score: number; level: string; recommendations: string[] } {
  const recommendations: string[] = []
  let score = 50
  
  // Long-tail keywords have less competition
  const wordCount = keyword.split(' ').length
  if (wordCount >= 4) {
    score += 20
    recommendations.push('Long-tail keyword - lower competition')
  } else if (wordCount >= 3) {
    score += 10
    recommendations.push('Medium-tail keyword')
  } else {
    score -= 10
    recommendations.push('Short keyword - higher competition')
  }
  
  // Low reviews = opportunity
  if (avgReviews < 100) {
    score += 20
    recommendations.push('Low competition (few reviews)')
  } else if (avgReviews < 500) {
    score += 10
  }
  
  // Market size
  if (totalBooks > 50) {
    score += 10
    recommendations.push('Good market size')
  }
  
  // Buyer intent keywords
  const buyerIntentPatterns = ['best', 'top', 'review', 'buy', 'guide', 'how to']
  const hasBuyerIntent = buyerIntentPatterns.some(p => keyword.toLowerCase().includes(p))
  if (hasBuyerIntent) {
    score += 10
    recommendations.push('Buyer intent keyword')
  }
  
  // Problem-aware keywords
  const problemPatterns = ['for anxiety', 'for stress', 'for beginners', 'for kids']
  const hasProblem = problemPatterns.some(p => keyword.toLowerCase().includes(p))
  if (hasProblem) {
    score += 10
    recommendations.push('Targeted audience keyword')
  }
  
  // Normalize
  score = Math.max(0, Math.min(100, score))
  
  let level = 'Moderate'
  if (score >= 70) level = 'Excellent'
  else if (score >= 50) level = 'Good'
  else if (score < 30) level = 'Poor'
  
  return { score, level, recommendations }
}

// Cache for results
const cache: Map<string, ExpansionResult> = new Map()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export async function getCachedExpansion(
  keyword: string,
  marketplace: string = 'com'
): Promise<ExpansionResult> {
  const cacheKey = `${marketplace}:${keyword}`
  const cached = cache.get(cacheKey)
  
  if (cached) {
    const age = Date.now() - new Date(cached.expandedAt).getTime()
    if (age < CACHE_TTL) {
      console.log(`Using cached expansion for: ${keyword}`)
      return cached
    }
  }
  
  const result = await expandKeyword(keyword, marketplace)
  cache.set(cacheKey, result)
  
  return result
}