import React, { useState, useEffect } from "react";
import axios from "axios";

const ResumeGenerator = () => {
  const [userData, setUserData] = useState(null);
  const [resumePdf, setResumePdf] = useState(null);

  // Fetch user details after login
  useEffect(() => {
    axios.get("http://localhost:5000/api/user-data") 
      .then((res) => setUserData(res.data))
      .catch((err) => console.error("Error fetching user data", err));
  }, []);

  const generateResume = () => {
    if (!userData) return alert("User data not loaded yet.");
    axios.post("http://localhost:5000/api/generate-resume", { userData }, { responseType: 'arraybuffer' })
      .then((res) => {
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setResumePdf(url);
      })
      .catch((err) => console.error("Error generating resume", err));
  };

  return (
    <div>
      <h2>Resume Generator</h2>
      <button onClick={generateResume} disabled={!userData}>Generate Resume</button>
      {resumePdf && (
        <iframe src={resumePdf} width="100%" height="600px" title="Resume Preview"></iframe>
      )}
    </div>
  );
};

export default ResumeGenerator;
