import { NextRequest, NextResponse } from 'next/server'
import { estimateSales, SalesInput, SalesOutput } from '@/services/salesEstimator'

export async function POST(request: NextRequest) {
  try {
    const input: SalesInput = await request.json()

    if (!input.price || input.price <= 0) {
      return NextResponse.json(
        { error: 'Valid price is required' },
        { status: 400 }
      )
    }

    const result: SalesOutput = estimateSales(input)

    return NextResponse.json({
      success: true,
      input,
      ...result,
    })
  } catch (error: any) {
    console.error('Sales estimation error:', error)
    return NextResponse.json({ 
      error: error.message,
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'KDP Sales Estimation API',
    version: '1.0.0',
    usage: 'POST with { bsr, price, reviews, category, marketplace }',
  })
}