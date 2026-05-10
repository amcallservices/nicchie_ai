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
    diagnostics?: {
      totalExtracted: number
      validBooks: number
      completeBooks: number
      completeness: number
      missingTitle: number
      missingPrice: number
      missingRating: number
      missingReviews: number
      missingImage: number
      missingUrl: number
      missingAsin: number
    }
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

// AUTO-SCROLL: Lazy load dynamic content
async function autoScroll(page: any): Promise<void> {
  try {
    // Get initial height
    let lastHeight = await page.evaluate(() => document.body.scrollHeight)
    let scrollCount = 0
    const maxScrolls = 5
    
    while (scrollCount < maxScrolls) {
      // Scroll to different positions randomly
      const positions = [
        Math.random() * 0.3,  // 0-30%
        Math.random() * 0.5 + 0.3,  // 30-80%
        Math.random() * 0.7 + 0.3,  // 30-100%
        lastHeight - 500,  // Near bottom
      ]
      
      for (const pos of positions) {
        await page.evaluate((y: number) => window.scrollTo(0, y), pos * lastHeight)
        await page.waitForTimeout(randomDelay(300, 600))
      }
      
      // Scroll back up a bit
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(randomDelay(200, 400))
      
      // Check if new content loaded
      const newHeight = await page.evaluate(() => document.body.scrollHeight)
      if (newHeight === lastHeight) {
        // No new content, try a few more times
        scrollCount++
      } else {
        lastHeight = newHeight
        scrollCount = 0
      }
    }
    
    // Final scroll to top
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(randomDelay(300, 500))
    
  } catch (e: any) {
    console.log('[SCROLL] Auto-scroll error:', e.message)
  }
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
    
    // AUTO-SCROLL: Lazy load dynamic content
    console.log('[SCROLL] Starting auto-scroll...')
    await autoScroll(page_instance)
    console.log('[SCROLL] Auto-scroll complete')
    
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
    
    // Try multiple container selectors
    const containerSelectors = [
      '[data-component-type="s-search-result"]',
      '.s-result-item', 
      '.sg-col-inner',
      'div[data-asin]',
      '.a-card-container',
      '.s-ad-container',
    ]
    
    // Try each container selector
    for (const selector of containerSelectors) {
      const elements = $(selector)
      console.log(`[EXTRACT] Selector "${selector}": ${elements.length} found`)
      
      if (elements.length === 0) continue
      
      // Extract books from this container type
      let extracted = 0
      elements.each((_, element) => {
        try {
          const el = $(element)
          const asin = el.attr('data-asin') || ''
          if (!asin || asin.length < 5) return
          
          // Multi-selector for title
          let title = ''
          const titleSelectors = ['h2 span', '.a-size-medium', '.a-text-bold', 'h2 a span']
          for (const sel of titleSelectors) {
            const t = el.find(sel).first().text().trim()
            if (t) { title = t; break }
          }
          if (!title || title.length < 3) return
          
          // URL
          const urlEl = el.find('h2 a').first()
          let url = ''
          if (urlEl.length) {
            url = marketplaceConfig.baseUrl + (urlEl.attr('href') || '').split('?')[0]
          }
          
          // Author
          let author = 'Unknown'
          const authorSelectors = ['.a-color-secondary', '.a-size-base']
          for (const sel of authorSelectors) {
            const a = el.find(sel).first().text().trim()
            if (a && a.length > 2) { author = a; break }
          }
          
          // Price
          let price = ''
          const priceEl = el.find('.a-price, .a-price-whole').first()
          if (priceEl.length) price = priceEl.text().trim()
          
          // Image
          const imgEl = el.find('img').first()
          const imageUrl = imgEl.attr('src') || imgEl.attr('data-old-hi-res') || ''
          
          books.push({
            title,
            author,
            price,
            rating: 0,
            reviews: 0,
            url,
            imageUrl,
            asin,
          })
          extracted++
        } catch (e) {}
      })
      
      if (extracted > 0) {
        console.log(`[EXTRACT] ✅ Success: ${extracted} books from "${selector}"`)
        break
      }
    }
    
    // If still no books, try raw HTML extraction
    if (books.length === 0) {
      console.log('[EXTRACT] ⚠️ Trying raw HTML regex extraction...')
      
      // Extract using regex on raw HTML
      const asinRegex = /data-asin="([A-Z0-9]{10})"/g
      let match
      let count = 0
      
      while ((match = asinRegex.exec(html)) !== null && count < 20) {
        const asin = match[1]
        
        // Find nearby title
        const startIdx = Math.max(0, match.index - 500)
        const endIdx = match.index
        const snippet = html.substring(startIdx, endIdx)
        
        // Extract title from h2 tag before this ASIN
        const titleMatch = snippet.match(/<h2[^>]*>([^<]{5,150})<\/h2>/)
        const title = titleMatch ? titleMatch[1].trim() : ''
        
        if (title && !title.includes('class="a-text-ellipsis"')) {
          books.push({
            title,
            author: 'Unknown',
            price: '',
            rating: 0,
            reviews: 0,
            url: `${marketplaceConfig.baseUrl}/dp/${asin}`,
            imageUrl: '',
            asin,
          })
          count++
        }
      }
      
      console.log(`[EXTRACT] Regex extraction: ${books.length} books`)
    }
    
    console.log(`[EXTRACT] Total raw books: ${books.length}`)
    
    // DIAGNOSTICS: Calculate field completeness
    let completeBooks = 0
    let missingTitle = 0, missingPrice = 0, missingRating = 0, missingReviews = 0, missingImage = 0, missingUrl = 0, missingAsin = 0
    
    const validBooks: AmazonBook[] = []
    
    for (const book of books) {
      const hasTitle = book.title && book.title.length > 3
      const hasPrice = book.price && book.price.length > 0
      const hasRating = book.rating > 0
      const hasReviews = book.reviews > 0
      const hasImage = book.imageUrl && book.imageUrl.length > 10
      const hasUrl = book.url && book.url.length > 10
      const hasAsin = book.asin && book.asin.length === 10
      
      if (!hasTitle) missingTitle++
      if (!hasPrice) missingPrice++
      if (!hasRating) missingRating++
      if (!hasReviews) missingReviews++
      if (!hasImage) missingImage++
      if (!hasUrl) missingUrl++
      if (!hasAsin) missingAsin++
      
      // Valid book must have: title + (url OR price)
      if (hasTitle && (hasUrl || hasPrice)) {
        validBooks.push(book)
        if (hasPrice && hasRating && hasReviews) completeBooks++
      }
    }
    
    // Filter to only valid books
    const finalBooks = books.filter(b => 
      b.title && b.title.length > 3 && 
      (b.url?.length > 10 || b.price?.length > 0)
    )
    
    // Calculate completeness percentage
    const totalFields = finalBooks.length * 7 // 7 fields per book
    const filledFields = (finalBooks.length - missingTitle) + (finalBooks.length - missingPrice) + (finalBooks.length - missingRating) + 
                   (finalBooks.length - missingReviews) + (finalBooks.length - missingImage) + 
                   (finalBooks.length - missingUrl) + (finalBooks.length - missingAsin)
    const completeness = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
    
    console.log(`[DIAGNOSTICS]
  - Total extracted: ${books.length}
  - Valid books: ${finalBooks.length}
  - Complete books: ${completeBooks}
  - Completeness: ${completeness}%
  - Missing: title=${missingTitle}, price=${missingPrice}, rating=${missingRating}, reviews=${missingReviews}, image=${missingImage}, url=${missingUrl}, asin=${missingAsin}
`)
    
    // Get total results
    let totalResults = 0
    const resultsCountEl = $('#s-results-count-left').first()
    const resultsText = resultsCountEl.text()
    const totalMatch = resultsText?.match(/([\d,]+)\s+result/)
    if (totalMatch) {
      totalResults = parseReviews(totalMatch[1])
    }

    await context.close()

    console.log(`[SCRAPER] Extracted ${finalBooks.length} valid books`)

    return {
      books: finalBooks.slice(0, 20),
      totalResults: totalResults || finalBooks.length,
      keyword,
      searchTime: Date.now() - startTime,
      page,
      marketplace: marketplaceConfig.name,
      debug: {
        htmlLength: html.length,
        pageTitle: $('title').text().substring(0, 50),
        cardsFound: finalBooks.length,
        extractionStatus: finalBooks.length > 0 ? 'success' : 'empty',
        diagnostics: {
          totalExtracted: books.length,
          validBooks: finalBooks.length,
          completeBooks,
          completeness,
          missingTitle,
          missingPrice,
          missingRating,
          missingReviews,
          missingImage,
          missingUrl,
          missingAsin,
        },
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