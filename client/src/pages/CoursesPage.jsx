import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Star, Users, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    // Simulating API call with the provided data
    const data = {
      "courses": [
        {
          "course_title": "AI for Medical Diagnosis",
          "course_organization": "DeepLearning.AI",
          "course_certificate_type": "Course",
          "course_time": "1 - 4 Weeks",
          "course_rating": 4.7,
          "course_reviews_num": "1.9k",
          "course_difficulty": "Intermediate",
          "course_url": "https://www.coursera.org/learn/ai-for-medical-diagnosis",
          "course_students_enrolled": "65,794",
          "course_skills": "['Deep Learning', 'Image Segmentation', 'Machine Learning', 'model evaluation', 'Multi-class classification']",
          "course_description": "AI is transforming the practice of medicine. It's helping doctors diagnose patients more accurately, make predictions about patients' future health, and recommend better treatments."
        },
        // ... other courses
      ]
    };
    const fetchCourses = async () => {
        const response = await axios.get("http://localhost:8000/courses");
        const data = await response.json();
        setCourses(data.courses);
        setLoading(false);
        };
        fetchCourses();
    
    setCourses(data.courses);
    setLoading(false);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || course.course_difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Top Tech Courses
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Difficulty Filter */}
            <select
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Course Grid */
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Course Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-2">
                        {course.course_organization}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {course.course_title}
                      </h3>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full">
                      {course.course_certificate_type}
                    </span>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {course.course_time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-4 h-4 mr-2 text-yellow-400" />
                      {course.course_rating} ({course.course_reviews_num} reviews)
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {course.course_students_enrolled} students
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Award className="w-4 h-4 mr-2" />
                      {course.course_difficulty}
                    </div>
                  </div>

                  {/* Course Description */}
                  <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                    {course.course_description}
                  </p>

                  {/* Call to Action */}
                  <div className="mt-6">
                    <a
                      href={course.course_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Course
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;