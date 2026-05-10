"use client"

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Key, Search, Save, Download, Filter, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { mockKeywords } from '@/lib/mock-data'

const INTENT_COLORS = {
  informational: 'bg-blue-500/20 text-blue-400',
  transactional: 'bg-emerald-500/20 text-emerald-400',
  navigational: 'bg-violet-500/20 text-violet-400',
}

export default function KeywordsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [keywords, setKeywords] = useState(mockKeywords)
  const [savedKeywords, setSavedKeywords] = useState<string[]>([])
  const [filters, setFilters] = useState({
    lowCompetition: false,
    highDemand: false,
    emerging: false,
    evergreen: false,
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setKeywords([
      ...mockKeywords,
      ...mockKeywords.map(k => ({
        ...k,
        id: `${k.id}-new`,
        keyword: `${searchQuery} ${k.keyword}`,
      })),
    ])
    setIsSearching(false)
  }

  const toggleSave = (id: string) => {
    setSavedKeywords(prev => 
      prev.includes(id) 
        ? prev.filter(k => k !== id)
        : [...prev, id]
    )
  }

  const filteredKeywords = keywords.filter(k => {
    if (filters.lowCompetition && k.difficulty > 40) return false
    if (filters.highDemand && k.volume < 5000) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">
            Keyword Explorer
          </h1>
          <p className="text-zinc-400 mt-1">
            Trova le keywords più profittevoli per il tuo libro KDP
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Inserisci una keyword per analizzarla"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-14 text-lg"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery.trim()}
                size="lg"
              >
                <Key className="h-5 w-5 mr-2" />
                Ricerca Keywords
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={filters.lowCompetition}
              onChange={(e) => setFilters(prev => ({ ...prev, lowCompetition: e.target.checked }))}
              className="rounded border-zinc-700 bg-zinc-800" 
            />
            <span className="text-sm text-zinc-400">Bassa competizione</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={filters.highDemand}
              onChange={(e) => setFilters(prev => ({ ...prev, highDemand: e.target.checked }))}
              className="rounded border-zinc-700 bg-zinc-800" 
            />
            <span className="text-sm text-zinc-400">Alta domanda</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={filters.emerging}
              onChange={(e) => setFilters(prev => ({ ...prev, emerging: e.target.checked }))}
              className="rounded border-zinc-700 bg-zinc-800" 
            />
            <span className="text-sm text-zinc-400">Emergenti</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={filters.evergreen}
              onChange={(e) => setFilters(prev => ({ ...prev, evergreen: e.target.checked }))}
              className="rounded border-zinc-700 bg-zinc-800" 
            />
            <span className="text-sm text-zinc-400">Evergreen</span>
          </label>
        </div>

        {/* Keywords Table */}
        {keywords.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Keywords ({filteredKeywords.length})</CardTitle>
                <CardDescription>Analisi dettagliata delle keywords</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Keyword</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Volume</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Difficulty</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Opportunity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Intent</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeywords.map((kw, index) => (
                      <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="py-3 px-4">
                          <span className="font-medium text-zinc-100">{kw.keyword}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-100">{kw.volume.toLocaleString()}</span>
                            {kw.volume > 10000 && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  kw.difficulty < 30 ? 'bg-emerald-500' :
                                  kw.difficulty < 50 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${kw.difficulty}%` }}
                              />
                            </div>
                            <span className="text-sm text-zinc-400">{kw.difficulty}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${
                            kw.opportunityScore > 80 ? 'text-emerald-400' :
                            kw.opportunityScore > 60 ? 'text-violet-400' : 'text-amber-400'
                          }`}>
                            {kw.opportunityScore}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className={INTENT_COLORS[kw.intent]}>
                            {kw.intent}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleSave(kw.id)}
                          >
                            <Save className={`h-4 w-4 ${
                              savedKeywords.includes(kw.id) ? 'text-emerald-400' : 'text-zinc-400'
                            }`} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isSearching && keywords.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Cerca Keywords
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                Inserisci una keyword per vedere volume, difficoltà, opportunity score e intent.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}