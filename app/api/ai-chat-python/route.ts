import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"

const execAsync = promisify(exec)

export async function POST(req: NextRequest) {
  try {
    const { message, conversation_history } = await req.json()

    // Create a temporary file with the conversation data
    const tempData = {
      message,
      conversation_history: conversation_history || [],
    }

    const tempFile = path.join(process.cwd(), "temp_chat.json")
    fs.writeFileSync(tempFile, JSON.stringify(tempData))

    // Run Python AI advisor with the message using the official Groq client
    const command = `python -c "
import sys
import json
import os
from scripts.ai_portfolio_advisor import AIPortfolioAdvisor

try:
    # Read temp data
    with open('temp_chat.json', 'r') as f:
        data = json.load(f)

    advisor = AIPortfolioAdvisor()
    response = advisor.chat_with_advisor(data['message'], data['conversation_history'])
    print(json.dumps({'response': response, 'success': True}))
    
except Exception as e:
    print(json.dumps({'error': str(e), 'success': False}))
"`

    const { stdout, stderr } = await execAsync(command)

    // Clean up temp file
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile)
    }

    if (stderr) {
      console.error("Python stderr:", stderr)
    }

    const result = JSON.parse(stdout.trim())

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ response: result.response })
  } catch (error) {
    console.error("Error running Python AI chat:", error)
    return NextResponse.json(
      {
        error: "Failed to get AI response. Make sure your .env file contains GROQ_API_KEY and run: pip install groq",
      },
      { status: 500 },
    )
  }
}
