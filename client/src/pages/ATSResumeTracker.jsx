import React, { useState } from "react";
import axios from "axios";

function ATSResumeTracker() {
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [promptType, setPromptType] = useState("review");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !jobDescription) {
      alert("Please upload a resume and provide a job description.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("input_text", jobDescription);
    formData.append("file", file);
    formData.append("prompt_type", promptType);

    try {
      const res = await axios.post("http://127.0.0.1:5000/analyze_resume", formData);
      setResponse(res.data.response);
    } catch (err) {
      console.error(err);
      alert("Error processing the request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-center text-white">
              ATS Resume Scanner
            </h1>
            <p className="mt-2 text-center text-blue-100">
              Upload your resume and job description to get instant feedback
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Job Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows="5"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Resume (PDF)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </div>
                </div>
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {file.name}
                  </p>
                )}
              </div>

              {/* Prompt Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Analysis Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={promptType}
                  onChange={(e) => setPromptType(e.target.value)}
                >
                  <option value="review">Tell Me About the Resume</option>
                  <option value="keywords">Get Keywords</option>
                  <option value="percentage">Percentage Match</option>
                  <option value="coverletter">Get Cover Letter</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>Analyzing Resume...</span>
                  </div>
                ) : (
                  "Analyze Resume"
                )}
              </button>
            </div>

            {/* Response Section */}
            {response && (
              <div className="mt-8">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Analysis Results
                  </h4>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 text-sm">
                      {response}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ATSResumeTracker;