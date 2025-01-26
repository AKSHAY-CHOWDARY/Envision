/*import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Search, Filter, PlusCircle } from 'lucide-react';
import JobCard from '../components/jobtracker/JobCard';
import AddJobModal from '../components/jobtracker/AddJobModal';
import axios from 'axios';
import {useUser} from '@clerk/clerk-react'

function JobTracker() {
  const {user} = useUser();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await axios.get(`/jobs-track/${user.id}`)
      if(data.message=="tracking jobs"){
        setJobs(data);
        setError(null);
      }else{
        setError('Failed to load jobs. Please try again later.');
      }
    } catch (err) {
      setError(`Failed to load jobs. Please try again later.,${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData) => {
    try {
      const newJob = await axios.post('/add-tracking-job',{jobId:jobData,userId:user.id,status:"applied"});
      setJobs(prevJobs => [...prevJobs, newJob]);
    } catch (err) {
      setError('Failed to add job. Please try again.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put('/update-job-status',{userId:user.id, jobId:id, status:newStatus});
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === id
            ? { ...job, status: newStatus, lastUpdated: new Date().toISOString() }
            : job
        )
      );
    } catch (err) {
      setError('Failed to update job status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/delete-job',{userId:user.id, jobId:id});
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    } catch (err) {
      setError('Failed to delete job. Please try again.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.job_position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.job_location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Tracking {jobs.length} applications
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Job</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by company, position, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading jobs...</p>
            </motion.div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.job_id}
                job={job}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-500">No jobs found matching your criteria</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AddJobModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddJob}
        />
      </div>
    </div>
  );
}

export default JobTracker;*/


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Search, Filter, PlusCircle } from 'lucide-react';
import JobCard from '../components/jobtracker/JobCard';
import AddJobModal from '../components/jobtracker/AddJobModal';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

function JobTracker() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/job-api/jobs-track/${user.id}`);
      if (response.data.message === "tracking jobs") {
        setJobs(response.data.payload); 
        setError(null);
      } else {
        setError('Failed to load jobs. Please try again later.');
      }
    } catch (err) {
      setError(`Failed to load jobs. Please try again later. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData) => {
    try {
      const response = await axios.post('http://localhost:5000/job-api/add-tracking-job', { jobId: jobData, userId: user.id, status: "applied" });
      setJobs(prevJobs => [...prevJobs, response.data.payload]); // Assuming 'newJob' is the correct property
    } catch (err) {
      setError('Failed to add job. Please try again.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put('http://localhost:5000/job-api/update-job-status', { userId: user.id, jobId: id, status: newStatus });
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.job_id === id
            ? { ...job, status: newStatus, lastUpdated: new Date().toISOString() }
            : job
        )
      );
    } catch (err) {
      setError('Failed to update job status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('http://localhost:5000/job-api/delete-job', { data: { userId: user.id, jobId: id } });
      setJobs(prevJobs => prevJobs.filter(job => job.job_id !== id));
    } catch (err) {
      setError('Failed to delete job. Please try again.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Tracking {jobs.length} applications
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Job</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by company, position, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading jobs...</p>
            </motion.div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id} // Ensure 'id' is unique
                job={job}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-500">No jobs found matching your criteria</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AddJobModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddJob}
        />
      </div>
    </div>
  );
}

export default JobTracker;


