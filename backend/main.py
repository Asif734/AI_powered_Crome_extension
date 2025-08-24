from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

# Set your Google API key
api_key=os.getenv("api_key")
genai.configure(api_key=api_key)

app = FastAPI()

class Query(BaseModel):
    content: str
    question: str

@app.post("/ask")
def ask(query: Query):
    """
    Handles a POST request to ask a question based on provided content.
    """
    # Create the prompt for the model
    prompt = f"Generate bullet points only, Content:\n{query.content}\n\nQuestion:\n{query.question}"
    
    # Initialize the GenerativeModel
    model = genai.GenerativeModel("gemini-2.5-flash") # "gemini-1.5-pro" is a more powerful model
    
    try:
        # Use the generate_content method to get a response
        response = model.generate_content(prompt)
        
        # Access the response text. The response object has a .text attribute.
        answer = response.text
        
    except Exception as e:
        # Handle potential errors from the API call
        print(f"An error occurred: {e}")
        answer = "Sorry, I could not generate a response. Please try again."
    
    return {"answer": answer}

