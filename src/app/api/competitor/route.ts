import { NextRequest, NextResponse } from 'next/server'
import { searchAmazonBooks, getBookDetails, analyzeCompetition } from '@/lib/amazon-scraper'
import OpenAI from 'openai'

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY')
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

// Analyze what's missing from competitors
function analyzeGaps(books: any[]): string[] {
  const gaps: string[] = []
  const formats = new Set(books.map(b => b.format))
  const priceRange = books.filter(b => b.price).map(b => b.price)
  
  if (!formats.has('workbook')) gaps.push('No interactive workbooks')
  if (!formats.has('journal')) gaps.push('No journals/planners')
  if (!formats.has('pdf')) gaps.push('No digital downloadable')
  
  const avgPrice = priceRange.reduce((a, b) => a + b, 0) / priceRange.length
  if (avgPrice < 15) gaps.push('Opportunity for premium pricing')
  if (avgPrice > 30) gaps.push('Opportunity for budget pricing')

  return gaps
}

export async function POST(request: NextRequest) {
  try {
    const { niche, limit = 20 } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    // Search Amazon for competitors
    const result = await searchAmazonBooks(niche, 1)
    
    if (result.books.length === 0) {
      return NextResponse.json({ error: 'No competitors found' }, { status: 404 })
    }

    // Get detailed info for top books
    const topBooks = await Promise.all(
      result.books.slice(0, Math.min(10, limit)).map(async (book) => {
        try {
          if (book.asin) {
            return await getBookDetails(book.asin)
          }
        } catch {}
        return book
      })
    )

    const competition = analyzeCompetition(result.books)
    const gaps = analyzeGaps(topBooks.filter(Boolean))

    // Generate AI insights
    let aiInsights: any = null
    try {
      const openai = getOpenAI()
      
      const summary = topBooks.filter(Boolean).slice(0, 5).map((b: any) => 
        `- "${b?.title || 'Unknown'}" by ${b?.author || 'Unknown'} ($${b?.price || 0}, ⭐${b?.rating || 0}, ${b?.reviews || 0} reviews)`
      ).join('\n')

      const prompt = `You are a KDP market analyst. Analyze these top competitors in the "${niche}" niche:

${summary}

Provide JSON with:
- strengths: 5 things they do well
- weaknesses: 5 gaps or problems
- opportunities: 5 concrete opportunities to beat them
- bestFormats: Best book formats for this niche
- priceRange: Sweet spot price range
- keyTopics: Topics that are covered
- missingTopics: Gaps in the market
- audienceSegments: Underserved reader groups

Return ONLY valid JSON.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      })

      aiInsights = JSON.parse(completion.choices[0]?.message?.content || '{}')
    } catch (aiError: any) {
      console.error('AI insights error:', aiError.message)
    }

    return NextResponse.json({
      niche,
      competitors: topBooks.filter(Boolean).slice(0, limit),
      competition,
      gaps,
      aiInsights,
      totalFound: result.books.length,
    })
  } catch (error: any) {
    console.error('Competitor API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Competitor Analysis API', version: '1.0.0' })
}