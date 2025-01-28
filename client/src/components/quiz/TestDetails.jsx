import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, FileText, AlertCircle, ChevronDown } from 'lucide-react';

const TestDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = location.state || {};
  const [experience, setExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testDetails = {
    duration: '60 minutes',
    questions: '20 questions',
    rules: [
      'You cannot go back to previous questions',
      'Each question has only one correct answer',
      'Timer will start once you begin the test',
      'Results will be shown immediately after completion'
    ]
  };

  const handleStartTest = async () => {
    if (!experience) {
      alert('Please select your experience level');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/tests/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobrole: role.title,
          experience: experience,
          userId: 'user123' // In a real app, this would come from auth context
        }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/quiz', { 
          state: { 
            testId: data.payload._id,
            questions: data.payload.quiz 
          }
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert('Failed to generate questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">{role?.title} Assessment</h1>
          <p className="text-gray-600 mb-8">{role?.description}</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Duration</h3>
                <p className="text-gray-600">{testDetails.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Questions</h3>
                <p className="text-gray-600">{testDetails.questions}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              Test Rules
            </h2>
            <ul className="space-y-2">
              {testDetails.rules.map((rule, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Experience Level
            </label>
            <div className="relative">
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 pl-3 pr-10 text-gray-900"
              >
                <option value="">Select experience</option>
                <option value="Junior">Junior (0-2 years)</option>
                <option value="Intermediate">Intermediate (2-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <button
            onClick={handleStartTest}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isLoading ? 'Preparing Test...' : 'Start Assessment →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestDetails;