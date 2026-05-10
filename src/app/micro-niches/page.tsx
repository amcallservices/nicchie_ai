"use client"

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Layers, Sparkles, Save, Download, Filter, ChevronRight, TrendingUp, DollarSign, Target, Zap } from 'lucide-react'
import { mockMicroNiches } from '@/lib/mock-data'

const COMPETITION_COLORS = {
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const DIFFICULTY_LABELS = {
  easy: { label: 'Easy', color: 'text-emerald-400' },
  medium: { label: 'Medium', color: 'text-amber-400' },
  hard: { label: 'Hard', color: 'text-red-400' },
}

export default function MicroNichesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [microNiches, setMicroNiches] = useState<typeof mockMicroNiches>([])
  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'monetization' | 'difficulty'>('name')

  const handleGenerate = async () => {
    if (!searchQuery.trim()) return
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: searchQuery, type: 'micro' })
      })
      
      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
        setIsGenerating(false)
        return
      }
      
      if (Array.isArray(data)) {
        setMicroNiches(data.map((item: any, index: number) => ({
          id: String(index + 1),
          target: item.target || '',
          problema: item.problema || item.problem || '',
          risultato: item.risultato || item.result || '',
          competition: item.competition || 'medium',
          monetization: item.monetization || 70,
          difficulty: item.difficulty || 'medium',
        })))
      }
    } catch (error) {
      console.error('Error:', error)
      // Fallback to mock data on error
      setMicroNiches([
        ...mockMicroNiches,
        ...mockMicroNiches.map(m => ({
          ...m,
          id: `${m.id}-2`,
          target: `${m.target} advanced`,
        })),
      ])
    }
    setIsGenerating(false)
  }

  const filteredNiches = microNiches
    .filter(n => filter === 'all' || n.competition === filter)
    .sort((a, b) => {
      if (sortBy === 'name') return a.target.localeCompare(b.target)
      if (sortBy === 'monetization') return b.monetization - a.monetization
      return 0
    })

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">
            Micro-Niche Generator
          </h1>
          <p className="text-zinc-400 mt-1">
            Genera 50+ micro-nicchie profittevoli da qualsiasi macro nicchia
          </p>
        </div>

        {/* Search Input */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Inserisci una macro nicchia (es. fitness, productivity, meal prep)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  className="pl-12 h-14 text-lg"
                />
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !searchQuery.trim()}
                size="lg"
              >
                {isGenerating ? (
                  <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                ) : (
                  <Sparkles className="h-5 w-5 mr-2" />
                )}
                Genera 50 Micro-Nicchie
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {microNiches.length > 0 && (
          <>
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex gap-2">
                {(['all', 'low', 'medium', 'high'] as const).map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'Tutti' : f === 'low' ? 'Bassa' : f === 'medium' ? 'Media' : 'Alta'} competizione
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Counter */}
            <p className="text-zinc-400 mb-4">
              Showing {filteredNiches.length} micro-nicchie
            </p>

            {/* Micro-Niches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNiches.map((niche, index) => (
                <Card key={index} className="hover:border-violet-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-zinc-100">
                          {niche.target} + {niche.problema}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        → {niche.risultato}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-zinc-500" />
                        <span className="text-zinc-400">Competizione:</span>
                        <Badge 
                          variant="outline" 
                          className={COMPETITION_COLORS[niche.competition as keyof typeof COMPETITION_COLORS]}
                        >
                          {niche.competition}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-zinc-500" />
                        <span className="text-zinc-400">Monetization:</span>
                        <span className="text-emerald-400 font-medium">{niche.monetization}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-zinc-500" />
                        <span className="text-zinc-400">Difficulty:</span>
                        <span className={DIFFICULTY_LABELS[niche.difficulty as keyof typeof DIFFICULTY_LABELS].color}>
                          {DIFFICULTY_LABELS[niche.difficulty as keyof typeof DIFFICULTY_LABELS].label}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button variant="ghost" size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Salva
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isGenerating && microNiches.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Layers className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Genera Micro-Nicchie
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                Inserisci una macro nicchia per generare 50+ micro-nicchie specifiche, 
                con target definiti, problemi reali e risultati misurabili.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isGenerating && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-violet-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Generazione in corso
              </h3>
              <p className="text-zinc-400">
                L'AI sta generando 50 micro-nicchie basate sulla tua macro nicchia...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}