import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function GET() {
  try {
    const { stdout, stderr } = await execAsync("python scripts/test_groq_connection.py")

    if (stderr) {
      console.error("Python stderr:", stderr)
    }

    return NextResponse.json({
      success: stdout.includes("✅ Groq API Connection Successful!"),
      output: stdout,
      error: stderr || null,
    })
  } catch (error) {
    console.error("Error testing Groq connection:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test Groq connection. Make sure Python and dependencies are installed.",
      },
      { status: 500 },
    )
  }
}
