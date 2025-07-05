"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ArrowLeft, CheckCircle } from "lucide-react"

const questions = [
  {
    id: 1,
    question: "What is your investment time horizon?",
    options: [
      { value: "1", label: "Less than 2 years", score: 1 },
      { value: "2", label: "2-5 years", score: 2 },
      { value: "3", label: "5-10 years", score: 3 },
      { value: "4", label: "More than 10 years", score: 4 },
    ],
  },
  {
    id: 2,
    question: "How would you react to a 20% portfolio decline?",
    options: [
      { value: "1", label: "Sell everything immediately", score: 1 },
      { value: "2", label: "Sell some positions", score: 2 },
      { value: "3", label: "Hold and wait for recovery", score: 3 },
      { value: "4", label: "Buy more at lower prices", score: 4 },
    ],
  },
  {
    id: 3,
    question: "What percentage of your total wealth are you investing?",
    options: [
      { value: "1", label: "More than 75%", score: 1 },
      { value: "2", label: "50-75%", score: 2 },
      { value: "3", label: "25-50%", score: 3 },
      { value: "4", label: "Less than 25%", score: 4 },
    ],
  },
  {
    id: 4,
    question: "What is your primary investment goal?",
    options: [
      { value: "1", label: "Capital preservation", score: 1 },
      { value: "2", label: "Income generation", score: 2 },
      { value: "3", label: "Balanced growth", score: 3 },
      { value: "4", label: "Maximum growth", score: 4 },
    ],
  },
  {
    id: 5,
    question: "How familiar are you with investing?",
    options: [
      { value: "1", label: "Complete beginner", score: 1 },
      { value: "2", label: "Some knowledge", score: 2 },
      { value: "3", label: "Experienced investor", score: 3 },
      { value: "4", label: "Professional/Expert", score: 4 },
    ],
  },
  {
    id: 6,
    question: "Which statement best describes your income?",
    options: [
      { value: "1", label: "Unstable, need access to funds", score: 1 },
      { value: "2", label: "Stable, but limited savings", score: 2 },
      { value: "3", label: "Stable with good savings", score: 3 },
      { value: "4", label: "High income with substantial savings", score: 4 },
    ],
  },
]

const riskProfiles = {
  conservative: {
    name: "Conservative",
    range: [6, 12],
    description: "Focus on capital preservation with minimal volatility",
    allocation: { stocks: 30, bonds: 60, crypto: 0, cash: 10 },
    color: "bg-green-100 text-green-800",
  },
  moderate: {
    name: "Moderate",
    range: [13, 18],
    description: "Balanced approach seeking steady growth with moderate risk",
    allocation: { stocks: 60, bonds: 30, crypto: 5, cash: 5 },
    color: "bg-blue-100 text-blue-800",
  },
  aggressive: {
    name: "Aggressive",
    range: [19, 24],
    description: "Growth-focused with higher risk tolerance for maximum returns",
    allocation: { stocks: 80, bonds: 10, crypto: 8, cash: 2 },
    color: "bg-purple-100 text-purple-800",
  },
}

export default function RiskProfile() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isComplete, setIsComplete] = useState(false)

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateRiskProfile = () => {
    const totalScore = Object.entries(answers).reduce((sum, [questionId, value]) => {
      const question = questions.find((q) => q.id === Number.parseInt(questionId))
      const option = question?.options.find((opt) => opt.value === value)
      return sum + (option?.score || 0)
    }, 0)

    if (totalScore >= riskProfiles.conservative.range[0] && totalScore <= riskProfiles.conservative.range[1]) {
      return riskProfiles.conservative
    } else if (totalScore >= riskProfiles.moderate.range[0] && totalScore <= riskProfiles.moderate.range[1]) {
      return riskProfiles.moderate
    } else {
      return riskProfiles.aggressive
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentAnswered = answers[questions[currentQuestion]?.id]
  const profile = isComplete ? calculateRiskProfile() : null

  if (isComplete && profile) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Risk Profile Complete!</h1>
            <p className="text-slate-600">Your personalized investment strategy is ready</p>
          </div>

          <Card className="mb-6">
            <CardHeader className="text-center">
              <Badge className={`w-fit mx-auto mb-2 ${profile.color}`}>{profile.name} Investor</Badge>
              <CardTitle className="text-2xl">{profile.description}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Recommended Asset Allocation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Stocks</span>
                    <span className="text-lg font-bold">{profile.allocation.stocks}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Bonds</span>
                    <span className="text-lg font-bold">{profile.allocation.bonds}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Crypto</span>
                    <span className="text-lg font-bold">{profile.allocation.crypto}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Cash</span>
                    <span className="text-lg font-bold">{profile.allocation.cash}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Apply to Portfolio
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsComplete(false)
                setCurrentQuestion(0)
                setAnswers({})
              }}
            >
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">QuantAlpha</span>
            </div>
          </div>
          <Badge variant="outline">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Risk Profile Assessment</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{questions[currentQuestion]?.question}</CardTitle>
            <CardDescription>Select the option that best describes your situation</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={currentAnswered || ""}
              onValueChange={(value) => handleAnswer(questions[currentQuestion].id, value)}
            >
              <div className="space-y-3">
                {questions[currentQuestion]?.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!currentAnswered}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {currentQuestion === questions.length - 1 ? "Complete Assessment" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}
