import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testId, questions } = location.state || {};
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions?.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const { user } = useUser();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (option) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = option;
    setSelectedAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    //console.log(selectedAnswers);
    try {
      const response = await axios.post('http://localhost:5000/test-api/submit-answers', {
        testId: testId,
        answers: selectedAnswers,
        userId: user.id,
      });
      console.log(response);
      //const data = response.data;
      if (response.data.message === "Test submitted successfully") {
        navigate('/quiz-results', {
          state: {
            results: {
              total: questions.length,
              correct: response.data.payload.score,
              percentage: (response.data.payload.score / questions.length) * 100,
            },
            answers: selectedAnswers,
          },
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      alert('Failed to submit answers. Please try again.');
    }
  };

  if (!questions || questions.length === 0) {
    return <div>Loading...</div>;
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {question.skill}
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                Time: {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-6">{question.mcq}</h2>
          <div className="space-y-4">
            {Object.entries(question.options).map(([key, value]) => (
              <button
                key={key}
                className={`w-full text-left p-4 rounded-lg border ${
                  selectedAnswers[currentQuestion] === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleAnswerSelect(key)}
              >
                <span className="font-medium">{key.toUpperCase()}.</span> {value}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestion]}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;