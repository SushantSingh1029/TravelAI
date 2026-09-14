import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env
load_dotenv()
api_key = os.getenv("AI_API_KEY")

if not api_key:
    print("ERROR: AI_API_KEY is completely missing from os.environ")
    exit(1)
    
if " " in api_key:
    print("ERROR: AI_API_KEY contains spaces!")

print(f"API Key length: {len(api_key)}, Starts with: {api_key[:5] if api_key else 'None'}")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    print("Sending test request to Gemini...")
    response = model.generate_content("Say exactly 'HELLO WORLD'")
    print(f"SUCCESS: {response.text}")
except Exception as e:
    import traceback
    print(f"FAIL: {e}")
    traceback.print_exc()
