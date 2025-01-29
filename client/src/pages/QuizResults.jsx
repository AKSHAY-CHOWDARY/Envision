import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, answers, questions } = location.state || { results: { correct: 0, total: 0, percentage: 0 }, answers: {}, questions: [] };

  const getSkillPerformance = () => {
    const skillMap = {};
    questions.forEach((question, index) => {
      if (!skillMap[question.skill]) {
        skillMap[question.skill] = { total: 0, correct: 0 };
      }
      skillMap[question.skill].total++;
      if (answers[index] === question.correct) {
        skillMap[question.skill].correct++;
      }
    });
    return skillMap;
  };

  const skillPerformance = getSkillPerformance();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-6">Quiz Results</h1>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Score</h3>
              <p className="text-3xl font-bold text-blue-600">{results.percentage.toFixed(1)}%</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Correct Answers</h3>
              <p className="text-3xl font-bold text-green-600">{results.correct}</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Questions</h3>
              <p className="text-3xl font-bold text-orange-600">{results.total}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Skill Performance</h2>
            <div className="space-y-4">
              {Object.entries(skillPerformance).map(([skill, data]) => (
                <div key={skill} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill}</span>
                    <span className="text-gray-600">
                      {((data.correct / data.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(data.correct / data.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Question Review</h2>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {answers[index] === question.correct ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium mb-2">{question.mcq}</p>
                      <p className="text-sm text-gray-600">
                        Your answer: {question.options[answers[index]]}
                      </p>
                      {answers[index] !== question.correct && (
                        <p className="text-sm text-green-600">
                          Correct answer: {question.options[question.correct]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;