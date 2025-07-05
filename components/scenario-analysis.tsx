"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"

const scenarioData = {
  "Rate Cut (-2%)": [
    { month: "Jan", value: 125750 },
    { month: "Feb", value: 132400 },
    { month: "Mar", value: 138900 },
    { month: "Apr", value: 145200 },
    { month: "May", value: 151800 },
    { month: "Jun", value: 158600 },
    { month: "Jul", value: 165100 },
    { month: "Aug", value: 171900 },
    { month: "Sep", value: 178400 },
    { month: "Oct", value: 185200 },
    { month: "Nov", value: 192100 },
    { month: "Dec", value: 199500 },
  ],
  "Current Rates": [
    { month: "Jan", value: 125750 },
    { month: "Feb", value: 127200 },
    { month: "Mar", value: 129800 },
    { month: "Apr", value: 131500 },
    { month: "May", value: 134200 },
    { month: "Jun", value: 136900 },
    { month: "Jul", value: 139100 },
    { month: "Aug", value: 142300 },
    { month: "Sep", value: 144800 },
    { month: "Oct", value: 147600 },
    { month: "Nov", value: 150200 },
    { month: "Dec", value: 153400 },
  ],
  "Rate Hike (+2%)": [
    { month: "Jan", value: 125750 },
    { month: "Feb", value: 123400 },
    { month: "Mar", value: 121800 },
    { month: "Apr", value: 119200 },
    { month: "May", value: 117600 },
    { month: "Jun", value: 115900 },
    { month: "Jul", value: 114800 },
    { month: "Aug", value: 113200 },
    { month: "Sep", value: 112100 },
    { month: "Oct", value: 111400 },
    { month: "Nov", value: 110800 },
    { month: "Dec", value: 110200 },
  ],
}

export default function ScenarioAnalysis() {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(["Current Rates"])

  const toggleScenario = (scenario: string) => {
    setSelectedScenarios((prev) => (prev.includes(scenario) ? prev.filter((s) => s !== scenario) : [...prev, scenario]))
  }

  const chartData = scenarioData["Current Rates"].map((item, index) => {
    const result: any = { month: item.month }

    selectedScenarios.forEach((scenario) => {
      result[scenario] = scenarioData[scenario as keyof typeof scenarioData][index].value
    })

    return result
  })

  const scenarioColors = {
    "Rate Cut (-2%)": "#22c55e",
    "Current Rates": "#3b82f6",
    "Rate Hike (+2%)": "#ef4444",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interest Rate Scenario Analysis</CardTitle>
          <CardDescription>
            Portfolio value projections under different interest rate environments over 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(scenarioData).map((scenario) => (
              <Button
                key={scenario}
                variant={selectedScenarios.includes(scenario) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleScenario(scenario)}
              >
                {scenario}
              </Button>
            ))}
          </div>

          <ChartContainer
            config={{
              "Rate Cut (-2%)": {
                label: "Rate Cut (-2%)",
                color: scenarioColors["Rate Cut (-2%)"],
              },
              "Current Rates": {
                label: "Current Rates",
                color: scenarioColors["Current Rates"],
              },
              "Rate Hike (+2%)": {
                label: "Rate Hike (+2%)",
                color: scenarioColors["Rate Hike (+2%)"],
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Legend />
                {selectedScenarios.map((scenario) => (
                  <Line
                    key={scenario}
                    type="monotone"
                    dataKey={scenario}
                    stroke={scenarioColors[scenario as keyof typeof scenarioColors]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Rate Cut Scenario</CardTitle>
            <Badge className="w-fit bg-green-100 text-green-800">Most Optimistic</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">12-Month Return</span>
                <span className="font-semibold text-green-600">+58.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Final Value</span>
                <span className="font-semibold">$199,500</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Lower rates boost bond prices and growth stocks. Crypto benefits from risk-on sentiment.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Current Rates</CardTitle>
            <Badge className="w-fit bg-blue-100 text-blue-800">Base Case</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">12-Month Return</span>
                <span className="font-semibold text-blue-600">+22.0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Final Value</span>
                <span className="font-semibold">$153,400</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Steady growth with balanced performance across asset classes. Moderate volatility expected.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Rate Hike Scenario</CardTitle>
            <Badge className="w-fit bg-red-100 text-red-800">Conservative</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">12-Month Return</span>
                <span className="font-semibold text-red-600">-12.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Final Value</span>
                <span className="font-semibold">$110,200</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Higher rates pressure growth stocks and crypto. Bonds face duration risk initially.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Scenario Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Portfolio Sensitivity Analysis</h3>
              <p className="text-blue-800 text-sm">
                Your portfolio shows moderate interest rate sensitivity with a duration of 3.2 years. The 25% bond
                allocation provides some hedge against equity volatility, while the 7% crypto allocation adds growth
                potential in low-rate environments.
              </p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-900 mb-2">Recommended Adjustments</h3>
              <p className="text-amber-800 text-sm">
                Consider increasing bond duration if rate cuts are likely, or reducing crypto exposure if rate hikes
                become probable. The AI will automatically rebalance based on Fed signals and economic indicators.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
