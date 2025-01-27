import os
import json
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain, SequentialChain
from langchain.callbacks import get_openai_callback
from dotenv import load_dotenv

load_dotenv()

# Load API key
KEY = os.getenv("OPENAI_API_KEY")

# Initialize the LLM
llm = ChatOpenAI(openai_api_key=KEY, model_name="gpt-4o-mini", temperature=0.6)

# Define the JSON structure for response
RESPONSE_JSON=[
    {
        "sno":"1",
        "mcq": "multiple choice question",
        "skill": "skill or subject name",
        "options": {
            "a": "choice here",
            "b": "choice here",
            "c": "choice here",
            "d": "choice here"
        },
        "correct": "correct answer",
        "difficulty": "difficulty level (easy or medium or hard)"
    },
    {
        "sno":"2",
        "mcq": "multiple choice question",
        "skill": "skill or subject name",
        "options": {
            "a": "choice here",
            "b": "choice here",
            "c": "choice here",
            "d": "choice here"
        },
        "correct": "correct answer",
        "difficulty": "difficulty level (easy or medium or hard)"
    },
    {
        "sno":"3",
        "mcq": "multiple choice question",
        "skill": "skill or subject name",
        "options": {
            "a": "choice here",
            "b": "choice here",
            "c": "choice here",
            "d": "choice here"
        },
        "correct": "correct answer",
        "difficulty": "difficulty level (easy or medium or hard)"
    }
]

# Define the prompt templates
PROMPT = """
You are an expert MCQ maker. Generate a total of 2 questions for a {jobrole} role tailored to a {experience} candidate. The questions should be distributed as follows:

The questions should cover various aspects of the required skills for the job role and be divided into different difficulty levels as appropriate:

- Easy: Suitable for understanding fundamental concepts.
- Medium: Suitable for assessing practical skills and problem-solving abilities.
- Difficult: Suitable for evaluating advanced knowledge and critical thinking.

For each question, include the relevant skill or subject name that it pertains to. Provide a balanced mix of easy, medium, and difficult questions based on the experience level of the candidate. Make sure the questions are not repeated and check all the questions to ensure conformity with the text as well. Format your response according to the RESPONSE_JSON structure below and ensure to make 2 MCQs.

### RESPONSE_JSON
{response_json}
"""

PROMPT2 = """
You are an expert English grammarian and writer. Given a Multiple Choice Quiz for a {jobrole} at a {experience}, you need to evaluate the complexity of the questions and provide a complete analysis of the quiz. Use a maximum of 50 words for complexity analysis. If the quiz is not aligned with the cognitive and analytical abilities of the candidate, update the quiz questions that need to be changed and adjust the tone to perfectly fit the candidate's abilities.

Ensure to make 2 MCQs
Quiz_MCQs:
{quiz}
Check from an expert English Writer of the above quiz:
"""


# Initialize prompt templates
quiz_generation_prompt = PromptTemplate(
    input_variables=["jobrole", "experience", "response_json"],
    template=PROMPT
)

quiz_evaluation_prompt = PromptTemplate(
    input_variables=["jobrole", "quiz"],
    template=PROMPT2
)

# Initialize chains
quiz_chain = LLMChain(llm=llm, prompt=quiz_generation_prompt, output_key="quiz", verbose=True)
review_chain = LLMChain(llm=llm, prompt=quiz_evaluation_prompt, output_key="review", verbose=True)
generate_evaluate_chain = SequentialChain(
    chains=[quiz_chain, review_chain],
    input_variables=["jobrole", "experience", "response_json"],
    output_variables=["quiz", "review"],
    verbose=True,
)

# Define a Pydantic model for input validation
class QuizRequest(BaseModel):
    jobrole: str
    experience: str

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the API endpoint
@app.post("/generate-quiz")
async def generate_quiz(request: QuizRequest):
    try:
        with get_openai_callback() as cb:
            response = generate_evaluate_chain({
                "jobrole": request.jobrole,
                "experience": request.experience,
                "response_json": json.dumps(RESPONSE_JSON)
            })

        quiz = response.get("quiz")

        # Remove triple backticks and unnecessary "json" from the string
        quiz = quiz.replace("```json", "").replace("```", "").strip()
        
        # Convert the cleaned JSON string to a Python object
        quiz = json.loads(quiz)

        return {
            "quiz": quiz  # Now this is a proper JavaScript object when returned
        }

    except Exception as e:
        print(f"Error generating quiz: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Quiz generation failed.")


# Run the application (when running the script directly)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
