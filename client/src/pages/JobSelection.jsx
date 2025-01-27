import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jobRoles } from '../data/quizData';

function JobSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Technical Assessment Platform
          </h1>
          <p className="text-xl text-gray-600">
            Choose your role and test your skills
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {jobRoles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform"
              onClick={() => navigate(`/quiz/${role.id}`)}
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {role.title}
                </h2>
                <p className="text-gray-600 mb-6">{role.description}</p>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Domains
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {role.domains.map((domain) => (
                      <span
                        key={domain}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                <button className="w-full text-blue-600 font-semibold hover:text-blue-800">
                  Start Assessment →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobSelection;