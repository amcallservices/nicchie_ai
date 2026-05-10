import { chromium, Browser, Page } from 'playwright'
import * as cheerio from 'cheerio'

const AMAZON_MARKETPLACES: Record<string, { baseUrl: string; name: string }> = {
  'com': { baseUrl: 'https://www.amazon.com', name: 'Amazon.com (US)' },
  'co.uk': { baseUrl: 'https://www.amazon.co.uk', name: 'Amazon.co.uk (UK)' },
  'de': { baseUrl: 'https://www.amazon.de', name: 'Amazon.de (Germany)' },
  'it': { baseUrl: 'https://www.amazon.it', name: 'Amazon.it (Italy)' },
  'fr': { baseUrl: 'https://www.amazon.fr', name: 'Amazon.fr (France)' },
  'es': { baseUrl: 'https://www.amazon.es', name: 'Amazon.es (Spain)' },
}

export interface AmazonBook {
  title: string
  author: string
  price: string
  originalPrice?: string
  rating: number
  reviews: number
  url: string
  imageUrl: string
  asin: string
  isPrime?: boolean
  isBestseller?: boolean
  format?: string
  pages?: number
  publicationDate?: string
}

export interface SearchResult {
  books: AmazonBook[]
  totalResults: number
  keyword: string
  searchTime: number
  page: number
  marketplace: string
  blocked?: boolean
  blockReason?: string
  debug?: {
    htmlLength: number
    pageTitle: string
    cardsFound: number
    extractionStatus: string
  }
}

export interface CompetitionAnalysis {
  totalBooks: number
  avgPrice: number
  avgReviews: number
  avgRating: number
  priceRange: { min: number; max: number }
  topAuthors: string[]
  ratingDistribution: { [key: string]: number }
}

// Browser instance singleton
let browser: Browser | null = null

// Manual stealth implementation
async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    // Stealth launch with anti-detection args
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-scheduler',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-sync',
        '--disable-translate',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-first-run',
        '--safebrowsing-disable-auto-update',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
        '--ignore-certificate-errors-spki-list',
      ],
    })
  }
  return browser
}

async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close()
    browser = null
  }
}

// Get random delay for anti-bot
function randomDelay(min: number = 1000, max: number = 3000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Extract ASIN from URL
function extractASIN(url: string): string {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/) || url.match(/\/gp\/product\/([A-Z0-9]{10})/)
  return match ? match[1] : ''
}

// Parse price string to number
function parsePrice(priceStr: string): number {
  if (!priceStr) return 0
  const cleaned = priceStr.replace(/[^0-9.,]/g, '').replace(',', '.')
  const match = cleaned.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

// Parse review count
function parseReviews(reviewStr: string): number {
  if (!reviewStr) return 0
  const cleaned = reviewStr.replace(/[^0-9,]/g, '')
  if (cleaned.includes(',')) {
    return parseInt(cleaned.replace(/,/g, '')) || 0
  }
  return parseInt(cleaned) || 0
}

export async function searchAmazonBooks(
  keyword: string,
  page: number = 1,
  marketplace: string = 'com'
): Promise<SearchResult> {
  const startTime = Date.now()
  const marketplaceConfig = AMAZON_MARKETPLACES[marketplace] || AMAZON_MARKETPLACES['com']
  
  // Stealth: Random viewport
  const viewports = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1536, height: 864 },
  ]
  const viewport = viewports[Math.floor(Math.random() * viewports.length)]
  
  // Stealth: Realistic user agents
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  ]
  const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)]
  
  try {
    const browser = await getBrowser()
    const context = await browser.newContext({
      viewport,
      userAgent,
      // Stealth: Locale settings
      locale: 'en-US',
      timezoneId: 'America/New_York',
      permissions: ['geolocation'],
      // Stealth: Extra headers
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    })
    
    const page_instance = await context.newPage()
    
    // Stealth: Remove webdriver property
    await page_instance.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
    })
    
    // Build search URL
    const encodedKeyword = encodeURIComponent(keyword)
    const searchUrl = `${marketplaceConfig.baseUrl}/s?k=${encodedKeyword}&i=books&page=${page}&ref=nb_sb_noss`
    
    console.log(`Searching: ${searchUrl}`)
    console.log(`[STEALTH] User-Agent: ${userAgent.substring(0, 30)}...`)
    
    await page_instance.goto(searchUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    })
    
    // Random delay before interaction
    await page_instance.waitForTimeout(randomDelay(1500, 2500))
    
    // Stealth: Simulate human behavior - move mouse
    await page_instance.mouse.move(Math.random() * 500, Math.random() * 500)
    await page_instance.waitForTimeout(randomDelay(200, 500))
    
    // Try to handle any overlays
    try {
      await page_instance.click('body', { timeout: 2000 }).catch(() => {})
    } catch (e) {}
    
    // Get page content
    const html = await page_instance.content()
    const $ = cheerio.load(html)
    
    // DEBUG: Log extraction details
    const pageTitle = $('title').text()
    console.log(`[SCRAPER] Page title: ${pageTitle.substring(0, 50)}`)
    console.log(`[SCRAPER] Raw HTML length: ${html.length}`)
    
    // Check for Amazon blocks
    const isBlocked = (
      pageTitle.toLowerCase().includes('robot') ||
      pageTitle.toLowerCase().includes('captcha') ||
      pageTitle.toLowerCase().includes('sorry') ||
      pageTitle.toLowerCase().includes('verify') ||
      pageTitle.toLowerCase().includes('challenge') ||
      html.includes('captcha') ||
      html.includes('sorry') && html.includes('interpret') ||
      html.includes('Verify you are human') ||
      html.includes('checking your browser') ||
      html.includes('one-time')
    )
    
    if (isBlocked) {
      console.log('[SCRAPER] 🚫 BLOCKED: Amazon anti-bot detected')
      console.log('[SCRAPER] Page title:', pageTitle.substring(0, 80))
      
      // Try to take screenshot for debug
      try {
        const screenshot = await page_instance.screenshot()
        console.log(`[SCRAPER] Screenshot available: ${screenshot.length} bytes`)
      } catch (e) {}
      
      await context.close()
      return {
        books: [],
        totalResults: 0,
        keyword,
        searchTime: Date.now() - startTime,
        page,
        marketplace: marketplaceConfig.name,
        blocked: true,
        blockReason: pageTitle.substring(0, 50) || 'Amazon anti-bot triggered',
      }
    }
    
    // Check for empty/no results
    const noResults = html.includes('No results for') || html.includes('nessun risultato') || html.includes('Aucun résultat')
    if (noResults) {
      console.log('[SCRAPER] No results found')
    }
    
    const books: AmazonBook[] = []
    
    // Try multiple selectors for book cards
    const bookCards = $('div[data-component-type="sb-product-search-result"], div.s-result-item, div[data-asin]')
    
    console.log(`Found ${bookCards.length} potential book cards`)
    
    bookCards.each((_, element) => {
      try {
        const el = $(element)
        const asin = el.attr('data-asin') || ''
        
        if (!asin || asin === ' ' || asin.length < 5) return
        
        // Title - try multiple selectors
        let title = ''
        const titleEl = el.find('h2 a span, a.a-text-bold span, .a-text-normal span').first()
        title = titleEl.text().trim() || el.find('h2').text().trim()
        
        if (!title) return
        
        // URL
        const urlPart = el.find('h2 a, a.a-link-normal').first().attr('href') || ''
        const url = urlPart ? `${marketplaceConfig.baseUrl}${urlPart.split('?')[0]}` : ''
        
        // Author
        const author = el.find('.a-color-secondary .a-size-base, .a-color-secondary').first().text().trim() || 'Unknown'
        
        // Price
        let price = ''
        const priceEl = el.find('.a-price-whole, .a-price .a-offscreen').first()
        price = priceEl.text().trim() || el.find('.a-price').text().trim()
        
        // Original price (if discounted)
        const originalPriceEl = el.find('.a-text-price').first()
        const originalPrice = originalPriceEl.text().trim()
        
        // Rating
        let rating = 0
        const ratingEl = el.find('.a-icon-alt, [aria-label*="star"]').first()
        const ratingText = ratingEl.text().trim()
        const ratingMatch = ratingText?.match(/([\d.]+)/)
        rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0
        
        // Reviews count
        let reviews = 0
        const reviewsEl = el.find('.a-size-base.s-link-style, [aria-label*="review"]').first()
        const reviewsText = reviewsEl.text().trim()
        reviews = parseReviews(reviewsText)
        
        // Image
        const imageEl = el.find('img').first()
        let imageUrl = imageEl.attr('src') || imageEl.attr('data-old-hi-res') || ''
        
        // Prime badge
        const isPrime = el.find('.a-icon-prime').length > 0
        
        // Bestseller badge
        const isBestseller = el.find('.a-badge Bestseller').length > 0 || el.find('text=Bestseller').length > 0
        
        books.push({
          title,
          author,
          price,
          originalPrice: originalPrice || undefined,
          rating,
          reviews,
          url,
          imageUrl,
          asin,
          isPrime: isPrime || undefined,
          isBestseller: isBestseller || undefined,
        })
      } catch (e) {
        // Skip broken entries
      }
    })
    
    // If no books found with first method, try alternative selectors
    if (books.length === 0) {
      const altCards = $('div.s-card-container, .product-result')
      altCards.each((_, element) => {
        try {
          const el = $(element)
          const titleEl = el.find('h3, h2, .product-title').first()
          const title = titleEl.text().trim()
          
          if (!title || title.length < 3) return
          
          const linkEl = el.find('a').first()
          const urlPart = linkEl.attr('href') || ''
          const url = urlPart ? `${marketplaceConfig.baseUrl}${urlPart.split('?')[0]}` : ''
          const asin = extractASIN(url)
          
          books.push({
            title,
            author: el.find('.author, .contributorName').first().text().trim() || 'Unknown',
            price: el.find('.a-price, .price').first().text().trim(),
            rating: 0,
            reviews: 0,
            url,
            imageUrl: el.find('img').first().attr('src') || '',
            asin,
          })
        } catch (e) {}
      })
    }
    
    // Get total results
    let totalResults = 0
    const resultsCountEl = $('#s-results-count-left').first()
    const resultsText = resultsCountEl.text()
    const totalMatch = resultsText?.match(/([\d,]+)\s+result/)
    if (totalMatch) {
      totalResults = parseReviews(totalMatch[1])
    }
    
    await context.close()
    
    console.log(`[SCRAPER] Extracted ${books.length} books`)
    
    return {
      books: books.slice(0, 20),
      totalResults: totalResults || books.length,
      keyword,
      searchTime: Date.now() - startTime,
      page,
      marketplace: marketplaceConfig.name,
      debug: {
        htmlLength: html.length,
        pageTitle: $('title').text().substring(0, 50),
        cardsFound: books.length,
        extractionStatus: books.length > 0 ? 'success' : 'empty',
      },
    }
  } catch (error: any) {
    console.error('Amazon search error:', error.message)
    return {
      books: [],
      totalResults: 0,
      keyword,
      searchTime: Date.now() - startTime,
      page,
      marketplace: marketplaceConfig.name,
      blocked: error.message.includes('blocked') || error.message.includes('403'),
      blockReason: error.message.includes('blocked') ? 'Amazon blocked' : 'Scraper error',
      debug: {
        htmlLength: 0,
        pageTitle: 'Error',
        cardsFound: 0,
        extractionStatus: 'error',
      },
    }
  }
}

export async function getBookDetails(
  asin: string,
  marketplace: string = 'com'
): Promise<AmazonBook | null> {
  const marketplaceConfig = AMAZON_MARKETPLACES[marketplace] || AMAZON_MARKETPLACES['com']
  
  try {
    const browser = await getBrowser()
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })
    
    const page_instance = await context.newPage()
    const url = `${marketplaceConfig.baseUrl}/dp/${asin}`
    
    console.log(`Getting book details: ${url}`)
    
    await page_instance.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    })
    
    await page_instance.waitForTimeout(randomDelay(1500, 2500))
    
    const html = await page_instance.content()
    const $ = cheerio.load(html)
    
    // Title
    const title = $('#productTitle').text().trim() || 
                $('h1#title').text().trim() || 
                $('h1').text().trim()
    
    // Author
    let author = ''
    const authorEl = $('#bylineAuthor, .author .a-link-normal').first()
    author = authorEl.text().trim()
    if (!author) {
      author = $('.contributorName').first().text().trim()
    }
    
    // Price
    const priceEl = $('.a-price .a-offscreen, #priceblock_ourprice, #priceblock_dealprice').first()
    const price = priceEl.text().trim() || 
                 $('.a-color-price').first().text().trim()
    
    // Rating
    const ratingEl = $('#avgRating, .a-icon-alt').first()
    const ratingText = ratingEl.text().trim()
    const ratingMatch = ratingText?.match(/([\d.]+)/)
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0
    
    // Reviews
    const reviewsEl = $('#totalReviewCount, #acrCustomerReviewLink').first()
    const reviewsText = reviewsEl.text().trim()
    const reviews = parseReviews(reviewsText)
    
    // Image
    const imageEl = $('#landingImage, #imgBlkFront').first()
    const imageUrl = imageEl.attr('src') || ''
    
    // Format (Paperback, Hardcover, Kindle)
    let format = ''
    const formatEl = $('[data-asin-format], .format').first()
    format = formatEl.text().trim()
    
    // Pages
    let pages: number | undefined
    const pagesEl = $('[data-asin-pagecount], .page-count').first()
    const pagesText = pagesEl.text().trim()
    const pagesMatch = pagesText?.match(/(\d+)/)
    if (pagesMatch) {
      pages = parseInt(pagesMatch[1])
    }
    
    // Publication date
    const pubDateEl = $('#detailBullets_feature_div .a-text-bold').first()
    const publicationDate = pubDateEl.text().trim()
    
    await context.close()
    
    if (!title) return null
    
    return {
      title,
      author: author || 'Unknown',
      price,
      rating,
      reviews,
      url,
      imageUrl,
      asin,
      format: format || undefined,
      pages,
      publicationDate: publicationDate || undefined,
    }
  } catch (error: any) {
    console.error('Book details error:', error.message)
    return null
  }
}

export async function getAutocompleteSuggestions(
  keyword: string,
  marketplace: string = 'com'
): Promise<string[]> {
  const marketplaceConfig = AMAZON_MARKETPLACES[marketplace] || AMAZON_MARKETPLACES['com']
  
  try {
    const browser = await getBrowser()
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })
    
    const page_instance = await context.newPage()
    const url = `${marketplaceConfig.baseUrl}/s?k=${encodeURIComponent(keyword)}&i=books`
    
    await page_instance.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    })
    
    await page_instance.waitForTimeout(1000)
    
    const html = await page_instance.content()
    const $ = cheerio.load(html)
    
    const suggestions: string[] = []
    
    // Amazon's autocomplete suggestions
    const suggestionsEl = $('.s-suggestion, .a-list-item .s-input-suggestions')
    suggestionsEl.each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 2) {
        suggestions.push(text)
      }
    })
    
    await context.close()
    
    return suggestions.slice(0, 10)
  } catch (error: any) {
    console.error('Autocomplete error:', error.message)
    return []
  }
}

export async function getReviews(
  asin: string,
  marketplace: string = 'com',
  maxReviews: number = 10
): Promise<{ positive: string[]; negative: string[]; averageRating: number }> {
  const marketplaceConfig = AMAZON_MARKETPLACES[marketplace] || AMAZON_MARKETPLACES['com']
  
  const positive: string[] = []
  const negative: string[] = []
  let averageRating = 0
  
  try {
    const browser = await getBrowser()
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })
    
    const page_instance = await context.newPage()
    const url = `${marketplaceConfig.baseUrl}/product-reviews/${asin}`
    
    await page_instance.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    })
    
    await page_instance.waitForTimeout(randomDelay(1500, 2500))
    
    const html = await page_instance.content()
    const $ = cheerio.load(html)
    
    // Overall rating
    const ratingEl = $('#averageCustomerReviews .a-icon-alt').first()
    const ratingText = ratingEl.text().trim()
    const ratingMatch = ratingText?.match(/([\d.]+)/)
    if (ratingMatch) {
      averageRating = parseFloat(ratingMatch[1])
    }
    
    // Review cards
    const reviewCards = $('[data-hook="review"], .review')
    
    reviewCards.each((i, el) => {
      if (i >= maxReviews) return
      
      const reviewEl = $(el)
      const text = reviewEl.find('[data-hook="review-body"], .review-text').text().trim()
      
      if (!text) return
      
      // Star rating
      const stars = reviewEl.find('[data-hook="helpful-vote-stars"], .a-link-normal').text().trim()
      const starMatch = stars?.match(/(\d+)/)
      const starsCount = starMatch ? parseInt(starMatch[1]) : 0
      
      if (starsCount >= 4) {
        positive.push(text)
      } else if (starsCount <= 2) {
        negative.push(text)
      }
    })
    
    await context.close()
  } catch (error: any) {
    console.error('Reviews error:', error.message)
  }
  
  return { positive, negative, averageRating }
}

export function analyzeCompetition(books: AmazonBook[]): CompetitionAnalysis {
  if (!books || books.length === 0) {
    return {
      totalBooks: 0,
      avgPrice: 0,
      avgReviews: 0,
      avgRating: 0,
      priceRange: { min: 0, max: 0 },
      topAuthors: [],
      ratingDistribution: {},
    }
  }
  
  let totalPrice = 0
  let totalReviews = 0
  let totalRating = 0
  const authors: { [key: string]: number } = {}
  const prices: number[] = []
  const ratings: { [key: string]: number } = {}
  
  books.forEach((book) => {
    // Price
    const price = parsePrice(book.price)
    if (price > 0) {
      totalPrice += price
      prices.push(price)
    }
    
    // Reviews
    totalReviews += book.reviews
    
    // Rating
    if (book.rating > 0) {
      totalRating += book.rating
      const ratingKey = Math.floor(book.rating).toString()
      ratings[ratingKey] = (ratings[ratingKey] || 0) + 1
    }
    
    // Author
    if (book.author && book.author !== 'Unknown') {
      authors[book.author] = (authors[book.author] || 0) + 1
    }
  })
  
  const sortedAuthors = Object.entries(authors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([author]) => author)
  
  const sortedPrices = prices.sort((a, b) => a - b)
  
  return {
    totalBooks: books.length,
    avgPrice: prices.length > 0 ? totalPrice / prices.length : 0,
    avgReviews: totalReviews / books.length,
    avgRating: books.filter(b => b.rating > 0).length > 0 ? totalRating / books.filter(b => b.rating > 0).length : 0,
    priceRange: { 
      min: sortedPrices[0] || 0, 
      max: sortedPrices[sortedPrices.length - 1] || 0 
    },
    topAuthors: sortedAuthors,
    ratingDistribution: ratings,
  }
}

export function calculateOpportunityScore(
  avgReviews: number,
  avgRating: number,
  totalBooks: number
): { score: number; level: string; factors: string[] } {
  const factors: string[] = []
  let score = 50
  
  // Low competition = high opportunity
  if (avgReviews < 50) {
    score += 20
    factors.push('Low competition (few reviews)')
  } else if (avgReviews < 200) {
    score += 10
    factors.push('Medium competition')
  } else {
    score -= 10
    factors.push('High competition')
  }
  
  // Quality gap = opportunity
  if (avgRating < 4.0) {
    score += 15
    factors.push('Quality gap available')
  } else if (avgRating < 4.5) {
    score += 5
  }
  
  // Market size consideration
  if (totalBooks > 100) {
    score += 10
    factors.push('Large market')
  } else if (totalBooks > 20) {
    score += 5
  } else if (totalBooks < 5) {
    score -= 15
    factors.push('Small market')
  }
  
  // Normalize score
  score = Math.max(0, Math.min(100, score))
  
  let level = 'Moderate'
  if (score >= 70) level = 'Excellent'
  else if (score >= 50) level = 'Good'
  else if (score < 30) level = 'Poor'
  
  return { score, level, factors }
}