"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Brain,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Bell,
  Settings,
  Loader2,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your Python-powered AI Portfolio Manager using Groq's Llama model. Let me load your portfolio data...",
    },
  ])
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load portfolio data from Python backend
  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        const response = await fetch("/api/python-portfolio")
        if (!response.ok) {
          throw new Error(`Portfolio API returned ${response.status}: ${await response.text()}`)
        }
        const data = await response.json()
        setPortfolioData(data)

        // Update initial message with portfolio context
        setChatMessages([
          {
            role: "assistant",
            content: `Hello! I'm your AI Portfolio Manager powered by Python analytics and Groq's Llama model. 

📊 **Your Portfolio Analysis:**
• Total Value: $${data.total_value?.toLocaleString()}
• Sharpe Ratio: ${data.metrics?.sharpe_ratio?.toFixed(2)}
• Portfolio Return: ${data.metrics?.portfolio_return?.toFixed(2)}%
• Volatility: ${data.metrics?.portfolio_volatility?.toFixed(1)}%

**Asset Allocation:**
• Stocks: ${data.asset_allocation?.stock}%
• Bonds: ${data.asset_allocation?.bond}%
• Crypto: ${data.asset_allocation?.crypto}%
• Cash: ${data.asset_allocation?.cash}%

Your portfolio shows good diversification with a balanced risk profile. How can I help optimize your investments today?`,
          },
        ])
      } catch (err) {
        console.error("Error loading portfolio data:", err)
        setPortfolioData(null)
        setChatMessages([{ role: "assistant", content: "❌ Unable to load portfolio data. Please try again later." }])
      }
    }

    loadPortfolioData()
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = { role: "user", content: message }
    setChatMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat-python", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          conversation_history: chatMessages.slice(-10), // Keep last 10 messages for context
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response")
      }

      setChatMessages((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      console.error("Error sending message:", error)
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please check your .env file and make sure GROQ_API_KEY is set.`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading Python portfolio data...</p>
          <p className="text-sm text-muted-foreground mt-2">Make sure your .env file contains GROQ_API_KEY</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">QuantAlpha</h1>
            <Badge variant="outline" className="text-xs">
              Python + Groq Powered
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/risk-profile">Risk Profile</Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${portfolioData.total_value?.toLocaleString()}</div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />+{portfolioData.metrics?.portfolio_return?.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{portfolioData.metrics?.sharpe_ratio?.toFixed(2)}</div>
                <Progress value={Math.min(Math.abs(portfolioData.metrics?.sharpe_ratio) * 50, 100)} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{portfolioData.assets?.length}</div>
                <p className="text-xs text-muted-foreground">Across multiple asset classes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Volatility</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{portfolioData.metrics?.portfolio_volatility?.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Annualized</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="portfolio" className="space-y-6">
            <TabsList>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="analysis">Python Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Allocation</CardTitle>
                    <CardDescription>Python-calculated diversification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(portfolioData.asset_allocation || {}).map(([asset, allocation]) => (
                        <div key={asset} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="font-medium capitalize">{asset}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{allocation}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Geographic Allocation</CardTitle>
                    <CardDescription>Global market exposure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(portfolioData.geographic_allocation || {}).map(([region, allocation]) => (
                        <div key={region} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="font-medium">{region}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{allocation}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Detailed Holdings</CardTitle>
                  <CardDescription>Individual positions from Python analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolioData.assets?.map((asset: any) => (
                      <div key={asset.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-sm">{asset.symbol}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{asset.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {asset.asset_type} • {asset.region}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{asset.allocation}%</div>
                          <div className="text-sm text-muted-foreground">${asset.value?.toLocaleString()}</div>
                          <div
                            className={`text-sm flex items-center ${asset.change_percent >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {asset.change_percent >= 0 ? (
                              <ArrowUpRight className="w-3 h-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 mr-1" />
                            )}
                            {Math.abs(asset.change_percent)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis">
              <Card>
                <CardHeader>
                  <CardTitle>Python Portfolio Metrics</CardTitle>
                  <CardDescription>Advanced analytics computed in Python</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Portfolio Return</h3>
                        <p className="text-2xl font-bold text-blue-800">
                          {portfolioData.metrics?.portfolio_return?.toFixed(2)}%
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2">Sharpe Ratio</h3>
                        <p className="text-2xl font-bold text-green-800">
                          {portfolioData.metrics?.sharpe_ratio?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-semibold text-yellow-900 mb-2">Portfolio Volatility</h3>
                        <p className="text-2xl font-bold text-yellow-800">
                          {portfolioData.metrics?.portfolio_volatility?.toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <h3 className="font-semibold text-purple-900 mb-2">Total Assets</h3>
                        <p className="text-2xl font-bold text-purple-800">{portfolioData.metrics?.num_assets}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Chat Sidebar */}
        <div className="w-96 border-l border-slate-200 bg-white">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-500" />
              Python AI Manager
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Python Analytics + Groq Llama</p>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)] p-4">
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-900 p-3 rounded-lg flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Python AI is analyzing...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-slate-200">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask your Python AI advisor..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} size="icon" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
