import axios from 'axios'
import * as cheerio from 'cheerio'

export const AMAZON_MARKETPLACES: Record<string, { baseUrl: string; domain: string; name: string }> = {
  'com': { baseUrl: 'https://www.amazon.com', domain: '.com', name: 'Amazon.com (US)' },
  'co.uk': { baseUrl: 'https://www.amazon.co.uk', domain: '.co.uk', name: 'Amazon.co.uk (UK)' },
  'de': { baseUrl: 'https://www.amazon.de', domain: '.de', name: 'Amazon.de (Germany)' },
  'it': { baseUrl: 'https://www.amazon.it', domain: '.it', name: 'Amazon.it (Italy)' },
  'fr': { baseUrl: 'https://www.amazon.fr', domain: '.fr', name: 'Amazon.fr (France)' },
  'es': { baseUrl: 'https://www.amazon.es', domain: '.es', name: 'Amazon.es (Spain)' },
  'co.jp': { baseUrl: 'https://www.amazon.co.jp', domain: '.co.jp', name: 'Amazon.co.jp (Japan)' },
  'ca': { baseUrl: 'https://www.amazon.ca', domain: '.ca', name: 'Amazon.ca (Canada)' },
  'com.au': { baseUrl: 'https://www.amazon.com.au', domain: '.com.au', name: 'Amazon.com.au (Australia)' },
  'in': { baseUrl: 'https://www.amazon.in', domain: '.in', name: 'Amazon.in (India)' },
}

type Marketplace = keyof typeof AMAZON_MARKETPLACES
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
]

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

interface AmazonBook {
  title: string
  author: string
  price: number | null
  originalPrice: number | null
  rating: number
  reviews: number
  bsr: string | null
  format: string
  categories: string[]
  imageUrl: string
  url: string
  asin: string
 出版日期: string
  pages: number | null
  publisher: string
  description: string
}

interface SearchResult {
  books: AmazonBook[]
  totalResults: number
  keyword: string
  searchTime: number
  page: number
}

// Parse price from various formats
function parsePrice(priceStr: string | null): number | null {
  if (!priceStr) return null
  const match = priceStr.match(/[\d,]+\.?\d*/)
  if (match) {
    const parsed = parseFloat(match[0].replace(',', ''))
    return isNaN(parsed) ? null : parsed
  }
  return null
}

// Parse review count
function parseReviews(reviewStr: string | null): number {
  if (!reviewStr) return 0
  const match = reviewStr.replace(/,/g, '').match(/\d+/)
  return match ? parseInt(match[0]) : 0
}

// Parse rating
function parseRating(ratingStr: string | null): number {
  if (!ratingStr) return 0
  const match = ratingStr.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

// Parse BSR (Bestseller Rank)
function parseBSR(bsrStr: string | null): string | null {
  if (!bsrStr) return null
  const match = bsrStr.match(/#[\d,]+/)
  return match ? match[0] : null
}

// Extract ASIN from URL
function extractASIN(url: string): string {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/)
  return match ? match[1] : ''
}

// Search Amazon Books
export async function searchAmazonBooks(
  keyword: string,
  page: number = 1,
  category: string = 'books',
  marketplace: Marketplace = 'com'
): Promise<SearchResult> {
  const startTime = Date.now()
  const marketplaceConfig = AMAZON_MARKETPLACES[marketplace]
  
  try {
    // Build search URL
    const encodedKeyword = encodeURIComponent(keyword)
    const searchUrl = `${marketplaceConfig.baseUrl}/s?k=${encodedKeyword}&i=${category}&page=${page}&ref=nb_sb_noss`
    
    const headers = {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    }

    const response = await axios.get(searchUrl, {
      headers,
      timeout: 30000,
      maxRedirects: 5,
    })

    const $ = cheerio.load(response.data)
    const books: AmazonBook[] = []

    // Select book results
    const results = $('div[data-component-type="s-search-result"]')

    results.each((_, element) => {
      const el = $(element)
      
      try {
        // Title and URL
        const titleEl = el.find('h2 a span').first()
        const title = titleEl.text().trim()
        const urlPart = titleEl.parent('a').attr('href')
        const url = urlPart ? `${marketplaceConfig.baseUrl}${urlPart.split('?')[0]}` : ''
        const asin = extractASIN(url || '')
        
        if (!title || !url) return

        // Author
        const author = el.find('.a-color-secondary .a-size-base').first().text().trim() || 'Unknown'

        // Price
        const priceEl = el.find('.a-price-whole').first()
        const priceStr = priceEl.text().trim()
        const price = parsePrice(priceStr)
        
        // Original Price (if discounted)
        const origPriceEl = el.find('.a-text-price .a-offscreen').first()
        const originalPrice = parsePrice(origPriceEl.text().trim())

        // Rating
        const ratingEl = el.find('.a-icon-alt').first()
        const rating = parseRating(ratingEl.text().trim())

        // Reviews
        const reviewsEl = el.find('[aria-label*="stars"]').first()
        const reviews = parseReviews(reviewsEl.attr('aria-label') || '')

        // BSR
        const bsrEl = el.find('#spc-redirect').parent().find('span').first()
        const bsr = bsrEl.text().trim() || null

        // Format
        const formatEl = el.find('.a-badge-text').first()
        const format = formatEl.text().trim() || 'Kindle'

        // Categories
        const categories: string[] = []
        el.find('.a-link-normal s-navigation-no-href').each((_, cat) => {
          const catText = $(cat).text().trim()
          if (catText) categories.push(catText)
        })

        // Image
        const imgEl = el.find('img').first()
        const imageUrl = imgEl.attr('src') || imgEl.attr('data-image-source') || ''

        books.push({
          title,
          author,
          price,
          originalPrice,
          rating,
          reviews,
          bsr,
          format,
          categories,
          imageUrl,
          url,
          asin,
          出版日期: '',
          pages: null,
          publisher: '',
          description: '',
        })
      } catch (parseError) {
        // Skip failed parses
      }
    })

    // Get total results count
    const totalResultsEl = $('#searchResultsTotalCount').first()
    let totalResults = 0
    if (totalResultsEl.length) {
      const totalText = totalResultsEl.text().replace(/,/g, '')
      const match = totalText.match(/\d+/)
      totalResults = match ? parseInt(match[0]) : books.length
    }

    return {
      books,
      totalResults,
      keyword,
      searchTime: Date.now() - startTime,
      page,
    }
  } catch (error: any) {
    console.error('Amazon search error:', error.message)
    return {
      books: [],
      totalResults: 0,
      keyword,
      searchTime: Date.now() - startTime,
      page,
    }
  }
}

// Get book details
export async function getBookDetails(asin: string, marketplace: Marketplace = 'com'): Promise<AmazonBook | null> {
  const marketplaceConfig = AMAZON_MARKETPLACES[marketplace]
  
  try {
    const url = `${marketplaceConfig.baseUrl}/dp/${asin}`
    
    const headers = {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    }

    const response = await axios.get(url, {
      headers,
      timeout: 30000,
    })

    const $ = cheerio.load(response.data)

    // Title
    const title = $('#title').first().text().trim() || 
                  $('#productTitle').first().text().trim() || ''

    if (!title) return null

    // Author
    const author = $('#bylineAuthor').first().text().trim() ||
                  $('.author .a-link-normal').first().text().trim() || 'Unknown'

    // Price
    const priceEl = $('.a-price .a-offscreen').first()
    const price = parsePrice(priceEl.text().trim())

    // Original Price
    const origPriceEl = $('#listPrice').first()
    const originalPrice = parsePrice(origPriceEl.text().trim())

    // Rating
    const ratingEl = $('#averageCustomerReviews').first()
    const rating = parseRating(ratingEl.text().trim())

    // Reviews count
    const reviewsEl = $('#totalReviewCount').first()
    const reviews = parseReviews(reviewsEl.text().trim())

    // BSR
    const bsrEl = $('#SalesRank').first()
    const bsr = parseBSR(bsrEl.text().trim())

    // Format
    const formatEl = $('#binding').first()
    const format = formatEl.text().trim() || 'Kindle'

    // Pages
    const pagesEl = $('#pageCount').first()
    const pagesMatch = pagesEl.text().trim().match(/\d+/)
    const pages = pagesMatch ? parseInt(pagesMatch[0]) : null

    // Publisher & publication date
    const publishEl = $('#detailBullets_feature_div').first()
    const publishText = publishEl.text().trim()
    
    let 出版日期 = ''
    let publisher = ''
    
    const pubMatch = publishText.match(/Publisher:?\s*([^•]+)/i)
    if (pubMatch) {
      publisher = pubMatch[1].trim()
      const dateMatch = publisher.match(/\(?(\w+\s+\d{1,2},?\s+\d{4})\)?/)
      if (dateMatch) {
        出版日期 = dateMatch[1]
        publisher = publisher.replace(dateMatch[0], '').trim()
      }
    }

    // Description
    const descEl = $('#description').first()
    const description = descEl.text().trim() ||
                      $('#feature-bullets').first().text().trim() || ''

    // Categories
    const categories: string[] = []
    $('#wayfinding-breadcrumbs_feature_div a').each((_, el) => {
      const cat = $(el).text().trim()
      if (cat) categories.push(cat)
    })

    // Image
    const imgEl = $('#landingImage')
    const imageUrl = imgEl.attr('src') || ''

    return {
      title,
      author,
      price,
      originalPrice,
      rating,
      reviews,
      bsr,
      format,
      categories,
      imageUrl,
      url,
      asin,
      出版日期,
      pages,
      publisher,
      description,
    }
  } catch (error: any) {
    console.error('Book details error:', error.message)
    return null
  }
}

// Get autocomplete suggestions
export async function getAutocompleteSuggestions(keyword: string): Promise<string[]> {
  try {
    const url = `https://completion.amazon.com/search/browser?utf8=%E2%9C%93&prefix=${encodeURIComponent(keyword)}&zone=hero`
    
    const headers = {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'application/json',
    }

    const response = await axios.get(url, {
      headers,
      timeout: 10000,
    })

    const suggestions: string[] = []
    
    if (response.data && response.data.results) {
      response.data.results.forEach((result: any) => {
        if (result.text) suggestions.push(result.text)
      })
    }

    return suggestions.slice(0, 10)
  } catch (error: any) {
    console.error('Autocomplete error:', error.message)
    return []
  }
}

// Analyze competition
export function analyzeCompetition(books: AmazonBook[]): {
  avgReviews: number
  avgRating: number
  avgPrice: number
  competitionLevel: 'low' | 'medium' | 'high'
  saturation: number
  totalBooks: number
  formats: Record<string, number>
  priceRange: { min: number; max: number }
} {
  if (books.length === 0) {
    return {
      avgReviews: 0,
      avgRating: 0,
      avgPrice: 0,
      competitionLevel: 'low',
      saturation: 0,
      totalBooks: 0,
      formats: {},
      priceRange: { min: 0, max: 0 },
    }
  }

  const reviews = books.map(b => b.reviews)
  const ratings = books.map(b => b.rating)
  const prices = books.filter(b => b.price).map(b => b.price as number)
  
  const avgReviews = Math.round(reviews.reduce((a, b) => a + b, 0) / books.length)
  const avgRating = Math.round((ratings.reduce((a, b) => a + b, 0) / books.length) * 10) / 10
  const avgPrice = Math.round((prices.reduce((a, b) => a + b, 0) / (prices.length || 1)) * 100) / 100

  // Calculate competition level based on reviews
  let competitionLevel: 'low' | 'medium' | 'high' = 'low'
  if (avgReviews > 500) competitionLevel = 'high'
  else if (avgReviews > 100) competitionLevel = 'medium'

  // Saturation based on number of books with prices
  const booksWithPrices = books.filter(b => b.price && b.price > 0).length
  const saturation = Math.round((booksWithPrices / books.length) * 100)

  // Formats
  const formats: Record<string, number> = {}
  books.forEach(b => {
    formats[b.format] = (formats[b.format] || 0) + 1
  })

  return {
    avgReviews,
    avgRating,
    avgPrice,
    competitionLevel,
    saturation,
    totalBooks: books.length,
    formats,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
  }
}

// Calculate opportunity score
export function calculateOpportunityScore(
  avgReviews: number,
  avgRating: number,
  totalBooks: number,
  trend: number = 50,
  demand: number = 50
): {
  score: number
  level: 'poor' | 'fair' | 'good' | 'excellent'
  factors: {
    demand: number
    competition: number
    trend: number
    profitability: number
  }
} {
  // Lower reviews = less competition = higher opportunity
  const competitionScore = Math.max(0, 100 - (avgReviews / 10))
  
  // Higher rating variance = opportunity (people want alternatives)
  const profitabilityScore = avgRating < 4.5 ? 80 : 50

  const score = Math.round(
    (demand * 0.3) + 
    (trend * 0.25) + 
    (competitionScore * 0.25) + 
    (profitabilityScore * 0.2)
  )

  let level: 'poor' | 'fair' | 'good' | 'excellent' = 'poor'
  if (score >= 75) level = 'excellent'
  else if (score >= 60) level = 'good'
  else if (score >= 40) level = 'fair'

  return {
    score,
    level,
    factors: {
      demand,
      competition: competitionScore,
      trend,
      profitability: profitabilityScore,
    },
  }
}