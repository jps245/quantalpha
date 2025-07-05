"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Zap } from "lucide-react"

export default function GroqTestPanel() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const testGroqConnection = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/test-groq")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        error: "Failed to test connection",
        output: "",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Groq API Connection Test
        </CardTitle>
        <CardDescription>Test your Groq API connection and Python setup</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testGroqConnection} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Groq Connection"
          )}
        </Button>

        {testResult && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {testResult.success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <Badge className="bg-green-100 text-green-800">Connection Successful</Badge>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <Badge className="bg-red-100 text-red-800">Connection Failed</Badge>
                </>
              )}
            </div>

            {testResult.output && (
              <div className="p-3 bg-slate-100 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{testResult.output}</pre>
              </div>
            )}

            {testResult.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{testResult.error}</p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong>Setup Requirements:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Create .env file with GROQ_API_KEY</li>
            <li>Install: pip install groq python-dotenv</li>
            <li>Get API key from console.groq.com</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
