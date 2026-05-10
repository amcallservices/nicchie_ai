"use client"

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, User, CreditCard, Bell, Moon, Sun, Shield, LogOut, Check, Camera, Mail, Lock } from 'lucide-react'

export default function SettingsPage() {
  const [name, setName] = useState('John Doe')
  const [email, setEmail] = useState('john@example.com')
  const [darkMode, setDarkMode] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">
            Impostazioni
          </h1>
          <p className="text-zinc-400 mt-1">
            Gestisci il tuo account e le preferenze
          </p>
        </div>

        <div className="space-y-6 max-w-3xl">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-violet-400" />
                Profilo
              </CardTitle>
              <CardDescription>Informazioni personali</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">JD</span>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-zinc-800 border border-zinc-700">
                    <Camera className="h-4 w-4 text-zinc-100" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Nome</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button>Salva modifiche</Button>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-violet-400" />
                Abbonamento
              </CardTitle>
              <CardDescription>Gestisci il tuo piano</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <div>
                  <p className="font-semibold text-zinc-100">Piano Pro</p>
                  <p className="text-sm text-zinc-400">€29/mese • Rinnova il 10 Giugno 2024</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    Cambia piano
                  </Button>
                  <Button variant="outline" size="sm">
                    Annulla
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-zinc-100 mb-3">Usage</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Ricerche nicchie</span>
                      <span className="text-zinc-100">47 / 100</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: '47%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Analisi competitor</span>
                      <span className="text-zinc-100">23 / 50</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: '46%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-violet-400" />
                Preferenze
              </CardTitle>
              <CardDescription>Personalizza l'app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/30">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="h-5 w-5 text-zinc-400" /> : <Sun className="h-5 w-5 text-zinc-400" />}
                  <div>
                    <p className="font-medium text-zinc-100">Modalità scura</p>
                    <p className="text-sm text-zinc-400">Attiva il tema scuro</p>
                  </div>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    darkMode ? 'bg-violet-600' : 'bg-zinc-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/30">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="font-medium text-zinc-100">Notifiche email</p>
                    <p className="text-sm text-zinc-400">Ricevi aggiornamenti</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    emailNotifications ? 'bg-violet-600' : 'bg-zinc-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-violet-400" />
                Sicurezza
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/30">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="font-medium text-zinc-100">Cambia password</p>
                    <p className="text-sm text-zinc-400">Ultimo cambio: 30 giorni fa</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Cambia
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/30">
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="font-medium text-zinc-100">Esci da tutti i dispositivi</p>
                    <p className="text-sm text-zinc-400">Disconnetti tutto</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-red-400">
                  Esci
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-900/30">
            <CardHeader>
              <CardTitle className="text-red-400">Zona Pericolo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-100">Elimina account</p>
                  <p className="text-sm text-zinc-400">Elimina permanentemente il tuo account e tutti i dati</p>
                </div>
                <Button variant="destructive" size="sm">
                  Elimina
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}