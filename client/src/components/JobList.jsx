import React from 'react';
import { Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';

const JobCard = ({ job }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex gap-4">
        <img src={job.company_logo_url} alt={`${job.company_name} logo`} className="w-12 h-12 rounded-lg" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.job_position}</h3>
          <p className="text-gray-600">{job.company_name}</p>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.job_location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.job_posting_date}
            </span>
          </div>
        </div>
      </div>
      <a href={job.job_link} className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors">
        Job Details
      </a>
    </div>
  </div>
);

const JobList = ({ jobs }) => (
  <div className="space-y-4">
    {jobs.map((job) => (
      <JobCard key={job.job_id} job={job} />
    ))}
  </div>
);

export default JobList;