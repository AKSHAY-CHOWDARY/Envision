import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const ResumeGenerator = () => {
  const { user } = useUser();
  const userId = user ? user.id : null;
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [userData, setUserData] = useState(null);
  const [resumePdf, setResumePdf] = useState(null);
  const [isLinkedInFetched, setIsLinkedInFetched] = useState(false);
  const [additionalData, setAdditionalData] = useState({
    projects: "",
    courses: "",
    certifications: "",
    skills: "",
    extracurriculars: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchLinkedInData = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/user-api/linkedIn/user_2s83EfLI29H44b7jSoklEiMlBxO`);
        if (res.data.payload) {
          setUserData(res.data.payload);
          setIsLinkedInFetched(true);
        }
      } catch (err) {
        console.error("Error fetching LinkedIn data:", err);
      }
    };

    fetchLinkedInData();
  }, [userId]);

  const fetchLinkedInData = async () => {
    if (!linkedInUrl.trim()) return alert("Please enter a valid LinkedIn URL.");
    if (!userId) return alert("User not logged in.");

    try {
      const res = await axios.post(`http://localhost:5000/user-api/linkedIn/${linkedInUrl}`, { userId });
      if (res.data.payload) {
        setUserData(res.data.payload);
        setIsLinkedInFetched(true);
        alert("LinkedIn data fetched and saved successfully.");
      } else {
        alert("Failed to fetch LinkedIn data.");
      }
    } catch (err) {
      console.error("Error fetching LinkedIn data:", err);
    }
  };

  const handleAdditionalDataChange = (e) => {
    const { name, value } = e.target;
    setAdditionalData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const generateResume = async () => {
    if (!userData) return alert("User data not loaded yet.");
    try {
      console.log(userData);
      const res = await axios.post("http://localhost:5000/user-api/generate-resume", { userData, additionalData }, { responseType: "arraybuffer" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResumePdf(url);
    } catch (err) {
      console.error("Error generating resume", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-violet-900 mb-4">AI Resume Generator</h1>
            <p className="text-violet-600">Transform your LinkedIn profile into a professional resume</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Input Section */}
            <div className="space-y-6 lg:ml-[-30px]"> 
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter LinkedIn URL"
                      value={linkedInUrl}
                      onChange={(e) => setLinkedInUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-violet-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                      disabled={isLinkedInFetched}
                    />
                    <button
                      onClick={fetchLinkedInData}
                      disabled={!linkedInUrl || !userId || isLinkedInFetched}
                      className="mt-3 w-full bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                    >
                      Fetch LinkedIn Data
                    </button>
                  </div>

                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="w-full bg-white border-2 border-violet-600 text-violet-600 hover:bg-violet-50 font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {showForm ? 'Hide Additional Data' : 'Enter Additional Data'}
                  </button>

                  <button
                    onClick={generateResume}
                    disabled={!userData}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
                  >
                    Generate Resume
                  </button>
                </div>
              </div>

              {showForm && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-semibold text-violet-900 mb-6">Additional Information</h3>
                  <div className="space-y-4">
                    {Object.entries(additionalData).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-violet-700 mb-2 capitalize">
                          {key}
                        </label>
                        <textarea
                          name={key}
                          value={value}
                          onChange={handleAdditionalDataChange}
                          className="w-full px-4 py-3 rounded-lg border border-violet-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
                          placeholder={`Enter your ${key}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Preview Section */}
            <div className="lg:mt-0 mt-6 flex justify-center">
              {resumePdf ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-[1100px]">
                  <h3 className="text-xl font-semibold text-violet-900 mb-4">Resume Preview</h3>
                  <iframe 
                    src={resumePdf} 
                    className="w-[90vw] max-w-[800px] h-[800px] rounded-lg border border-violet-200"
                    title="Resume Preview"
                  />
                </div>
              ) : (
                <div className="bg-white/50 rounded-2xl border-2 border-dashed border-violet-300 p-8 flex items-center justify-center h-[400px] w-full max-w-[1100px]">
                  <p className="text-violet-600 text-center">
                    Your resume preview will appear here after generation
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeGenerator;
