import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'
import OpenAI from 'openai'

const AMAZON_BASE_URL = 'https://www.amazon.com'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

interface Review {
  id: string
  author: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
  asin: string
}

async function getReviews(asin: string, maxReviews: number = 20): Promise<Review[]> {
  const reviews: Review[] = []
  
  try {
    // Try multiple review endpoints
    const urls = [
      `${AMAZON_BASE_URL}/dp/product/${asin}/reviews?sortBy=recent&pageSize=10`,
      `${AMAZON_BASE_URL}/product-reviews/${asin}/`,
    ]

    for (const url of urls) {
      try {
        const response = await axios.get(url, {
          headers: { 'User-Agent': USER_AGENT },
          timeout: 15000,
        })

        const $ = cheerio.load(response.data)
        
        // Parse reviews
        $('.review').each((_, el) => {
          if (reviews.length >= maxReviews) return

          const reviewEl = $(el)
          
          const author = reviewEl.find('.a-profile-name').text().trim() || 'Anonymous'
          const ratingStr = reviewEl.find('[data-hook="review-star-rating"]').text().trim()
          const rating = parseFloat(ratingStr.replace(/ out of .+/, '')) || 0
          const title = reviewEl.find('[data-hook="review-title"]').text().trim()
          const content = reviewEl.find('[data-hook="review-body"]').text().trim()
          const date = reviewEl.find('[data-hook="review-date"]').text().trim() || ''
          const verified = reviewEl.find('.a-icon-checkmark').length > 0
          const helpfulEl = reviewEl.find('[data-hook="helpful-vote-stars"]').text().trim()
          const helpful = parseInt(helpfulEl.replace(/[^0-9]/g, '')) || 0

          if (content) {
            reviews.push({
              id: `r${reviews.length + 1}`,
              author,
              rating,
              title,
              content,
              date,
              verified,
              helpful,
              asin,
            })
          }
        })

        if (reviews.length > 0) break
      } catch {}
    }
  } catch (error) {
    console.error('Review fetch error:', error)
  }

  return reviews.slice(0, maxReviews)
}

export async function POST(request: NextRequest) {
  try {
    const { asin, maxReviews = 20 } = await request.json()

    if (!asin) {
      return NextResponse.json({ error: 'ASIN is required' }, { status: 400 })
    }

    // Fetch reviews from Amazon
    const reviews = await getReviews(asin, maxReviews)

    if (reviews.length === 0) {
      return NextResponse.json({
        asin,
        reviews: [],
        summary: 'No reviews found - Amazon may be blocking requests',
        insights: null,
      })
    }

    // Analyze sentiment with AI
    let insights: any = null
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

      if (openai.apiKey) {
        const reviewText = reviews.map(r => 
          `[${r.rating}⭐] ${r.title}: ${r.content}`
        ).join('\n\n')

        const prompt = `Analyze these Amazon reviews for a book (ASIN: ${asin}):

${reviewText}

Provide detailed JSON analysis:
- positiveThemes: 5 things readers loved (exact phrases from reviews)
- negativeThemes: 5 complaints or wished-for improvements
- missingContent: Topics readers want but don't get
- overallSentiment: Overall feeling (positive/negative/mixed)
- keyRequests: What features/readers specifically asked for
- painPoints: Major frustrations mentioned
- comparingTo: What readers compare this book to (if mentioned)

Return ONLY valid JSON object.`

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.5,
        })

        insights = JSON.parse(completion.choices[0]?.message?.content || '{}')
      }
    } catch (aiError: any) {
      console.error('AI analysis error:', aiError.message)
    }

    // Calculate sentiment scores
    const avgRating = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length
    const positive = reviews.filter(r => r.rating >= 4).length
    const negative = reviews.filter(r => r.rating <= 2).length
    const positivePct = Math.round((positive / reviews.length) * 100)
    const negativePct = Math.round((negative / reviews.length) * 100)
    const sentiment = {
      avgRating: Math.round(avgRating * 10) / 10,
      positive: positivePct,
      negative: negativePct,
      neutral: 100 - positivePct - negativePct,
    }

    return NextResponse.json({
      asin,
      reviews,
      count: reviews.length,
      sentiment,
      insights,
    })
  } catch (error: any) {
    console.error('Review API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Review Analysis API', version: '1.0.0' })
}