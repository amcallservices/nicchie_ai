"use client"

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Save,
  Download,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Target,
  DollarSign,
  BarChart3,
  Clock,
  Zap
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar
} from 'recharts'
import { mockNiches, scoreData, trendChartData } from '@/lib/mock-data'

const EXAMPLE_TAGS = [
  'meal prep',
  'journaling anxiety',
  'fitness over 50',
  'minimalismo digitale',
  'ADHD productivity',
]

const SCORE_COLORS = {
  excellent: 'text-emerald-400',
  good: 'text-violet-400',
  moderate: 'text-amber-400',
  poor: 'text-red-400',
}

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const [selectedNiche, setSelectedNiche] = useState(mockNiches[0])

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return
    setIsAnalyzing(true)
    setHasResults(false)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSelectedNiche({
      ...mockNiches[0],
      name: searchQuery,
    })
    setIsAnalyzing(false)
    setHasResults(true)
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">
            Ricerca Nicchia
          </h1>
          <p className="text-zinc-400 mt-1">
            Inserisci una nicchia o keyword per analizzarla con AI
          </p>
        </div>

        {/* Search Input */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Inserisci una nicchia (es. meal prep, journaling ansia, fitness over 50)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  className="pl-12 h-14 text-lg"
                />
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !searchQuery.trim()}
                size="lg"
                className="lg:w-auto"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Analisi in corso...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Analizza con AI
                  </>
                )}
              </Button>
            </div>
            
            {/* Example Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-zinc-500">Esempi:</span>
              {EXAMPLE_TAGS.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1 text-sm rounded-full bg-zinc-800/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {hasResults && (
          <div className="space-y-6">
            {/* Niche Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-zinc-100">{selectedNiche.name}</h2>
                  <Badge variant="success">Validata</Badge>
                </div>
                <p className="text-zinc-400 mt-1">
                  Analisi completata • Score: {selectedNiche.scores.nicheScore}/100
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Salva
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-analizza
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { 
                  title: 'Niche Score', 
                  value: selectedNiche.scores.nicheScore, 
                  icon: Target,
                  color: 'violet'
                },
                { 
                  title: 'Profit Score', 
                  value: selectedNiche.scores.profitScore, 
                  icon: DollarSign,
                  color: 'emerald'
                },
                { 
                  title: 'Saturation', 
                  value: selectedNiche.scores.saturationScore, 
                  icon: BarChart3,
                  color: 'amber'
                },
                { 
                  title: 'Evergreen', 
                  value: selectedNiche.scores.evergreenScore, 
                  icon: Clock,
                  color: 'cyan'
                },
                { 
                  title: 'Trend', 
                  value: selectedNiche.scores.trendScore, 
                  icon: TrendingUp,
                  color: 'violet'
                },
              ].map((score, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-zinc-400">{score.title}</span>
                      <score.icon className={`h-5 w-5 text-${score.color}-400`} />
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-zinc-100">{score.value}</span>
                      <span className="text-sm text-zinc-500 mb-1">/100</span>
                    </div>
                    <div className="mt-2 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-${score.color}-500 rounded-full transition-all duration-1000`}
                        style={{ width: `${score.value}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Analisi Multi-Dimensionale</CardTitle>
                  <CardDescription>Visualizzazione dei 5 indicatori chiave</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={scoreData}>
                        <PolarGrid stroke="#27272a" />
                        <PolarAngleAxis dataKey="subject" stroke="#71717a" fontSize={12} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#27272a" fontSize={10} />
                        <Radar
                          name="Score"
                          dataKey="A"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Trend Storico</CardTitle>
                  <CardDescription>Andamento della nicchia nel tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendChartData}>
                        <defs>
                          <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                        <YAxis stroke="#71717a" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorTrend)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  Analisi AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <h4 className="font-semibold text-emerald-400">Domanda</h4>
                    </div>
                    <p className="text-sm text-zinc-300">{selectedNiche.analysis.demand}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-amber-400" />
                      <h4 className="font-semibold text-amber-400">Competizione</h4>
                    </div>
                    <p className="text-sm text-zinc-300">{selectedNiche.analysis.competition}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-violet-400" />
                    <h4 className="font-semibold text-violet-400">Opportunità</h4>
                  </div>
                  <p className="text-sm text-zinc-300">{selectedNiche.analysis.opportunities}</p>
                </div>

                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <h4 className="font-semibold text-red-400">Rischi</h4>
                  </div>
                  <p className="text-sm text-zinc-300">{selectedNiche.analysis.risks}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-zinc-100 mb-3">Raccomandazioni</h4>
                  <ul className="space-y-2">
                    {selectedNiche.analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-violet-400 mt-1" />
                        <span className="text-sm text-zinc-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Micro-Niches */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Micro-Nicchie Generate</CardTitle>
                  <CardDescription>50 micro-nicchie basate su questa nicchia</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Visualizza tutte
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Meal Prep per studenti universitari',
                    'Meal Prep keto per diabetici',
                    'Meal Prep a basso costo',
                    'Meal Prep weekly per coppie',
                    'Meal Prep per famiglie numerose',
                  ].map((micro, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                    >
                      <span className="text-sm text-zinc-100">{micro}</span>
                      <button className="p-1.5 rounded hover:bg-zinc-700">
                        <Save className="h-4 w-4 text-zinc-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!hasResults && !isAnalyzing && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Inizia la tua ricerca
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                Inserisci una nicchia o keyword acima per ottenere 
                un'analisi completa con score AI, trend e raccomandazioni.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-violet-400 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Analisi in corso
              </h3>
              <p className="text-zinc-400">
                L'AI sta analizzando centinaia di dati per questa nicchia...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}