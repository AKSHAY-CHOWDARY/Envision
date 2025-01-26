import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Building2, MapPin, Calendar, Clock, Trash2, ExternalLink } from 'lucide-react';

const statusColors = {
  applied: 'bg-blue-100 text-blue-800',
  interviewing: 'bg-purple-100 text-purple-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
};

const statusOptions = ['applied', 'interviewing', 'accepted', 'rejected', 'withdrawn'];

const JobCard = ({ job, onStatusChange, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            {job.company_logo_url ? (
              <img src={job.company_logo_url} alt={job.company_name} className="w-8 h-8 object-contain" />
            ) : (
              <Building2 className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job.job_position}</h3>
            <div className="flex items-center space-x-2">
              <a 
                href={job.company_profile} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {job.company_name}
              </a>
              <a 
                href={job.job_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-sm text-gray-500">ID: {job.job_id}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(job.job_id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{job.job_location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-1" />
          <span className="text-sm">
            Posted: {format(new Date(job.job_posting_date), 'MMM d, yyyy')}
          </span>
        </div>
        {job.lastUpdated && (
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">
              Updated: {format(new Date(job.lastUpdated), 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <select
          value={job.status || 'applied'}
          onChange={(e) => onStatusChange(job.job_id, e.target.value)}
          className={`${
            statusColors[job.status || 'applied']
          } px-3 py-1 rounded-full text-sm font-medium border-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
};

export default JobCard;