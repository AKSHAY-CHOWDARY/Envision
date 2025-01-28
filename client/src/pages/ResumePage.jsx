import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

function parseLatex(latex) {
  const sections = [];
  const sectionRegex = /\\section\{([^}]+)\}([\s\S]*?)(?=\\section|$)/g;
  let match;

  while ((match = sectionRegex.exec(latex)) !== null) {
    sections.push({
      title: match[1],
      content: match[2].trim()
    });
  }

  return sections;
}

function ResumePage() {
  const [showEditor, setShowEditor] = useState(true);
  const [latexCode, setLatexCode] = useState(`\\documentclass{article}
\\begin{document}

\\section{Personal Information}
Name: John Doe\\\\
Email: john@example.com\\\\
Phone: (555) 123-4567\\\\
Location: New York, NY

\\section{Education}
\\textbf{Bachelor of Science in Computer Science}\\\\
University of Example (2018-2022)\\\\
GPA: 3.8/4.0

\\section{Experience}
\\textbf{Software Engineer}\\\\
Company XYZ (2022-Present)\\\\
* Developed and maintained full-stack web applications\\\\
* Implemented CI/CD pipelines reducing deployment time by 50\\%\\\\
* Led a team of 3 developers in modernizing legacy systems

\\section{Skills}
\\textbf{Programming Languages:} JavaScript, TypeScript, Python, Java\\\\
\\textbf{Frameworks:} React, Node.js, Express, Django\\\\
\\textbf{Tools:} Git, Docker, AWS, Jenkins

\\section{Projects}
\\textbf{AI-Powered Resume Builder}\\\\
* Built a web application that generates professional resumes using AI\\\\
* Implemented real-time LaTeX preview functionality\\\\
* Used React, TypeScript, and Monaco Editor

\\end{document}`);

  const [parsedSections, setParsedSections] = useState([]);

  useEffect(() => {
    setParsedSections(parseLatex(latexCode));
  }, [latexCode]);

  const handleEditorChange = (value) => {
    if (value) {
      setLatexCode(value);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="p-4">
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {showEditor ? 'Hide LaTeX Editor' : 'Show LaTeX Editor'}
        </button>
      </div>

      <div className="flex">
        {showEditor && (
          <div className="w-1/2 p-4 bg-[#1e293b]">
            <Editor
              height="90vh"
              defaultLanguage="latex"
              theme="vs-dark"
              value={latexCode}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        )}

        <div className={`${showEditor ? 'w-1/2' : 'w-full'} p-4`}>
          <div className="bg-white rounded-lg shadow-xl p-8 min-h-[90vh]">
            <div className="text-black">
              {parsedSections.map((section, index) => (
                <div key={index} className="mb-6">
                  <h2 className="text-xl font-bold mb-2">{section.title}</h2>
                  <div className="text-gray-800">
                    <Latex>{section.content}</Latex>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumePage;
