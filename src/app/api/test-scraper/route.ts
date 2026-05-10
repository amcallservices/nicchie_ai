import { NextRequest, NextResponse } from 'next/server'
import { searchAmazonBooks } from '@/services/amazonScraper'

export async function POST(request: NextRequest) {
  const { keyword = 'meal prep', marketplace = 'com' } = await request.json()

  console.log(`[TEST] Scraping "${keyword}" from ${marketplace}`)

  const result = await searchAmazonBooks(keyword, 1, marketplace)

  return NextResponse.json({
    success: true,
    test: 'scraper_health',
    requested: { keyword, marketplace },
    results: {
      booksFound: result.books.length,
      totalResults: result.totalResults,
      searchTime: result.searchTime,
      ...result.debug,
    },
    firstBook: result.books[0] || null,
  })
}

export async function GET() {
  return NextResponse.json({
    message: 'Scraper Test API',
    version: '1.0.0',
    usage: 'POST with { keyword, marketplace }',
  })
}