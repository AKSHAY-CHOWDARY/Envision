import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questions, jobRoles } from '../data/quizData';
import CodeQuestion from './CodeQuestion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Quiz() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [currentDomain, setCurrentDomain] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [previousScores] = useState(() => {
    // In a real app, this would come from a database
    return {
      technical: [65, 70, 75],
      coding: [60, 65, 70],
      'system-design': [55, 60, 65]
    };
  });

  const role = jobRoles.find(r => r.id === roleId);
  const domainQuestions = questions[roleId]?.[currentDomain] || [];

  useEffect(() => {
    if (!role) {
      navigate('/');
      return;
    }
    setCurrentDomain(role.domains[0]);
  }, [roleId, role, navigate]);

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentDomain]: {
        ...prev[currentDomain],
        [currentQuestion]: answer
      }
    }));
  };

  const handleNext = () => {
    if (currentQuestion < domainQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (role.domains.indexOf(currentDomain) < role.domains.length - 1) {
      const nextDomain = role.domains[role.domains.indexOf(currentDomain) + 1];
      setCurrentDomain(nextDomain);
      setCurrentQuestion(0);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let scores = {};
    let total = 0;
    let correct = 0;

    role.domains.forEach(domain => {
      const domainQuestions = questions[roleId][domain];
      const domainAnswers = answers[domain] || {};
      let domainCorrect = 0;

      domainQuestions.forEach((q, idx) => {
        if (q.type === 'code') {
          domainCorrect += domainAnswers[idx] ? 1 : 0;
        } else if (domainAnswers[idx] === q.correct) {
          domainCorrect++;
        }
      });

      scores[domain] = {
        correct: domainCorrect,
        total: domainQuestions.length,
        percentage: (domainCorrect / domainQuestions.length) * 100,
        improvement: previousScores[domain] 
          ? ((domainCorrect / domainQuestions.length) * 100) - previousScores[domain][previousScores[domain].length - 1]
          : 0
      };

      total += domainQuestions.length;
      correct += domainCorrect;
    });

    return {
      domains: scores,
      total: {
        correct,
        total,
        percentage: (correct / total) * 100
      }
    };
  };

  if (!role || !currentDomain) return null;

  if (showResults) {
    const scores = calculateScore();
    
    const chartData = {
      labels: Object.keys(scores.domains),
      datasets: [
        {
          label: 'Current Score (%)',
          data: Object.values(scores.domains).map(s => s.percentage),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Previous Score (%)',
          data: Object.keys(scores.domains).map(domain => 
            previousScores[domain] ? previousScores[domain][previousScores[domain].length - 1] : 0
          ),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Score Comparison' }
      },
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Quiz Results</h2>
          
          <div className="mb-8">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(scores.domains).map(([domain, score]) => (
              <div key={domain} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold capitalize mb-3">{domain}</h3>
                <div className="space-y-2">
                  <p className="text-lg">
                    Score: <span className="font-semibold">{score.correct}/{score.total}</span>
                  </p>
                  <p className="text-lg">
                    Percentage: <span className="font-semibold">{score.percentage.toFixed(1)}%</span>
                  </p>
                  <p className={`text-lg ${score.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Improvement: {score.improvement > 0 ? '+' : ''}{score.improvement.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-2xl font-bold mb-3">Total Score</h3>
            <p className="text-xl">
              {scores.total.correct}/{scores.total.total} ({scores.total.percentage.toFixed(1)}%)
            </p>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = domainQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold capitalize">{currentDomain}</h2>
            <p className="text-lg text-gray-600">
              Question {currentQuestion + 1} of {domainQuestions.length}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / domainQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
          
          {question.type === 'code' ? (
            <CodeQuestion question={question} onAnswer={handleAnswer} />
          ) : (
            <div className="space-y-4">
              {question.options?.map((option, idx) => (
                <div
                  key={idx}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[currentDomain]?.[currentQuestion] === idx
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleAnswer(idx)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {currentQuestion < domainQuestions.length - 1 ? 'Next Question' : 
             role.domains.indexOf(currentDomain) < role.domains.length - 1 ? 'Next Section' : 
             'Finish Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;