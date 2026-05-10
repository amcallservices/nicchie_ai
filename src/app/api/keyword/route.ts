import { NextRequest, NextResponse } from 'next/server'
import { getAutocompleteSuggestions, searchAmazonBooks } from '@/lib/amazon-scraper'

// Generate keyword variations based on seed
function generateKeywordVariations(keyword: string): string[] {
  const variations: string[] = [keyword]
  const prefixes = [
    'how to', 'best', 'guide', 'for beginners', 'easy',
    'step by step', 'complete', 'ultimate', 'practical',
  ]
  const suffixes = [
    'guide', 'book', 'pdf', 'ebook', 'workbook',
    'planner', 'journal', 'for men', 'for women',
    'over 40', 'over 50', '2024', '2025',
  ]

  prefixes.forEach(p => variations.push(`${p} ${keyword}`))
  suffixes.forEach(s => variations.push(`${keyword} ${s}`))

  return variations.slice(0, 20)
}

// Estimate search volume based on competition
function estimateSearchVolume(booksCount: number, competition: string): number {
  let baseVolume = 100
  
  if (competition === 'low') baseVolume = 5000
  else if (competition === 'medium') baseVolume = 2000
  else baseVolume = 500

  // Adjust based on book count
  if (booksCount > 100) baseVolume *= 2
  else if (booksCount < 10) baseVolume /= 2

  return Math.round(baseVolume * (0.5 + Math.random()))
}

// Calculate keyword opportunity score
function calculateKeywordOpportunity(
  searchVolume: number,
  difficulty: number,
  booksCount: number
): number {
  // Volume * (1 - difficulty/100) * (1/books normalized)
  const volumeScore = Math.min(100, searchVolume / 100)
  const difficultyScore = 100 - difficulty
  const competitionScore = Math.max(0, 100 - (booksCount * 0.5))

  return Math.round((volumeScore * 0.4) + (difficultyScore * 0.3) + (competitionScore * 0.3))
}

export async function POST(request: NextRequest) {
  try {
    const { keyword, includeSuggestions = true } = await request.json()

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
    }

    // Get autocomplete suggestions
    let suggestions: string[] = []
    if (includeSuggestions) {
      suggestions = await getAutocompleteSuggestions(keyword)
    }

    // Generate variations
    const variations = generateKeywordVariations(keyword)

    // Analyze each variation by searching
    const keywordData = await Promise.all(
      variations.slice(0, 10).map(async (kw) => {
        const result = await searchAmazonBooks(kw, 1)
        
        const difficulty = Math.min(100, Math.round(50 + (result.books.length * 2)))
        const volume = estimateSearchVolume(result.books.length, difficulty > 70 ? 'high' : 'low')
        const opportunity = calculateKeywordOpportunity(volume, difficulty, result.books.length)

        // Determine intent
        let intent = 'informational'
        if (kw.includes('best ') || kw.includes('top ') || kw.includes('review')) {
          intent = 'commercial'
        } else if (kw.includes('buy ') || kw.includes('price ')) {
          intent = 'transactional'
        }

        return {
          keyword: kw,
          volume,
          difficulty,
          opportunityScore: opportunity,
          intent,
          booksFound: result.books.length,
        }
      })
    )

    // Sort by opportunity score
    keywordData.sort((a, b) => b.opportunityScore - a.opportunityScore)

    return NextResponse.json({
      keyword,
      suggestions: suggestions.slice(0, 10),
      keywords: keywordData,
      totalKeywordCount: variations.length,
    })
  } catch (error: any) {
    console.error('Keyword API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Keyword Analysis API', version: '1.0.0' })
}