import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, ChevronRight, Briefcase } from 'lucide-react';
import JobList from '../components/JobList';
import axios from 'axios';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    jobTypes: [],
    experienceLevels: [],
    datePosted: '',
    salaryRange: { min: 0, max: 100000 }
  });
  const [showingResults, setShowingResults] = useState({ start: 1, end: 6, total: 10 });

  // Categories data
  const categories = [
    { id: 'commerce', name: 'Commerce', count: 10 },
    { id: 'telecommunications', name: 'Telecommunications', count: 10 },
    { id: 'hotels-tourism', name: 'Hotels & Tourism', count: 10 },
    { id: 'education', name: 'Education', count: 10 },
    { id: 'financial-services', name: 'Financial Services', count: 10 }
  ];

  const jobTypes = [
    { id: 'full-time', name: 'Full Time', count: 10 },
    { id: 'part-time', name: 'Part Time', count: 10 },
    { id: 'freelance', name: 'Freelance', count: 10 },
    { id: 'seasonal', name: 'Seasonal', count: 10 },
    { id: 'fixed-term', name: 'Fixed Term', count: 10 }
  ];

  const experienceLevels = [
    { id: 'no-experience', name: 'No experience', count: 10 },
    { id: 'fresher', name: 'Fresher', count: 10 },
    { id: 'intermediate', name: 'Intermediate', count: 10 },
    { id: 'expert', name: 'Expert', count: 10 }
  ];

  const datePostedOptions = [
    { id: 'all', name: 'All' },
    { id: 'last-24-hours', name: 'Last 24 Hours' },
    { id: 'last-7-days', name: 'Last 7 Days' },
    { id: 'last-30-days', name: 'Last 30 Days' }
  ];

  // Function to fetch jobs from your backend
  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint

      const response = await axios.post('http://localhost:5000/user-api/jobs', {filters});
      console.log(filters);
      if(response.data.message === "All Jobs"){
        setJobs(response.data.payload);
      }else{
        setError('Failed to fetch jobs');
      }
      // Update showing results count
      setShowingResults({
        start: 1,
        end: Math.min(6, data.length),
        total: data.length
      });
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleJobTypeChange = (jobType) => {
    setFilters(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(jobType)
        ? prev.jobTypes.filter(t => t !== jobType)
        : [...prev.jobTypes, jobType]
    }));
  };

  const handleExperienceLevelChange = (level) => {
    setFilters(prev => ({
      ...prev,
      experienceLevels: prev.experienceLevels.includes(level)
        ? prev.experienceLevels.filter(l => l !== level)
        : [...prev.experienceLevels, level]
    }));
  };

  const handleDatePostedChange = (date) => {
    setFilters(prev => ({ ...prev, datePosted: date }));
  };

  const handleSalaryRangeChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [e.target.name]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
            <div className="text-sm text-gray-500">
              Showing {showingResults.start}-{showingResults.end} of {showingResults.total} results
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Search */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Job Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Search jobs..."
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Location */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Location</h3>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Choose city..."
                />
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-gray-600">{category.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{category.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Job Type</h3>
              <div className="space-y-2">
                {jobTypes.map(type => (
                  <label key={type.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.jobTypes.includes(type.id)}
                        onChange={() => handleJobTypeChange(type.id)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-gray-600">{type.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{type.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Experience Level</h3>
              <div className="space-y-2">
                {experienceLevels.map(level => (
                  <label key={level.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.experienceLevels.includes(level.id)}
                        onChange={() => handleExperienceLevelChange(level.id)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-gray-600">{level.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{level.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Posted */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Date Posted</h3>
              <div className="space-y-2">
                {datePostedOptions.map(option => (
                  <label key={option.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="datePosted"
                        checked={filters.datePosted === option.id}
                        onChange={() => handleDatePostedChange(option.id)}
                        className="rounded-full border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-gray-600">{option.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Salary Range</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Min Salary</label>
                  <input
                    type="range"
                    name="min"
                    min="0"
                    max="100000"
                    step="1000"
                    value={filters.salaryRange.min}
                    onChange={handleSalaryRangeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">${filters.salaryRange.min}</span>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Max Salary</label>
                  <input
                    type="range"
                    name="max"
                    min="0"
                    max="100000"
                    step="1000"
                    value={filters.salaryRange.max}
                    onChange={handleSalaryRangeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">${filters.salaryRange.max}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-8">Loading jobs...</div>
            ) : (
              <div className="space-y-4">
                {/* Sort dropdown */}
                <div className="flex justify-end mb-4">
                  <select className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-teal-500 focus:border-teal-500">
                    <option>Sort by latest</option>
                    <option>Sort by relevance</option>
                    <option>Sort by salary</option>
                  </select>
                </div>

                <JobList jobs={jobs} />

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center border rounded-md bg-indigo-500 text-white">
                      1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-50">
                      2
                    </button>
                    <button className="px-3 py-1 border rounded-md hover:bg-gray-50 flex items-center gap-1">
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Jobs;