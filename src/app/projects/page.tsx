"use client"

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FolderOpen, Plus, Search, Edit, Trash2, MoreHorizontal, Clock, Tag } from 'lucide-react'
import { mockProjects } from '@/lib/mock-data'

const STATUS_COLORS = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  completed: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  archived: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all')

  const filteredProjects = mockProjects.filter(p => 
    statusFilter === 'all' || p.status === statusFilter
  )

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">
              My Projects
            </h1>
            <p className="text-zinc-400 mt-1">
              Gestisci i tuoi progetti e nicchie salvate
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuovo Progetto
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Cerca progetti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 pl-12 pr-4 py-2 text-sm text-zinc-100"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'completed', 'archived'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'Tutti' : 
                  status === 'active' ? 'Attivi' :
                  status === 'completed' ? 'Completati' : 'Archiviati'}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <Card key={index} className="hover:border-violet-600 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-violet-400" />
                    <h3 className="font-semibold text-zinc-100">{project.name}</h3>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.niches.map((niche, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {niche}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={STATUS_COLORS[project.status]}>
                    {project.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                Nessun progetto trovato
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                Crea il tuo primo progetto per organizzare le tue ricerche nicchie.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}