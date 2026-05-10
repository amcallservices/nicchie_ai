import { NextRequest, NextResponse } from 'next/server'
import { expandKeyword, generateClusters } from '@/services/keywordExpansion'

export async function POST(request: NextRequest) {
  try {
    const { keyword, marketplace = 'com' } = await request.json()

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      )
    }

    // Expand keyword first
    const expansion = await expandKeyword(keyword, marketplace)
    
    // Get or generate clusters
    const clusters = expansion.clusters.length > 0 
      ? expansion.clusters 
      : generateClusters(expansion.suggestions)

    return NextResponse.json({
      keyword,
      clusters,
      totalClusters: clusters.length,
    })
  } catch (error: any) {
    console.error('Keyword clusters error:', error)
    return NextResponse.json({ 
      error: error.message,
      clusters: [],
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Keyword Clusters API',
    version: '1.0.0',
  })
}