import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const jobRoles = [
  {
    title: 'Frontend Developer',
    path: 'frontend-developer',
    description: 'Build user interfaces and web applications',
    icon: '💻',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    avgSalary: '$75,000 - $120,000',
    demand: 'High',
  },
  {
    title: 'Backend Developer',
    path: 'backend-developer',
    description: 'Develop server-side logic and databases',
    icon: '⚙️',
    skills: ['Python', 'Node.js', 'SQL', 'APIs'],
    avgSalary: '$80,000 - $130,000',
    demand: 'Very High',
  },
  {
    title: 'Data Scientist',
    path: 'data-scientist',
    description: 'Analyze and interpret complex data to help companies make data-driven decisions',
    icon: '📊',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'Statistics', 'Data Visualization'],
    avgSalary: '$85,000 - $150,000',
    demand: 'Very High',
  },  
 
  {
    "title": "Software Engineer",
    "path": "software-engineer",
    "description": "Develop and maintain software applications, ensuring scalability, performance, and reliability.",
    "icon": "💻",
    "skills": ["Java", "C++", "Data Structures", "Algorithms", "Software Development Lifecycle"],
    "avgSalary": "$80,000 - $130,000",
    "demand": "Very High"
  },
  {
    "title": "Machine Learning Engineer",
    "path": "machine-learning-engineer",
    "description": "Design and build machine learning models to solve real-world problems, focusing on data pipelines and algorithms.",
    "icon": "🤖",
    "skills": ["Python", "Machine Learning", "Data Engineering", "Deep Learning", "TensorFlow"],
    "avgSalary": "$90,000 - $150,000",
    "demand": "Very High"
  },
  {
    "title": "DevOps Engineer",
    "path": "devops-engineer",
    "description": "Automate and streamline software development and deployment processes using CI/CD, cloud infrastructure, and containerization tools.",
    "icon": "⚙️",
    "skills": ["DevOps", "CI/CD", "Automation", "Cloud Computing", "Linux", "Monitoring"],
    "avgSalary": "$90,000 - $160,000",
    "demand": "High"
  }
  
  
  
  
];

function JobRoles() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredRoles = jobRoles.filter(role =>
    role.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <motion.h1 
          className="text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Explore Job Roles
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Discover your perfect career path and start learning today
        </motion.p>
        <motion.div 
          className="max-w-xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <input
            type="text"
            placeholder="Search job roles..."
            className="w-full px-6 py-4 rounded-lg border-2 border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredRoles.map((role, index) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300"
            onClick={() => 
              navigate(`/jobrole/${role.title.toLowerCase().replace(/\s+/g, '-')}/roadmap`)
            }
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl">{role.icon}</div>
                <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                  {role.demand} Demand
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{role.title}</h2>
              <p className="text-gray-600 mb-4">{role.description}</p>
              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-500 mb-2">Key Skills:</div>
                <div className="flex flex-wrap gap-2">
                  {role.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-indigo-600 font-semibold">
                Average Salary: {role.avgSalary}
              </div>
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Click to view roadmap</span>
                <span className="text-indigo-600">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default JobRoles;
