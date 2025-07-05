import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Brain, Shield, Zap, BarChart3, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">QuantAlpha</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/risk-profile" className="text-slate-300 hover:text-white transition-colors">
              Risk Assessment
            </Link>
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Sign In
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
            AI-Powered Portfolio Management
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your AI Portfolio
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Manager</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            QuantAlpha uses advanced AI to analyze market news, earnings calls, and financial reports in real-time,
            providing intelligent portfolio allocation recommendations with clear explanations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Link href="/dashboard">Start Investing</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Intelligent Investment Features</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Advanced AI capabilities designed to optimize your investment strategy
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <Brain className="w-12 h-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">AI Portfolio Manager</CardTitle>
                <CardDescription className="text-slate-300">
                  Advanced AI agent that acts as your personal portfolio manager, making data-driven investment
                  decisions.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <Globe className="w-12 h-12 text-green-400 mb-4" />
                <CardTitle className="text-white">Real-Time Analysis</CardTitle>
                <CardDescription className="text-slate-300">
                  Live analysis of market news, earnings calls, and 10K reports to inform investment strategies.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Smart Allocation</CardTitle>
                <CardDescription className="text-slate-300">
                  Intelligent portfolio allocation with detailed explanations for every investment decision.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <Zap className="w-12 h-12 text-yellow-400 mb-4" />
                <CardTitle className="text-white">Instant Execution</CardTitle>
                <CardDescription className="text-slate-300">
                  Lightning-fast trade execution based on AI recommendations and market opportunities.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <Shield className="w-12 h-12 text-red-400 mb-4" />
                <CardTitle className="text-white">Risk Management</CardTitle>
                <CardDescription className="text-slate-300">
                  Built-in risk assessment and management to protect your investments from market volatility.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Performance Tracking</CardTitle>
                <CardDescription className="text-slate-300">
                  Comprehensive performance analytics and reporting to track your investment success.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How QuantAlpha Works</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Our AI-powered system follows a systematic approach to portfolio management
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Data Collection</h3>
              <p className="text-slate-300">
                Our AI continuously monitors market news, earnings calls, SEC filings, and financial reports from
                thousands of sources.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">AI Analysis</h3>
              <p className="text-slate-300">
                Advanced machine learning models analyze the data to identify investment opportunities and assess market
                sentiment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Smart Allocation</h3>
              <p className="text-slate-300">
                The AI portfolio manager creates optimized allocation recommendations with detailed explanations for
                each decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Investments?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust QuantAlpha to manage their portfolios with AI precision.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Link href="/dashboard">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">QuantAlpha</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2024 QuantAlpha. All rights reserved. Investment involves risk.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
