import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, ChevronRight, ChevronLeft, Briefcase } from 'lucide-react';
import JobList from '../components/JobList';
import axios from 'axios';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    job_location: '',
    job_posting_date: 'all',
    sortBy: 'latest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);

  const datePostedOptions = [
    { id: 'all', name: 'All' },
    { id: 'last-24-hours', name: 'Last 24 Hours' },
    { id: 'last-7-days', name: 'Last 7 Days' },
    { id: 'last-30-days', name: 'Last 30 Days' }
  ];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/user-api/jobs', {
        filters: {
          search: filters.search,
          job_location: filters.job_location,
          job_posting_date: filters.job_posting_date,
          sortBy: filters.sortBy
        }
      });

      if (response.data.message === "All Jobs" && Array.isArray(response.data.payload)) {
        let filteredJobs = response.data.payload;
        
        // Apply search filter
        if (filters.search) {
          filteredJobs = filteredJobs.filter(job => 
            job.job_position?.toLowerCase().includes(filters.search.toLowerCase()) ||
            job.company_name?.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        // Apply location filter
        if (filters.job_location) {
          filteredJobs = filteredJobs.filter(job => 
            job.job_location === filters.job_location
          );
        }
        
        // Apply date filter
        if (filters.job_posting_date !== 'all') {
          const now = new Date();
          filteredJobs = filteredJobs.filter(job => {
            const job_posting_date = new Date(job.job_posting_date);
            const hoursDiff = (now.getTime() - job_posting_date.getTime()) / (1000 * 60 * 60);
            
            switch (filters.job_posting_date) {
              case 'last-24-hours':
                return hoursDiff <= 24;
              case 'last-7-days':
                return hoursDiff <= 168;
              case 'last-30-days':
                return hoursDiff <= 720;
              default:
                return true;
            }
          });
        }
        
        // Apply sorting
        filteredJobs.sort((a, b) => {
          const dateA = new Date(a.job_posting_date).getTime();
          const dateB = new Date(b.job_posting_date).getTime();
          return filters.sortBy === 'latest' ? dateB - dateA : dateA - dateB;
        });
        
        setJobs(filteredJobs);
      } else {
        setError('No jobs found');
        setJobs([]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs. Please try again later.');
      setJobs([]);
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

  const handleLocationChange = (e) => {
    setFilters(prev => ({ ...prev, job_location: e.target.value }));
  };

  const handleDatePostedChange = (date) => {
    setFilters(prev => ({ ...prev, job_posting_date: date }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value }));
  };

  // Get unique locations from jobs
  const locations = [...new Set(jobs.map(job => job.job_location))].filter(Boolean);

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-extrabold text-[#264A7A]">Job Listings</h1>
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, jobs.length)} of {jobs.length} results
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
                Search by Job Title or Company
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
                <select
                  value={filters.job_location}
                  onChange={handleLocationChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">All Locations</option>
                  {locations.map(job_location => (
                    <option key={job_location} value={job_location}>{job_location}</option>
                  ))}
                </select>
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
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
                        checked={filters.job_posting_date === option.id}
                        onChange={() => handleDatePostedChange(option.id)}
                        className="rounded-full border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-gray-600">{option.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-8">Loading jobs...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : (
              <div className="space-y-4">
                {/* Sort dropdown */}
                <div className="flex justify-end mb-4">
                  <select
                    value={filters.sortBy}
                    onChange={handleSortChange}
                    className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="latest">Sort by latest</option>
                    <option value="oldest">Sort by oldest</option>
                  </select>
                </div>

                {currentJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No jobs found matching your criteria
                  </div>
                ) : (
                  <JobList jobs={currentJobs} />
                )}

                {jobs.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1">{currentPage} of {totalPages}</span>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Jobs;