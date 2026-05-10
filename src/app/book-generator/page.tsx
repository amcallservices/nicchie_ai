"use client"

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, Sparkles, Save, Copy, RefreshCw, Lightbulb, Target, Users, Zap, TrendingUp } from 'lucide-react'

interface BookIdea {
  title: string
  subtitle: string
  audience: string
  hook: string
  usp: string
}

export default function BookGeneratorPage() {
  const [niche, setNiche] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [ideas, setIdeas] = useState<BookIdea[]>([])
  const [outline, setOutline] = useState<string[]>([])
  const [series, setSeries] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!niche.trim()) return
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIdeas([
      {
        title: `The Complete Guide to ${niche}`,
        subtitle: `Master the art of ${niche} with this comprehensive handbook`,
        audience: 'Adults looking to improve their lives',
        hook: 'What if everything you knew about success was wrong?',
        usp: 'AI-powered system with proven results',
      },
      {
        title: `${niche}: The Missing Manual`,
        subtitle: `Everything they don't tell you about ${niche}`,
        audience: 'Busy professionals',
        hook: 'Stop struggling, start achieving',
        usp: '90-day implementation plan',
      },
      {
        title: `${niche} Made Simple`,
        subtitle: `A beginner's guide to ${niche}`,
        audience: 'Startups and beginners',
        hook: 'Simple steps to extraordinary results',
        usp: 'Visual learning approach',
      },
    ])
    setOutline([
      'Introduction: Why This Book',
      'Chapter 1: The Foundation',
      'Chapter 2: Getting Started',
      'Chapter 3: Core Strategies',
      'Chapter 4: Advanced Techniques',
      'Chapter 5: Troubleshooting',
      'Chapter 6: Long-term Success',
      'Conclusion: Your Action Plan',
      'Bonus Resources',
    ])
    setSeries([
      `Book 1: Getting Started with ${niche}`,
      `Book 2: ${niche} Mastery`,
      `Book 3: ${niche} for Professionals`,
      `Book 4: ${niche} in 30 Days`,
    ])
    setIsGenerating(false)
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">
            AI Book Idea Generator
          </h1>
          <p className="text-zinc-400 mt-1">
            Genera titoli, outline e strategie per il tuo prossimo bestseller KDP
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Inserisci una nicchia o topic per il tuo libro"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  className="pl-12 h-14 text-lg"
                />
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !niche.trim()}
                size="lg"
              >
                {isGenerating ? (
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5 mr-2" />
                )}
                Genera Idee
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {ideas.length > 0 && (
          <div className="space-y-8">
            {/* Title Ideas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-violet-400" />
                  Titoli Suggeriti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {ideas.map((idea, index) => (
                    <div key={index} className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700">
                      <h4 className="font-bold text-zinc-100 mb-2">{idea.title}</h4>
                      <p className="text-sm text-zinc-400 mb-3">{idea.subtitle}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">KDP Ready</Badge>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Outline */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Book Outline</CardTitle>
                  <CardDescription>Struttura del libro capitolo per capitolo</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {outline.map((chapter, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/30">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-violet-400">{index + 1}</span>
                      </div>
                      <span className="text-zinc-100">{chapter}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* USP & Hook */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    USP & Hook
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ideas[0] && (
                    <>
                      <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                        <p className="text-sm text-zinc-400 mb-1">Hook</p>
                        <p className="text-zinc-100 font-medium">{ideas[0].hook}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        <p className="text-sm text-zinc-400 mb-1">USP</p>
                        <p className="text-zinc-100 font-medium">{ideas[0].usp}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-400" />
                    Target Audience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ideas[0] && (
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-zinc-100">{ideas[0].audience}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Series Ideas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-400" />
                  Serie Ideas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {series.map((book, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/30">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-amber-400">#{index + 1}</span>
                      </div>
                      <span className="text-zinc-100">{book}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!isGenerating && ideas.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Genera Idee per il tuo Libro
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                Inserisci una nicchia o topic per generare titoli, outline, USP e ideas per una serie completa.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}