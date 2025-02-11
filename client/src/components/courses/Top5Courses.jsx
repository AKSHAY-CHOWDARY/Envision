import React from 'react';
import { Star, Users, Clock, BookOpen, ExternalLink, Trophy, BarChart2 } from 'lucide-react';

const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatNumber = (numStr) => {
  return parseInt(numStr.replace(/,/g, '')).toLocaleString();
};

const parseSkills = (skillsString) => {
  try {
    // Convert single quotes to double quotes to make it a valid JSON string
    const validJsonString = skillsString.replace(/'/g, '"');
    return JSON.parse(validJsonString);
  } catch (error) {
    console.error("Error parsing skills:", error);
    return [];
  }
};

const Top5Courses = ({ courses }) => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Recommended Courses for You
          </h1>
          <p className="text-xl text-gray-600">
            Personalized course recommendations based on your Test Scores
          </p>
        </div>

        <div className="space-y-8">
          {courses.map((course, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {course.course_title}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.course_difficulty)}`}>
                        {course.course_difficulty}
                      </span>
                    </div>
                    <p className="mt-1 text-lg text-gray-600">by {course.course_organization}</p>
                  </div>
                  <a href={course.course_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                    <span>View Course</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-600">{course.course_certificate_type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-600">{course.course_time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{formatNumber(course.course_students_enrolled)} students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-600">{course.course_rating} ({course.course_reviews_num} reviews)</span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {parseSkills(course.course_skills).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="w-5 h-5 text-indigo-500" />
                    <span className="text-gray-600">Percentage Match to you: {(course.similarity_score * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Top5Courses;