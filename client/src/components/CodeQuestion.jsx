import React, { useState } from 'react';
import CodeEditor from '@monaco-editor/react';

function CodeQuestion({ question, onAnswer }) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(question.starterCode);
  const [testResults, setTestResults] = useState(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' }
  ];

  const runTests = () => {
    // In a real application, you'd want to use a proper code execution service
    // This is a simple example for JavaScript code only
    try {
      const results = question.testCases.map(test => {
        const func = new Function('return ' + code)();
        const result = func(test.input);
        return {
          input: test.input,
          expected: test.expected,
          actual: result,
          passed: result === test.expected
        };
      });
      setTestResults(results);
      onAnswer(results.every(r => r.passed));
    } catch (error) {
      setTestResults([{ error: error.message, passed: false }]);
      onAnswer(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-4">
        <label className="text-sm font-medium text-gray-700">Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {languages.map(lang => (
            <option key={lang.id} value={lang.id}>{lang.name}</option>
          ))}
        </select>
      </div>

      <CodeEditor
        height="300px"
        language={language}
        value={code}
        onChange={setCode}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true,
        }}
      />

      <div className="space-y-4">
        <button
          onClick={runTests}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Run Tests
        </button>

        {testResults && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold">Test Results:</h4>
            {testResults.map((result, idx) => (
              <div
                key={idx}
                className={`p-3 rounded ${
                  result.error
                    ? 'bg-red-100 text-red-800'
                    : result.passed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {result.error ? (
                  <p>Error: {result.error}</p>
                ) : (
                  <>
                    <p>Input: {JSON.stringify(result.input)}</p>
                    <p>Expected: {JSON.stringify(result.expected)}</p>
                    <p>Actual: {JSON.stringify(result.actual)}</p>
                    <p className="font-semibold">
                      {result.passed ? 'Passed ✓' : 'Failed ✗'}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeQuestion;