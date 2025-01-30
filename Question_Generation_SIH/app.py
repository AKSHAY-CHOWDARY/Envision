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
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List

# Load environment variables
load_dotenv()

# Load API key
KEY = os.getenv("OPENAI_API_KEY")

# Initialize the LLM
llm = ChatOpenAI(openai_api_key=KEY, model_name="gpt-4o-mini", temperature=0.6)

# Define the JSON structure for response
RESPONSE_JSON = [
    {
        "sno": "1",
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
        "sno": "2",
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

# Define Pydantic models for input validation
class QuizRequest(BaseModel):
    jobrole: str
    experience: str

class FilterRequest(BaseModel):
    skill: str
    complexity_level: str

class UserSkillsRequest(BaseModel):
    skills: List[str]

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

# Load data with error handling
try:
    train_data = pd.read_csv('coursera_courses.csv')
except Exception as e:
    train_data = pd.DataFrame()  # Initialize as an empty DataFrame
    print(f"Error loading data: {e}")

# Preprocess the skills column
def preprocess_skills(skills):
    if isinstance(skills, str):
        # Convert string representation of list to actual list
        skills = skills.strip("[]").replace("'", "").split(", ")
    elif isinstance(skills, list):
        skills = skills
    else:
        skills = []
    return [skill.lower().strip() for skill in skills]

train_data['course_skills_processed'] = train_data['course_skills'].apply(preprocess_skills)

# TF-IDF Vectorizer
tfidf = TfidfVectorizer()

# Fit TF-IDF on all course skills
all_skills = [" ".join(skills) for skills in train_data['course_skills_processed']]
tfidf_matrix = tfidf.fit_transform(all_skills)

# Function to recommend courses
def recommend_courses(user_skills, top_n=5):
    # Preprocess user skills
    user_skills_processed = [skill.lower().strip() for skill in user_skills]
    user_skills_str = " ".join(user_skills_processed)

    # Transform user skills into TF-IDF vector
    user_skills_vector = tfidf.transform([user_skills_str])

    # Calculate cosine similarity between user skills and all courses
    similarity_scores = cosine_similarity(user_skills_vector, tfidf_matrix).flatten()

    # Add similarity scores to the dataset
    train_data['similarity_score'] = similarity_scores

    # Sort courses by similarity score and get top N recommendations
    recommended_courses = train_data.sort_values(by='similarity_score', ascending=False).head(top_n)

    return recommended_courses.to_dict(orient='records')

# Define the FastAPI route for recommendations
@app.post("/recommend_courses/")
def get_recommended_courses(request: UserSkillsRequest):
    if train_data.empty:
        raise HTTPException(status_code=500, detail="Data source is unavailable.")

    try:
        # Get recommended courses
        recommended_courses = recommend_courses(request.skills, top_n=5)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

    if not recommended_courses:
        raise HTTPException(status_code=404, detail="No courses found matching the criteria.")

    return {"recommended_courses": recommended_courses}

# Define the filtering function
def filter_courses(train_data, skill, complexity_level):
    if train_data.empty:
        raise HTTPException(status_code=500, detail="Data source is unavailable.")
    
    # Check if the required columns are present
    if 'course_difficulty' not in train_data.columns or 'course_skills' not in train_data.columns:
        raise HTTPException(status_code=500, detail="Data source is missing required columns.")
    
    # Filter by complexity level
    filtered_data = train_data[train_data['course_difficulty'].str.contains(complexity_level, case=False, na=False)]

    # Filter by skill
    filtered_data = filtered_data[filtered_data['course_skills'].str.contains(skill, case=False, na=False)]

    return filtered_data

# Define the FastAPI route for filtering
@app.post("/filter_courses/")
def get_filtered_courses(request: FilterRequest):
    # Get filtered courses using the filtering function
    try:
        filtered_courses = filter_courses(train_data, request.skill, request.complexity_level)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")

    if filtered_courses.empty:
        raise HTTPException(status_code=404, detail="No courses found matching the criteria.")

    # Convert filtered courses to a list of dictionaries
    filtered_courses_list = filtered_courses.to_dict(orient='records')

    return {"courses": filtered_courses_list}

# Define the API endpoint for quiz generation@app.post("/generate-quiz")
async def generate_quiz(request: QuizRequest):
    try:
        with get_openai_callback() as cb:
            print(f"request object: {request}")
            response = generate_evaluate_chain({
                "jobrole": request.jobrole,
                "experience": request.experience,
                "response_json": json.dumps(RESPONSE_JSON)
            })  

        quiz = response.get("quiz")

        # Debug: Print the raw quiz string
        print(f"Raw quiz response: {quiz}")

        # Remove triple backticks and unnecessary "json" from the string
        quiz = quiz.replace("```json", "").replace("```", "").strip()

        # Debug: Print the cleaned quiz string
        print(f"Cleaned quiz response: {quiz}")

        # Validate if the response is a valid JSON string
        try:
            quiz = json.loads(quiz)
        except json.JSONDecodeError as e:
            print(f"Invalid JSON response: {quiz}")
            raise HTTPException(status_code=500, detail=f"Invalid JSON response from the LLM: {str(e)}")

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