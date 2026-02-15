import os
from dotenv import load_dotenv
from google import genai

# 1. Setup
load_dotenv()
client = genai.Client(api_key="AIzaSyB51_6Jypi31RCil0jBxW2VPdx1J2DCfvw")

# 2. Start a Chat Session
# This 'chat' object will stay alive and remember the history
chat = client.chats.create(model="gemini-2.5-flash")

print("--- Chat Started (Type 'quit' to stop) ---")

while True:
    user_input = input("You: ")
    
    if user_input.lower() in ["quit", "exit", "bye"]:
        print("Gemini: Goodbye!")
        break

    try:
        # 3. Send message (History is automatically appended)
        response = chat.send_message(user_input)
        print(f"Gemini: {response.text}\n")
        
    except Exception as e:
        print(f"Error: {e}")