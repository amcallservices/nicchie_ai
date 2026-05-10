"use client"

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, Save, ExternalLink, Star, ShoppingCart, TrendingUp, AlertTriangle, Lightbulb, Target, DollarSign } from 'lucide-react'
import { mockCompetitors } from '@/lib/mock-data'

export default function CompetitorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [competitors, setCompetitors] = useState(mockCompetitors)

  const handleAnalyze = async () => {
    if (!searchQuery.trim() && !urlInput.trim()) return
    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: searchQuery || urlInput, type: 'competitor' })
      })
      
      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
        setIsAnalyzing(false)
        return
      }
      
      if (Array.isArray(data)) {
        setCompetitors(data.map((item: any, index: number) => ({
          id: String(index + 1),
          title: item.title || item.name || '',
          author: item.author || '',
          url: item.url || '',
          price: item.price || 9.99,
          reviews: item.reviews || 100,
          rating: item.rating || 4.0,
          bsr: item.bsr || 'N/A',
          strengths: item.strengths || [],
          weaknesses: item.weaknesses || [],
          opportunities: item.opportunities || [],
        })))
      }
    } catch (error) {
      console.error('Error:', error)
    }
    setIsAnalyzing(false)
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">
            Analisi Competitor
          </h1>
          <p className="text-zinc-400 mt-1">
            Analizza i tuoi competitor su Amazon e scopri cosa funziona
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input
                    type="text"
                    placeholder="Keyword o titolo del libro"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12"
                  />
                </div>
                <div className="flex items-center text-zinc-500 px-4">
                  <span>oppure</span>
                </div>
                <div className="flex-1 relative">
                  <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input
                    type="url"
                    placeholder="URL Amazon"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="pl-12 h-12"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || (!searchQuery.trim() && !urlInput.trim())}
                size="lg"
                className="w-full"
              >
                <Users className="h-5 w-5 mr-2" />
                Analizza Competitor
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {competitors.length > 0 && (
          <div className="space-y-6">
            {/* Competitor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {competitors.map((comp, index) => (
                <Card key={index} className="hover:border-violet-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="aspect-[3/4] bg-zinc-800 rounded-lg mb-4 flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-zinc-600" />
                    </div>
                    <h4 className="font-semibold text-zinc-100 mb-1 line-clamp-2">{comp.title}</h4>
                    <p className="text-sm text-zinc-400 mb-3">{comp.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-100">${comp.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        <span className="text-sm text-zinc-100">{comp.rating}</span>
                        <span className="text-xs text-zinc-500">({comp.reviews})</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                      BSR: #{comp.bsr.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* SWOT Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-violet-400" />
                  SWOT Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                      <h4 className="font-semibold text-emerald-400">Punti di Forza</h4>
                    </div>
                    <ul className="text-sm text-zinc-300 space-y-1">
                      <li>• Titoli accattivanti</li>
                      <li>• Buone recensioni</li>
                      <li>• Prezzo competitivo</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <h4 className="font-semibold text-red-400">Punti Deboli</h4>
                    </div>
                    <ul className="text-sm text-zinc-300 space-y-1">
                      <li>• Copertine generic</li>
                      <li>• Contenuto superficiale</li>
                      <li>• Nessun bonus</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-violet-400" />
                      <h4 className="font-semibold text-violet-400">Opportunità</h4>
                    </div>
                    <ul className="text-sm text-zinc-300 space-y-1">
                      <li>• Angoli niche-specifici</li>
                      <li>• Formato interattivo</li>
                      <li>• Contenuti bonus</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-amber-400" />
                      <h4 className="font-semibold text-amber-400">Minacce</h4>
                    </div>
                    <ul className="text-sm text-zinc-300 space-y-1">
                      <li>• Nuovi entrant</li>
                      <li>• Prezzo basso</li>
                      <li>• Competitori grandi</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Pattern Vincenti</CardTitle>
                <CardDescription>Cosa funziona nel mercato</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'I libri con focus specifico performano meglio',
                    'Prezzo tra $9.99-$14.99 ottimale',
                    'Copertine con contrasto alto vendono di più',
                    'Guide pratiche > theory books',
                    'Aggiungere checklist aumentar conversion',
                  ].map((insight, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/30">
                      <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <Lightbulb className="h-4 w-4 text-violet-400" />
                      </div>
                      <span className="text-sm text-zinc-300">{insight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gap Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Gap di Mercato</CardTitle>
                <CardDescription>Opportunità non sfruttate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Nessun libro specifico per freelancers con ADHD',
                    'Mancano guide con sistema digitale',
                    'Opportunità su nicchie health-specifice',
                  ].map((gap, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <DollarSign className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm text-zinc-300">{gap}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!isAnalyzing && competitors.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Analizza i Competitor
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                Inserisci una keyword o URL Amazon per analizzare i principali competitor 
                e scoprire cosa funziona nel tuo mercato.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}