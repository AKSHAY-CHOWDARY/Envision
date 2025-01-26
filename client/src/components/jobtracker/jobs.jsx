// TODO: Replace with actual API endpoints when backend is ready
const API_BASE_URL = '/api';

// Temporary data storage until backend is connected
let MOCK_JOBS = [
  {
    id: '1',
    company: 'TechCorp',
    position: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    status: 'applied',
    appliedDate: '2024-03-01',
    lastUpdated: '2024-03-01',
    companyLogo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=50&h=50&fit=crop'
  }
];

// TODO: Implement actual API integration
export const fetchJobs = async () => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/jobs`);
    // return await response.json();
    return MOCK_JOBS;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const addJob = async (jobData) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/jobs`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(jobData),
    // });
    // return await response.json();
    const newJob = {
      ...jobData,
      id: String(MOCK_JOBS.length + 1),
      status: 'applied',
      appliedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    MOCK_JOBS = [...MOCK_JOBS, newJob];
    return newJob;
  } catch (error) {
    console.error('Error adding job:', error);
    throw error;
  }
};

export const updateJobStatus = async (jobId, status) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/status`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ status }),
    // });
    // return await response.json();
    MOCK_JOBS = MOCK_JOBS.map(job =>
      job.id === jobId
        ? { ...job, status, lastUpdated: new Date().toISOString() }
        : job
    );
    return MOCK_JOBS.find(job => job.id === jobId);
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
};

export const deleteJob = async (jobId) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    //   method: 'DELETE',
    // });
    // return await response.json();
    MOCK_JOBS = MOCK_JOBS.filter(job => job.id !== jobId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};