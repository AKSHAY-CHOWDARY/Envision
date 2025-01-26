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

  useEffect(() => {
    const fetchLinkedInData = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/user-api/linkedIn/${userId}`);
        if (res.data.payload) {
          setUserData(res.data.payload);
          console.log(userData);
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

  const generateResume = async () => {
    if (!userData) return alert("User data not loaded yet.");
    try {
      const res = await axios.post("http://localhost:5000/user-api/generate-resume", { userData }, { responseType: "arraybuffer" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResumePdf(url);
    } catch (err) {
      console.error("Error generating resume", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6">AI Resume Generator</h2>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <input
          type="text"
          placeholder="Enter LinkedIn URL"
          value={linkedInUrl}
          onChange={(e) => setLinkedInUrl(e.target.value)}
          className="w-full px-4 py-2 text-white rounded-md mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLinkedInFetched}
        />
        <button
          onClick={fetchLinkedInData}
          disabled={!linkedInUrl || !userId || isLinkedInFetched}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50 transition mb-4"
        >
          Fetch LinkedIn Data
        </button>

        <button
          onClick={generateResume}
          disabled={!userData}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 transition"
        >
          Generate Resume
        </button>
      </div>

      {resumePdf && (
        <div className="mt-6 w-full max-w-4xl">
          <h3 className="text-xl font-semibold mb-2">Resume Preview</h3>
          <iframe src={resumePdf} className="w-full h-96 border rounded-lg shadow-md"></iframe>
        </div>
      )}
    </div>
  );
};

export default ResumeGenerator;
