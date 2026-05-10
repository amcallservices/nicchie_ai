// Query Enhancer - Uses OpenAI to improve search intent
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
})

export interface EnhancedQuery {
  original: string
  enhanced: string
  suggestions: string[]
  intent: string
  category: string
}

export interface QueryEnhancementResult {
  original: string
  enhanced: string
  suggestions: string[]
  intent: string
  category: string
  improved: boolean
}

// Common KDP categories
const KDP_CATEGORIES = [
  'business', 'self_help', 'health', 'diet', 'fitness',
  'finance', 'relationships', 'productivity', 'spirituality',
  'parenting', 'crafts', 'garden', 'art', 'cooking', 'journals',
]

// Common intents
const SEARCH_INTENTS = [
  'how_to', 'guide', 'tips', 'recipes', 'workbook', 'planner',
  'beginner', 'advanced', 'for kids', 'for women', 'for men',
]

// Simple enhancement without OpenAI
export function simpleEnhanceQuery(keyword: string): QueryEnhancementResult {
  const kw = keyword.toLowerCase().trim()
  const words = kw.split(' ')
  
  // Detect category
  let category = 'general'
  for (const cat of KDP_CATEGORIES) {
    if (kw.includes(cat)) {
      category = cat
      break
    }
  }
  
  // Detect intent
  let intent = 'informational'
  for (const i of SEARCH_INTENTS) {
    if (kw.includes(i)) {
      intent = i
      break
    }
  }
  
  // Generate suggestions
  const suggestions: string[] = []
  
  // Add type suffixes
  const types = ['book', 'guide', 'manual', 'workbook', 'journal', 'planner', 'cookbook', 'ebook']
  for (const type of types) {
    if (!kw.includes(type)) {
      suggestions.push(`${kw} ${type}`)
    }
  }
  
  // Add target audiences
  const targets = ['for beginners', 'for kids', 'for women', 'for men', 'for seniors']
  for (const target of targets) {
    if (!kw.includes(target)) {
      suggestions.push(`${kw} ${target}`)
    }
  }
  
  // Add problem/solution
  const modifiers = ['easy', 'simple', 'quick', 'step by step', 'ultimate']
  for (const mod of modifiers) {
    if (!kw.includes(mod)) {
      suggestions.push(`${mod} ${kw}`)
    }
  }
  
  // Deduplicate
  const unique = Array.from(new Set(suggestions)).slice(0, 10)
  
  // Enhanced query is the first suggestion or original
  const enhanced = unique[0] || kw
  
  return {
    original: keyword,
    enhanced,
    suggestions: unique,
    intent,
    category,
    improved: enhanced !== kw,
  }
}

// Enhancement with OpenAI (if API key available)
export async function enhanceWithAI(keyword: string): Promise<QueryEnhancementResult> {
  // If no API key, use simple enhancement
  if (!process.env.OPENAI_API_KEY) {
    console.log('No OpenAI API key, using simple enhancement')
    return simpleEnhanceQuery(keyword)
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a KDP niche research assistant. Given a keyword, generate:
1. An enhanced search query (more specific, commercial intent)
2. 10 related long-tail keywords that would perform well on Amazon KDP
3. A category (business, self_help, health, diet, fitness, finance, relationships, productivity, spirituality, parenting, crafts, garden, art, cooking, journals)
4. Search intent (how_to, guide, tips, recipes, workbook, planner, beginner, advanced)

Return JSON format:
{
  "enhanced": "string",
  "suggestions": ["string"],
  "category": "string",
  "intent": "string"
}`,
        },
        {
          role: 'user',
          content: `Enhance this keyword for Amazon KDP: "${keyword}"`,
        },
      ],
      temperature: 0.7,
    })
    
    const content = completion.choices[0]?.message?.content || ''
    const parsed = JSON.parse(content)
    
    return {
      original: keyword,
      enhanced: parsed.enhanced || keyword,
      suggestions: parsed.suggestions || [],
      intent: parsed.intent || 'informational',
      category: parsed.category || 'general',
      improved: true,
    }
  } catch (error) {
    console.error('OpenAI enhancement error:', error)
    return simpleEnhanceQuery(keyword)
  }
}

// Main enhancement function
export async function enhanceQuery(keyword: string): Promise<QueryEnhancementResult> {
  if (!keyword || keyword.trim().length < 2) {
    throw new Error('Keyword must be at least 2 characters')
  }
  
  // Use OpenAI if available, otherwise simple
  return enhanceWithAI(keyword)
}

// Fallback suggestions for weak keywords
export function getFallbackSuggestions(keyword: string): string[] {
  const kw = keyword.toLowerCase().trim()
  const suggestions: string[] = []
  
  // Common KDP patterns
  const patterns = [
    `${kw} book`,
    `${kw} guide`,
    `${kw} for beginners`,
    `${kw} manual`,
    `${kw} workbook`,
    `best ${kw}`,
    `easy ${kw}`,
    `${kw} recipes`,
    `${kw} tips`,
    `ultimate ${kw}`,
  ]
  
  suggestions.push(...patterns)
  return Array.from(new Set(suggestions)).slice(0, 10)
}

export default { enhanceQuery, simpleEnhanceQuery, getFallbackSuggestions }