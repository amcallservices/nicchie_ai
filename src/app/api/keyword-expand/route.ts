import { NextRequest, NextResponse } from 'next/server'
import { expandKeyword, calculateKeywordOpportunity } from '@/services/keywordExpansion'

export async function POST(request: NextRequest) {
  try {
    const { keyword, marketplace = 'com' } = await request.json()

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      )
    }

    console.log(`Expanding keyword: ${keyword}`)
    
    const result = await expandKeyword(keyword, marketplace)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error: any) {
    console.error('Keyword expansion error:', error)
    return NextResponse.json({ 
      error: error.message,
      suggestions: [],
      clusters: [],
      totalKeywords: 0,
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Keyword Expansion API',
    version: '1.0.0',
    usage: 'POST with { keyword, marketplace }',
  })
}