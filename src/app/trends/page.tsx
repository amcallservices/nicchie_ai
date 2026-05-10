"use client"

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Minus, Globe, Youtube, MessageCircle, Search, Calendar, ArrowUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { mockTrends, trendChartData } from '@/lib/mock-data'

const CATEGORY_ICONS = {
  google: Globe,
  youtube: Youtube,
  reddit: MessageCircle,
  tiktok: Search,
}

const TREND_ICONS = {
  up: ArrowUp,
  down: TrendingDown,
  stable: Minus,
}

export default function TrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'google' | 'youtube' | 'reddit' | 'tiktok'>('all')
  
  const filteredTrends = selectedCategory === 'all' 
    ? mockTrends 
    : mockTrends.filter(t => t.category === selectedCategory)

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">
              Trend Radar
            </h1>
            <p className="text-zinc-400 mt-1">
              Scopri i trend emergenti prima che diventino mainstream
            </p>
          </div>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Ultimi 30 giorni
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['all', 'google', 'youtube', 'reddit', 'tiktok'] as const).map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'Tutti' : 
                cat === 'google' ? 'Google' :
                cat === 'youtube' ? 'YouTube' :
                cat === 'reddit' ? 'Reddit' : 'TikTok'}
            </Button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Trend Growth</CardTitle>
              <CardDescription>Andamento nel tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendChartData}>
                    <defs>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
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
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTrend)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
              <CardDescription>Performance per categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Self-Help', value: 85 },
                    { name: 'Health', value: 72 },
                    { name: 'Business', value: 68 },
                    { name: 'Cooking', value: 55 },
                    { name: 'Fitness', value: 48 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                    <YAxis stroke="#71717a" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trending Now */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                Hot Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTrends.filter(t => t.growth > 50).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
                    <div>
                      <p className="font-medium text-zinc-100">{trend.name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">{trend.category}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">+{trend.growth}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Growing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUp className="h-5 w-5 text-violet-400" />
                Growing Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: ' manifestation journal', category: 'google', change: 22 },
                  { name: 'ADHD productivity tips', category: 'reddit', change: 18 },
                  { name: 'gut health recipes', category: 'youtube', change: 15 },
                ].map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
                    <div>
                      <p className="font-medium text-zinc-100">{trend.name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">{trend.category}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-violet-400 font-bold">+{trend.change}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Declining */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-400" />
                Declining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'work from home tips', category: 'google', change: -5 },
                  { name: 'covid preparedness', category: 'google', change: -15 },
                ].map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
                    <div>
                      <p className="font-medium text-zinc-100">{trend.name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">{trend.category}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-bold">{trend.change}%</p>
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