"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertTriangle, Target, Loader2 } from "lucide-react"

export default function AIPortfolioInsights() {
  const [activeInsight, setActiveInsight] = useState<string | null>(null)

  const { messages, append, isLoading } = useChat({
    api: "/api/chat",
    id: "portfolio-insights",
  })

  const insightQueries = [
    {
      id: "market-outlook",
      title: "Market Outlook",
      icon: TrendingUp,
      query: "What is your current outlook on the market and how should it affect my portfolio allocation?",
      color: "text-blue-600",
    },
    {
      id: "risk-analysis",
      title: "Risk Analysis",
      icon: AlertTriangle,
      query: "Analyze the current risk level of my portfolio and suggest any adjustments needed.",
      color: "text-yellow-600",
    },
    {
      id: "rebalancing",
      title: "Rebalancing",
      icon: Target,
      query: "Should I rebalance my portfolio based on recent market movements and performance?",
      color: "text-green-600",
    },
  ]

  const handleInsightRequest = async (query: string, id: string) => {
    setActiveInsight(id)
    await append({
      role: "user",
      content: query,
    })
  }

  const latestResponse = messages.filter((m) => m.role === "assistant").pop()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-500" />
            AI Portfolio Insights
          </CardTitle>
          <CardDescription>Get instant analysis from your Groq-powered AI portfolio manager</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {insightQueries.map((insight) => {
              const Icon = insight.icon
              return (
                <Button
                  key={insight.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                  onClick={() => handleInsightRequest(insight.query, insight.id)}
                  disabled={isLoading}
                >
                  <Icon className={`w-6 h-6 ${insight.color}`} />
                  <span className="font-medium">{insight.title}</span>
                  {isLoading && activeInsight === insight.id && <Loader2 className="w-4 h-4 animate-spin" />}
                </Button>
              )
            })}
          </div>

          {latestResponse && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
              <div className="flex items-center mb-2">
                <Badge variant="outline" className="mb-2">
                  Latest AI Analysis
                </Badge>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-slate-700 leading-relaxed">{latestResponse.content}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
