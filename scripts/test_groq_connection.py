import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_groq_connection():
    """Test the Groq API connection with Poetry environment"""
    try:
        print("🔍 Testing Groq API connection...")
        
        # Check if API key exists
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("❌ GROQ_API_KEY not found in environment!")
            print("📝 Create .env file with: GROQ_API_KEY=your_key_here")
            return False
        
        print(f"🔑 API Key found: {api_key[:8]}...{api_key[-4:]}")
        
        # Initialize client
        client = Groq(api_key=api_key)
        
        # Test message
        completion = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful AI assistant for QuantAlpha portfolio management."
                },
                {
                    "role": "user",
                    "content": "Hello! Please confirm the Groq API connection is working and respond with a brief portfolio management tip."
                }
            ],
            temperature=0.7,
            max_completion_tokens=150,
            top_p=1,
            stream=False,
            stop=None,
        )
        
        response = completion.choices[0].message.content
        print("✅ Groq API Connection Successful!")
        print(f"🤖 AI Response: {response}")
        
        # Test streaming
        print("\n🔄 Testing streaming response...")
        stream_completion = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": "Give me a quick investment tip in one sentence."
                }
            ],
            temperature=0.7,
            max_completion_tokens=50,
            stream=True,
        )
        
        print("📡 Streaming: ", end="")
        for chunk in stream_completion:
            if chunk.choices[0].delta.content:
                print(chunk.choices[0].delta.content, end="")
        print("\n")
        
        print("🎉 All tests passed! Your Poetry + Groq setup is working perfectly.")
        return True
        
    except ImportError as e:
        print("❌ Import Error - Missing dependencies!")
        print(f"Error: {str(e)}")
        print("🔧 Run: poetry install")
        return False
        
    except Exception as e:
        print("❌ Groq API Connection Failed!")
        print(f"Error: {str(e)}")
        print("\n🔧 Troubleshooting:")
        print("1. Check .env file: GROQ_API_KEY=your_actual_key")
        print("2. Verify API key at: https://console.groq.com")
        print("3. Run: poetry install && poetry shell")
        print("4. Check internet connection")
        return False

def main():
    """Main function for Poetry script entry point"""
    success = test_groq_connection()
    exit(0 if success else 1)

if __name__ == "__main__":
    main()
