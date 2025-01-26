from flask import Flask, request, jsonify
from flask_cors import CORS
import pdf2image
import io
import os
import json
import base64
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure the Google Generative AI API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Define functions
def get_gemini_response(input_text, pdf_content, prompt):
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content([input_text, pdf_content[0], prompt])
    return response.text

def input_pdf_setup(file):
    images = pdf2image.convert_from_bytes(file.read())
    first_page = images[0]
    img_byte_arr = io.BytesIO()
    first_page.save(img_byte_arr, format="JPEG")
    img_byte_arr = img_byte_arr.getvalue()
    pdf_parts = [
        {
            "mime_type": "image/jpeg",
            "data": base64.b64encode(img_byte_arr).decode()
        }
    ]
    return pdf_parts


# Define routes
@app.route("/analyze_resume", methods=["POST"])
def analyze_resume():
    data = request.form
    input_text = data.get("input_text")
    prompt_type = data.get("prompt_type")

    # Define prompts
    prompts = {
        "review": """
            You are an experienced Technical Human Resource Manager, your task is to review the provided resume against the job description. 
            Please share your professional evaluation on whether the candidate's profile aligns with the role. 
            Highlight the strengths and weaknesses of the applicant in relation to the specified job requirements.
        """,
        "keywords": """
            As an expert ATS (Applicant Tracking System) scanner with an in-depth understanding of AI and ATS functionality, 
            your task is to evaluate a resume against a provided job description. Please identify the specific skills and keywords 
            necessary to maximize the impact of the resume and provide response in json format as {Technical Skills:[], Analytical Skills:[], Soft Skills:[]}.
            Note: Please do not make up the answer only answer from job description provided.
        """,
        "percentage": """
            You are a skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality, 
            your task is to evaluate the resume against the provided job description. Give me the percentage of match if the resume matches
            the job description. First the output should come as percentage and then keywords missing and last final thoughts.
        """,
        "coverletter": """  
          You are an expert in crafting professional and tailored cover letters based on the provided job description and resume. 
          Carefully analyze the job description and the resume to create a polished and compelling cover letter that aligns with the role’s requirements. Ensure the content is professional, concise, and free from grammatical errors.
          
        """
        
    }

    # Handle file upload
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        pdf_content = input_pdf_setup(file)
        prompt = prompts.get(prompt_type)
        if not prompt:
            return jsonify({"error": "Invalid prompt type"}), 400

        response = get_gemini_response(input_text, pdf_content, prompt)

        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)


