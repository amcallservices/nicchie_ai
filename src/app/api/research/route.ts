import { NextRequest, NextResponse } from 'next/server'
import { searchAmazonBooks, getBookDetails, analyzeCompetition, calculateOpportunityScore } from '@/services/amazonScraper'

export async function POST(request: NextRequest) {
  try {
    const { keyword, type = 'search', page = 1, marketplace = 'com' } = await request.json()

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      )
    }

    const startTime = Date.now()

    if (type === 'search') {
      const result = await searchAmazonBooks(keyword, page, marketplace)
      const competition = analyzeCompetition(result.books)
      const opportunity = calculateOpportunityScore(
        competition.avgReviews,
        competition.avgRating,
        competition.totalBooks
      )

      return NextResponse.json({
        keyword,
        marketplace: result.marketplace,
        searchResults: result.books,
        totalResults: result.totalResults,
        searchTime: result.searchTime,
        competition,
        opportunity,
        page: result.page,
      })
    }

    if (type === 'details') {
      const book = await getBookDetails(keyword, marketplace)
      if (!book) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 })
      }
      return NextResponse.json({ book, searchTime: Date.now() - startTime })
    }

    if (type === 'deep') {
      const searchResult = await searchAmazonBooks(keyword, 1, marketplace)
      const topBooks = await Promise.all(
        searchResult.books.slice(0, 5).map(async (book) => {
          if (book.asin) return await getBookDetails(book.asin, marketplace)
          return book
        })
      )

      const competition = analyzeCompetition(searchResult.books)
      const opportunity = calculateOpportunityScore(
        competition.avgReviews,
        competition.avgRating,
        competition.totalBooks
      )

      return NextResponse.json({
        keyword,
        marketplace: searchResult.marketplace,
        searchResults: searchResult.books,
        topBooks: topBooks.filter(Boolean),
        totalResults: searchResult.totalResults,
        competition,
        opportunity,
        searchTime: searchResult.searchTime,
      })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error: any) {
    console.error('Research API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'KDP Research API (Playwright)', 
    version: '2.0.0',
  })
}
