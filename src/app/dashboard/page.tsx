"use client"

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  FolderOpen, 
  Save, 
  Download,
  ArrowRight,
  Sparkles,
  BarChart3,
  Award,
  Zap,
  Target,
  ChevronRight
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'
import { 
  mockNiches, 
  mockDashboardStats, 
  trendChartData, 
  saturationData 
} from '@/lib/mock-data'

const KPI_CARDS = [
  {
    title: 'Total Searches',
    value: mockDashboardStats.totalSearches,
    change: '+12%',
    trend: 'up',
    icon: Search,
    color: 'violet',
  },
  {
    title: 'Active Projects',
    value: mockDashboardStats.activeProjects,
    change: '+2',
    trend: 'up',
    icon: FolderOpen,
    color: 'cyan',
  },
  {
    title: 'Saved Niches',
    value: mockDashboardStats.savedNiches,
    change: '+8',
    trend: 'up',
    icon: Save,
    color: 'emerald',
  },
  {
    title: 'Credits Remaining',
    value: mockDashboardStats.creditsRemaining,
    change: 'Pro',
    trend: 'up',
    icon: Zap,
    color: 'amber',
  },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">
              Ciao, John! 👋
            </h1>
            <p className="text-zinc-400 mt-1">
              Ecco una panoramica delle tue ricerche nicchie
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <a href="/research">
              <Button size="sm">
                <Search className="h-4 w-4 mr-2" />
                Nuova Ricerca
              </Button>
            </a>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Cerca una nicchia, keyword o competitor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12"
            />
          </form>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {KPI_CARDS.map((kpi, index) => (
            <Card key={index} className="hover:border-zinc-600 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">{kpi.title}</p>
                    <p className="text-2xl font-bold text-zinc-100 mt-1">{kpi.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                      <span className={`text-xs ${kpi.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-${kpi.color}-500/20 flex items-center justify-center`}>
                    <kpi.icon className={`h-6 w-6 text-${kpi.color}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Market Overview */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Market Overview</CardTitle>
              <Badge variant="secondary">Last 6 months</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendChartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
                      labelStyle={{ color: '#fafafa' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Saturation */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Market Saturation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={saturationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {saturationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4">
                {saturationData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-zinc-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hot Niches & Recent Searches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hot Niches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                Hot Niches
              </CardTitle>
              <a href="/research" className="text-sm text-violet-400 hover:text-violet-300">
                View all
              </a>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockNiches.slice(0, 5).map((niche, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-100">{niche.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge 
                            variant={niche.scores.nicheScore >= 80 ? 'success' : niche.scores.nicheScore >= 60 ? 'warning' : 'destructive'}
                            className="text-xs"
                          >
                            Score: {niche.scores.nicheScore}
                          </Badge>
                          {niche.trend === 'up' && (
                            <TrendingUp className="h-3 w-3 text-emerald-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-zinc-700">
                      <ArrowRight className="h-4 w-4 text-zinc-400" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Opportunity Score */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-5 w-5 text-violet-400" />
                Opportunity Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#27272a"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#8b5cf6"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${82 * 5.02} 502`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-zinc-100">82</span>
                    <span className="text-sm text-zinc-400">Excellent</span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 w-full">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">78%</p>
                    <p className="text-xs text-zinc-500">Demand</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-400">65%</p>
                    <p className="text-xs text-zinc-500">Competition</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-violet-400">85%</p>
                    <p className="text-xs text-zinc-500">Profit</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Searches & Emerging Niches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Searches</CardTitle>
              <ChevronRight className="h-5 w-5 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { query: 'meal prep', date: '2h ago', results: 82 },
                  { query: 'journaling anxiety', date: '5h ago', results: 91 },
                  { query: 'fitness over 50', date: '1d ago', results: 78 },
                  { query: 'digital minimalism', date: '2d ago', results: 85 },
                  { query: 'adhd productivity', date: '3d ago', results: 88 },
                ].map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-zinc-100">{search.query}</p>
                      <p className="text-xs text-zinc-500">{search.date}</p>
                    </div>
                    <Badge variant="secondary">Score: {search.results}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emerging Niches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-400" />
                Emerging Niches
              </CardTitle>
              <Badge variant="success">+3 New</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'ADHD Productivity', growth: '+45%', status: 'Emerging' },
                  { name: 'Digital Detox', growth: '+38%', status: 'Growing' },
                  { name: 'Manifestation Journal', growth: '+32%', status: 'Hot' },
                  { name: 'Gut Health Books', growth: '+28%', status: 'Growing' },
                  { name: 'Intermittent Fasting', growth: '+22%', status: 'Stable' },
                ].map((niche, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <p className="font-medium text-zinc-100">{niche.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-emerald-400">{niche.growth}</span>
                      <Badge variant="success" className="text-xs">{niche.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}