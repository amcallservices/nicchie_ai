import Link from 'next/link'
import { ArrowRight, Search, Users, TrendingUp, Key, Layers, BookOpen, Zap, CheckCircle, Sparkles, Globe, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-zinc-100">KDP Niche Hunter</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">How it Works</a>
              <a href="#pricing" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Pricing</a>
              <a href="#faq" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.3))]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="violet" className="mb-6">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered Niche Research
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-100 leading-tight mb-6">
              Trova nicchie Amazon KDP
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                profittevoli prima degli altri.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Analisi AI avanzate, dati reali, approccio data-driven per autori KDP. 
              Scopri le nicchie più profittevoli prima che il mercato le saturi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="xl" className="w-full sm:w-auto">
                  Inizia la prova gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/research">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Analizza la tua prima nicchia
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-zinc-500">
              Nessuna carta di credito richiesta • 5 ricerche gratuite
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur-2xl opacity-30" />
            <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-2xl">
              <div className="p-1 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <p className="text-sm text-zinc-400">Total Searches</p>
                  <p className="text-2xl font-bold text-zinc-100">1,247</p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <p className="text-sm text-zinc-400">Active Projects</p>
                  <p className="text-2xl font-bold text-zinc-100">12</p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <p className="text-sm text-zinc-400">Saved Niches</p>
                  <p className="text-2xl font-bold text-zinc-100">89</p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <p className="text-sm text-zinc-400">Avg Score</p>
                  <p className="text-2xl font-bold text-violet-400">82</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
              Tutto ciò che ti serve per trovare la nicchia perfetta
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Strumenti professionali per la ricerca nicchie KDP, alimentati da AI avanzata e dati reali.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: 'Ricerca Nicchie AI',
                description: 'Analizza qualsiasi nicchia con algoritmi AI avanzati. Ottieni score dettagliati su domanda, concorrenza e profitto.',
                color: 'violet',
              },
              {
                icon: Users,
                title: 'Analisi Competitor',
                description: 'Analizza i tuoi competitor. Scopri punti di forza, debolezze e opportunità nel mercato.',
                color: 'cyan',
              },
              {
                icon: Key,
                title: 'Keyword Research',
                description: 'Trova le keywords più profittevoli. Analizza volume, competizione e opportunità.',
                color: 'emerald',
              },
              {
                icon: TrendingUp,
                title: 'Trend Analysis',
                description: 'Scopri i trend emergenti prima che diventino mainstream. Google, Reddit, YouTube.',
                color: 'amber',
              },
              {
                icon: Layers,
                title: 'Micro-Niche Generator',
                description: 'Genera 50+ micro-nicchie da qualsiasi macro nicchia. Target specifici e problemi reali.',
                color: 'rose',
              },
              {
                icon: BookOpen,
                title: 'AI Book Generator',
                description: 'Genera titoli, outline e strategie per il tuo libro. AI proprietaria per KDP.',
                color: 'violet',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5"
              >
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/20 flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 border-t border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
              In 3 semplici step
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Inserisci una nicchia',
                description: 'Inserisci una nicchia o keyword semilla. Il nostro AI analizzerà centinaia di dati.',
              },
              {
                step: '02',
                title: 'AI analizza i dati',
                description: 'Il nostro algoritmo analizza domanda, concorrenza, trend e potenziale di profitto.',
              },
              {
                step: '03',
                title: 'Ottieni insight',
                description: 'Ricevi insight actionable, micro-nicchie e raccomandazioni strategiche.',
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.description}</p>
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-zinc-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
              Scegli il piano giusto per te
            </h2>
            <p className="text-lg text-zinc-400">
              Inizia gratis, upgrade quando vuoi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Free</h3>
              <p className="text-3xl font-bold text-zinc-100 mb-4">€0<span className="text-sm font-normal text-zinc-400">/mese</span></p>
              <ul className="space-y-3 mb-6">
                {['5 ricerche nicchie/mese', 'Ricerca keyword base', '3 nicchie salvate', '1 progetto', 'Supporto community'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-zinc-400">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full">Inizia gratis</Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-6 rounded-xl border border-violet-600 bg-zinc-900/50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="violet" className="bg-violet-600">Most Popular</Badge>
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Pro</h3>
              <p className="text-3xl font-bold text-zinc-100 mb-4">€29<span className="text-sm font-normal text-zinc-400">/mese</span></p>
              <ul className="space-y-3 mb-6">
                {['Ricerche illimitate', 'Analisi competitor', 'Trend radar', 'AI book generator', 'Export PDF/CSV', '50 nicchie salvate', '10 progetti'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-zinc-400">
                    <CheckCircle className="h-4 w-4 text-violet-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full">Passa a Pro</Button>
              </Link>
            </div>

            {/* Elite Plan */}
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">Elite</h3>
              <p className="text-3xl font-bold text-zinc-100 mb-4">€79<span className="text-sm font-normal text-zinc-400">/mese</span></p>
              <ul className="space-y-3 mb-6">
                {['Tutto in Pro', 'Accesso API', 'Report white-label', 'Team collaboration', 'Account manager dedicato', 'Supporto phone'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-zinc-400">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full">Contattaci</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 border-t border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
              Domande Frequenti
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'Come funziona la prova gratuita?',
                answer: 'Il piano gratuito ti dà accesso a 5 ricerche nicchie al mese. Non serve carta di credito. Puoi iniziare subito.',
              },
              {
                question: 'Posso annullare in qualsiasi momento?',
                answer: 'Sì, puoi annullare il tuo piano in qualsiasi momento dal pannello impostazioni.',
              },
              {
                question: 'I dati sono accurati?',
                answer: 'Utilizziamo dati reali da Amazon, Google Trends e altre fonti. I nostri algoritmi AI forniscono stime accurate basate su questi dati.',
              },
              {
                question: 'Posso esportare i risultati?',
                answer: 'Sì, con il piano Pro puoi esportare risultati in PDF e CSV. Il piano Elite include report white-label.',
              },
              {
                question: 'Cosa sono le micro-nicchie?',
                answer: 'Le micro-nicchie sono sotto-categorie specifiche di una nicchia più ampia. Sono più facili da dominare e spesso più profittevoli.',
              },
              {
                question: 'Come posso contattarvi?',
                answer: 'Puoi contattarci tramite email support@kdpnichehunter.com o tramite chat sul sito.',
              },
            ].map((faq, index) => (
              <div key={index} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
                <h3 className="font-semibold text-zinc-100 mb-2">{faq.question}</h3>
                <p className="text-sm text-zinc-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-zinc-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
            Pronto a trovare la tua nicchia perfetta?
          </h2>
          <p className="text-lg text-zinc-400 mb-8">
            Inizia gratis oggi. Nessuna carta di credito richiesta.
          </p>
          <Link href="/register">
            <Button size="xl">
              Inizia la prova gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-zinc-100">KDP Niche Hunter</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-400">
              <a href="#" className="hover:text-zinc-100 transition-colors">Privacy</a>
              <a href="#" className="hover:text-zinc-100 transition-colors">Terms</a>
              <a href="#" className="hover:text-zinc-100 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-zinc-500">
              © 2024 KDP Niche Hunter. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}