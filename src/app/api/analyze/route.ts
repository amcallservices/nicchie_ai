import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { niche, type } = await request.json()

    if (!niche) {
      return NextResponse.json(
        { error: 'Niche is required' },
        { status: 400 }
      )
    }

    const openai = getOpenAI()

    let prompt = ''
    
    switch (type) {
      case 'niche':
        prompt = `You are an expert Amazon KDP market researcher with deep knowledge of self-publishing, book marketing, and reader preferences. 

Conduct a comprehensive analysis of the niche "${niche}" for Amazon KDP self-publishing.

Provide a detailed JSON response with these specific metrics and insights:

**SCORES (0-100 scale):**
- nicheScore: Overall opportunity score considering demand, competition, profitability
- profitScore: Revenue potential based on average prices and sales volume
- saturationScore: How crowded the market is (100 = fully saturated)
- evergreenScore: Long-term demand stability (100 = always in demand)
- trendScore: Current growth trajectory (100 = rapidly growing)

**DETAILED ANALYSIS:**
- demand: 2-3 sentence analysis of actual market demand with specific buyer behavior
- competition: 2-3 sentence analysis of competitor landscape with names of top books/authors if known
- keywords: Array of 10 high-performing keywords specific to this niche with search volume estimates
- categories: Array of 3-5 best Amazon categories for this niche
- avgPrice: Average book price in USD for this genre
- avgReviews: Average number of reviews for top sellers
- bsrRange: Estimated Bestseller Rank range for this niche

**STRATEGIC INSIGHTS:**
- opportunities: 5 specific gaps in the market or underserved audiences
- risks: 5 potential challenges or market饱和 risks
- recommendations: 5 actionable steps to succeed in this specific niche

**BOOK DEVELOPMENT:**
- titleIdeas: 5 catchy title ideas for this specific niche
- subtitleIdeas: 5 compelling subtitle variations
- audienceProfiles: Detailed profile of ideal reader (age, profession, pain points, desires)

Return ONLY valid JSON with all these fields. Be extremely specific and data-driven.`
        break
      case 'micro':
        prompt = `You are an expert Amazon KDP niche researcher specializing in identifying profitable micro-niches.

Generate 15 highly specific micro-niches for the macro niche "${niche}" using the formula:

[TARGET AUDIENCE] + [SPECIFIC PROBLEM] + [DESIRED RESULT]

For each micro-niche provide extensive details:

- target: EXACT demographic (age, profession, situation - be very specific)
- problema: SPECIFIC problem they face with emotional context
- risultato: CONCRETE outcome they want to achieve
- competition: low/medium/high with specific reasoning
- monetization: Score 0-100 based on price tolerance and demand
- difficulty: easy/medium/hard based on production complexity
- searchVolume: Estimated monthly Amazon searches (100-10000)
- urgency: How urgent this problem is (1-10)
- seasonality: evergreend or specific season
- bestFormat: Workbook, guide, journal, planner, etc.

Return ONLY a JSON array with 15 objects, very detailed and specific.`
        break
      case 'keywords':
        prompt = `You are an expert Amazon KDP keyword researcher with deep knowledge of SEO and Amazon's search algorithm.

Generate 20 high-opportunity keywords for "${niche}" on Amazon KDP.

For each keyword provide comprehensive data:

- keyword: The exact keyword phrase people search
- volume: ESTIMATED monthly search volume on Amazon (100-100000)
- difficulty: 1-100 competition score (1 = easy to rank, 100 = impossible)
- opportunityScore: 1-100 based on volume vs difficulty
- intent: informational (researching) / transactional (ready to buy) / navigational (looking for specific)
- cpc: Estimated cost per click if advertising ($0.50-$10)
-相关性: How directly related to book sales (1-10)
- type: single word / long-tail (3+ words) / brand
- searchTrend: rising / stable / declining
- suggestedFormat: Best book format for this keyword (workbook, guide, etc.)

Return ONLY a JSON array with 20 objects, extremely specific.`
        break
      case 'competitor':
        prompt = `You are an expert Amazon KDP competitive analyst with deep knowledge of book marketing and reader psychology.

Analyze the top 10 competing books in the "${niche}" niche on Amazon.

For each competitor provide EXTENSIVE analysis:

BOOK DATA:
- title: Exact book title
- author: Author name
- authorUrl: Author's Amazon profile link
- price: Current price in USD
- originalPrice: Original price before discounts
- format: Kindle / Paperback / Hardcover / Audiobook
- pages: Number of pages
- publishedDate: Publication date
- reviews: Total number of reviews
- rating: Average rating (1-5 stars with 1 decimal)
- bsr: Bestseller Rank in category
- bsrCategory: The specific category

DEEP ANALYSIS:
- strengths: 5 specific things this book does well
- weaknesses: 5 specific gaps or flaws
- contentType: What type of content (how-to, memoir, textbook, etc.)
- uniqueAngle: What makes this book different
- targetReader: Who this book is for (specific)
- visualAppeal: Quality of cover (1-10)
- reviewsPerMonth: Estimated new reviews per month
- priceHistory: Price trend over time

MARKET ANALYSIS:
- gaps: 5 specific opportunities this book misses
- contentGaps: Topics covered poorly
- formatGaps: Missing formats
- audienceGaps: Underserved reader segments
- improvementOpportunities: 5 ways to create a better book

Return ONLY a JSON array with 10 objects, comprehensive and detailed.`
        break
      case 'book':
        prompt = `You are a master book publisher specializing in Amazon KDP with expertise in titles, covers, and marketing hooks.

Generate 10 COMPLETE book concepts for the niche "${niche}" on Amazon KDP.

For each book provide:

**TITLE & BRANDING:**
- title: Eye-catching, specific title
- subtitle: Compelling 5-10 word subtitle
- series: Series name if applicable (e.g., "Book 1 of X")
- hook: One-sentence marketing hook that grabs attention

**POSITIONING:**
- audience: EXACT target reader ( Demographics + psychographics)
- problemSolved: Specific problem this book solves
- promise: What the reader will achieve by the end
- emotions: What feelings the title/book evokes

**CONTENT STRUCTURE:**
- format: Workbook / Guide / Journal / Planner / Coloring / etc.
- pages: Suggested page count (100-400)
- chapters: Array of 10-15 chapter titles
- includes: Array of what bonus content (workbook, templates, etc.)
- price: Suggested price ($9.99-$49.99 range)

**MARKETING:**
- keywords: 10 primary keywords for this book
- categories: 2-3 best Amazon categories
- compareTo: Books this could be compared to
- usp: Unique selling proposition
- marketingAngle: How to market this specifically
- ads: Best advertising strategy

**MONETIZATION:**
- royalty70: If priced $9.99, earn ~$7
- potentialMonthlySales: Conservative monthly estimated sales
- launchStrategy: How to launch this book

Return ONLY a JSON array with 10 objects, extremely detailed.`
        break
      default:
        prompt = `You are an expert Amazon KDP market researcher. 

Conduct a comprehensive analysis of the niche "${niche}" for self-publishing on Amazon KDP.

Provide detailed JSON with:
- nicheScore (0-100): Overall opportunity score
- profitScore (0-100): Potential profitability
- saturationScore (0-100): Market saturation level
- evergreenScore (0-100): Long-term viability
- trendScore (0-100): Current trend momentum
- demand: Detailed 2-3 sentence market demand analysis
- competition: Detailed 2-3 sentence competitive landscape analysis
- keywords: Array of 10 high-performing keywords
- categories: Array of 3-5 best Amazon categories
- avgPrice: Average price in USD
- avgReviews: Average number of reviews
- opportunities: 5 specific opportunities
- risks: 5 specific risks
- recommendations: 5 actionable recommendations
- titleIdeas: 5 title ideas for this niche

Be extremely specific and data-driven. Return ONLY valid JSON.`
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Amazon KDP niche researcher. Analyze niches and provide detailed, actionable insights. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content
    
    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    let result
    try {
      result = JSON.parse(content)
    } catch {
      // Try to find and extract JSON from the response
      try {
        // Find first { or [ and last } or ]
        const startIdx = content.indexOf('{')
        const startArrayIdx = content.indexOf('[')
        const actualStart = startArrayIdx !== -1 && (startIdx === -1 || startArrayIdx < startIdx) ? startArrayIdx : startIdx
        
        if (actualStart === -1) {
          throw new Error('No JSON found')
        }
        
        let endIdx = content.lastIndexOf('}')
        let endArrayIdx = content.lastIndexOf(']')
        let actualEnd = endArrayIdx !== -1 && (endIdx === -1 || endArrayIdx > endIdx) ? endArrayIdx : endIdx
        
        if (actualEnd === -1) {
          throw new Error('No JSON end found')
        }
        
        const jsonStr = content.substring(actualStart, actualEnd + 1)
        result = JSON.parse(jsonStr)
      } catch (parseError) {
        return NextResponse.json(
          { error: 'Failed to parse AI response' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    
    if (error.code === 'invalid_api_key' || error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid or missing OpenAI API key' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}