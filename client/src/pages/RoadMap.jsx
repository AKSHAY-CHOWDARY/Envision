import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const skills = {
  'frontend-developer': [
    {
      level: 'Beginner',
      skills: [
        { 
          name: 'HTML', 
          completed: false,
          courses: [
            { name: 'HTML Essential Training', url: 'https://www.linkedin.com/learning/html-essential-training', platform: 'LinkedIn Learning' },
            { name: 'Intro to HTML', url: 'https://www.codecademy.com/learn/learn-html', platform: 'Codecademy' }
          ],
          timeEstimate: '2-3 weeks'
        },
        { 
          name: 'CSS', 
          completed: false,
          courses: [
            { name: 'CSS Fundamentals', url: 'https://www.udemy.com/course/css-fundamentals', platform: 'Udemy' },
            { name: 'Learn CSS', url: 'https://web.dev/learn/css/', platform: 'web.dev' }
          ],
          timeEstimate: '3-4 weeks'
        },
        { 
          name: 'JavaScript Basics', 
          completed: false,
          courses: [
            { name: 'JavaScript: The Complete Guide', url: 'https://www.udemy.com/course/javascript-the-complete-guide', platform: 'Udemy' },
            { name: 'JavaScript.info', url: 'https://javascript.info/', platform: 'JavaScript.info' }
          ],
          timeEstimate: '4-6 weeks'
        },
      ],
    },
    {
      level: 'Intermediate',
      skills: [
        { 
          name: 'React Fundamentals', 
          completed: false,
          courses: [
            { name: 'React - The Complete Guide', url: 'https://www.udemy.com/course/react-the-complete-guide', platform: 'Udemy' },
            { name: 'React Documentation', url: 'https://react.dev/', platform: 'React.dev' }
          ],
          timeEstimate: '6-8 weeks'
        },
        { 
          name: 'State Management', 
          completed: false,
          courses: [
            { name: 'Redux Fundamentals', url: 'https://redux.js.org/tutorials/fundamentals/part-1-overview', platform: 'Redux' },
            { name: 'Zustand Tutorial', url: 'https://docs.pmnd.rs/zustand/getting-started/introduction', platform: 'Zustand' }
          ],
          timeEstimate: '3-4 weeks'
        },
        { 
          name: 'CSS Frameworks', 
          completed: false,
          courses: [
            { name: 'Tailwind CSS From Scratch', url: 'https://www.udemy.com/course/tailwind-css-from-scratch', platform: 'Udemy' },
            { name: 'Material UI Tutorial', url: 'https://mui.com/material-ui/getting-started/overview/', platform: 'MUI' }
          ],
          timeEstimate: '2-3 weeks'
        },
      ],
    },
    {
      level: 'Advanced',
      skills: [
        { 
          name: 'Performance Optimization', 
          completed: false,
          courses: [
            { name: 'Web Performance Fundamentals', url: 'https://www.udemy.com/course/web-performance-fundamentals', platform: 'Udemy' },
            { name: 'Google Web.dev Performance', url: 'https://web.dev/learn/performance', platform: 'web.dev' }
          ],
          timeEstimate: '4-5 weeks'
        },
        { 
          name: 'Testing', 
          completed: false,
          courses: [
            { name: 'JavaScript Testing', url: 'https://www.udemy.com/course/javascript-unit-testing', platform: 'Udemy' },
            { name: 'React Testing Library', url: 'https://testing-library.com/docs/react-testing-library/intro/', platform: 'Testing Library' }
          ],
          timeEstimate: '3-4 weeks'
        },
        { 
          name: 'Advanced JavaScript', 
          completed: false,
          courses: [
            { name: 'Advanced JavaScript Concepts', url: 'https://www.udemy.com/course/advanced-javascript-concepts', platform: 'Udemy' },
            { name: 'JavaScript Design Patterns', url: 'https://www.patterns.dev/', platform: 'Patterns.dev' }
          ],
          timeEstimate: '6-8 weeks'
        },
      ],
    },
  ],
  'backend-developer': [
    {
      level: 'Beginner',
      skills: [
        {
          name: 'Python Fundamentals',
          completed: false,
          courses: [
            { name: 'Python for Everybody', url: 'https://www.coursera.org/specializations/python', platform: 'Coursera' },
            { name: 'Python Crash Course', url: 'https://www.udemy.com/course/python-crash-course', platform: 'Udemy' }
          ],
          timeEstimate: '4-6 weeks'
        },
        {
          name: 'SQL Basics',
          completed: false,
          courses: [
            { name: 'SQL Essential Training', url: 'https://www.linkedin.com/learning/sql-essential-training', platform: 'LinkedIn Learning' },
            { name: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', platform: 'PostgreSQL Tutorial' }
          ],
          timeEstimate: '3-4 weeks'
        },
        {
          name: 'API Fundamentals',
          completed: false,
          courses: [
            { name: 'REST API Fundamentals', url: 'https://www.udemy.com/course/rest-api-fundamentals', platform: 'Udemy' },
            { name: 'API Documentation', url: 'https://swagger.io/docs/', platform: 'Swagger' }
          ],
          timeEstimate: '2-3 weeks'
        }
      ]
    },
    {
      level: 'Intermediate',
      skills: [
        {
          name: 'Node.js & Express',
          completed: false,
          courses: [
            { name: 'Node.js Complete Guide', url: 'https://www.udemy.com/course/nodejs-complete-guide', platform: 'Udemy' },
            { name: 'Express.js Tutorial', url: 'https://expressjs.com/', platform: 'Express.js' }
          ],
          timeEstimate: '6-8 weeks'
        },
        {
          name: 'Database Design',
          completed: false,
          courses: [
            { name: 'Database Design', url: 'https://www.coursera.org/learn/database-design', platform: 'Coursera' },
            { name: 'MongoDB University', url: 'https://university.mongodb.com/', platform: 'MongoDB' }
          ],
          timeEstimate: '4-5 weeks'
        },
        {
          name: 'Authentication & Security',
          completed: false,
          courses: [
            { name: 'Web Security', url: 'https://www.udemy.com/course/web-security', platform: 'Udemy' },
            { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', platform: 'OWASP' }
          ],
          timeEstimate: '3-4 weeks'
        }
      ]
    },
    {
      level: 'Advanced',
      skills: [
        {
          name: 'System Design',
          completed: false,
          courses: [
            { name: 'System Design Fundamentals', url: 'https://www.educative.io/path/system-design', platform: 'Educative' },
            { name: 'Distributed Systems', url: 'https://www.coursera.org/learn/distributed-systems', platform: 'Coursera' }
          ],
          timeEstimate: '8-10 weeks'
        },
        {
          name: 'Microservices',
          completed: false,
          courses: [
            { name: 'Microservices Architecture', url: 'https://www.udemy.com/course/microservices-architecture', platform: 'Udemy' },
            { name: 'Docker & Kubernetes', url: 'https://www.docker.com/get-started', platform: 'Docker' }
          ],
          timeEstimate: '6-8 weeks'
        },
        {
          name: 'Cloud Services',
          completed: false,
          courses: [
            { name: 'AWS Certified Developer', url: 'https://aws.amazon.com/certification/certified-developer-associate/', platform: 'AWS' },
            { name: 'Google Cloud Platform', url: 'https://cloud.google.com/training', platform: 'Google Cloud' }
          ],
          timeEstimate: '8-10 weeks'
        }
      ]
    }
  ],
  'data-scientist': [
    {
      level: 'Beginner',
      skills: [
        {
          name: 'Python for Data Science',
          completed: false,
          courses: [
            { name: 'Python for Data Science and Machine Learning', url: 'https://www.udemy.com/course/python-for-data-science-and-machine-learning', platform: 'Udemy' },
            { name: 'Data Science with Python', url: 'https://www.coursera.org/learn/data-science-with-python', platform: 'Coursera' }
          ],
          timeEstimate: '4-6 weeks'
        },
        {
          name: 'Mathematics for Data Science',
          completed: false,
          courses: [
            { name: 'Mathematics for Machine Learning', url: 'https://www.coursera.org/specializations/mathematics-machine-learning', platform: 'Coursera' },
            { name: 'Essential Math for Data Science', url: 'https://www.udemy.com/course/essential-math-for-data-science', platform: 'Udemy' }
          ],
          timeEstimate: '6-8 weeks'
        },
        {
          name: 'Data Preprocessing',
          completed: false,
          courses: [
            { name: 'Data Preprocessing in Python', url: 'https://www.udemy.com/course/data-preprocessing-in-python', platform: 'Udemy' },
            { name: 'Data Cleaning', url: 'https://www.datacamp.com/courses/cleaning-data-in-python', platform: 'DataCamp' }
          ],
          timeEstimate: '4 weeks'
        }
      ]
    },
    {
      level: 'Intermediate',
      skills: [
        {
          name: 'Exploratory Data Analysis (EDA)',
          completed: false,
          courses: [
            { name: 'Exploratory Data Analysis with Python', url: 'https://www.coursera.org/learn/data-analysis-with-python', platform: 'Coursera' },
            { name: 'Introduction to Data Science', url: 'https://www.udacity.com/course/intro-to-data-science--ud359', platform: 'Udacity' }
          ],
          timeEstimate: '6-8 weeks'
        },
        {
          name: 'Machine Learning Algorithms',
          completed: false,
          courses: [
            { name: 'Supervised Learning with scikit-learn', url: 'https://www.udemy.com/course/supervised-learning-with-scikit-learn', platform: 'Udemy' },
            { name: 'Machine Learning Specialization', url: 'https://www.coursera.org/specializations/machine-learning', platform: 'Coursera' }
          ],
          timeEstimate: '8-12 weeks'
        },
        {
          name: 'Data Visualization',
          completed: false,
          courses: [
            { name: 'Data Visualization with Python', url: 'https://www.datacamp.com/courses/data-visualization-with-python', platform: 'DataCamp' },
            { name: 'Mastering Data Visualization with Python', url: 'https://www.udemy.com/course/mastering-data-visualization-with-python', platform: 'Udemy' }
          ],
          timeEstimate: '4-6 weeks'
        }
      ]
    },
    {
      level: 'Advanced',
      skills: [
        {
          name: 'Deep Learning',
          completed: false,
          courses: [
            { name: 'Deep Learning Specialization', url: 'https://www.coursera.org/specializations/deep-learning', platform: 'Coursera' },
            { name: 'Deep Learning with TensorFlow', url: 'https://www.udemy.com/course/deep-learning-with-tensorflow', platform: 'Udemy' }
          ],
          timeEstimate: '12-16 weeks'
        },
        {
          name: 'Natural Language Processing (NLP)',
          completed: false,
          courses: [
            { name: 'Natural Language Processing with Python', url: 'https://www.udemy.com/course/natural-language-processing-with-python', platform: 'Udemy' },
            { name: 'Applied Text Mining in Python', url: 'https://www.coursera.org/learn/applied-text-mining', platform: 'Coursera' }
          ],
          timeEstimate: '8-10 weeks'
        },
        {
          name: 'Big Data Technologies (Spark, Hadoop)',
          completed: false,
          courses: [
            { name: 'Big Data Analysis with Spark', url: 'https://www.coursera.org/learn/big-data-analysis-with-spark', platform: 'Coursera' },
            { name: 'Hadoop for Data Science', url: 'https://www.udemy.com/course/hadoop-for-data-science', platform: 'Udemy' }
          ],
          timeEstimate: '8-10 weeks'
        }
      ]
    }
  ],
  "software-engineer": [
    {
      "level": "Beginner",
      "skills": [
        {
          "name": "Java Basics",
          "completed": false,
          "courses": [
            { "name": "Java Programming", "url": "https://www.udemy.com/course/java-programming/", "platform": "Udemy" },
            { "name": "Java for Beginners", "url": "https://www.coursera.org/learn/java-programming", "platform": "Coursera" }
          ],
          "timeEstimate": "6 weeks"
        },
        {
          "name": "Data Structures",
          "completed": false,
          "courses": [
            { "name": "Introduction to Data Structures", "url": "https://www.udemy.com/course/data-structures-and-algorithms-bootcamp/", "platform": "Udemy" },
            { "name": "Data Structures and Algorithms", "url": "https://www.coursera.org/specializations/data-structures-algorithms", "platform": "Coursera" }
          ],
          "timeEstimate": "4-6 weeks"
        }
      ]
    },
    {
      "level": "Intermediate",
      "skills": [
        {
          "name": "Advanced Java",
          "completed": false,
          "courses": [
            { "name": "Java for Intermediate Developers", "url": "https://www.udemy.com/course/java-programming-complete-course/", "platform": "Udemy" },
            { "name": "Advanced Java Concepts", "url": "https://www.coursera.org/learn/advanced-java-programming", "platform": "Coursera" }
          ],
          "timeEstimate": "6-8 weeks"
        },
        {
          "name": "Algorithm Design",
          "completed": false,
          "courses": [
            { "name": "Algorithms: Design and Analysis", "url": "https://www.coursera.org/learn/algorithmic-thinking-1", "platform": "Coursera" },
            { "name": "Data Structures and Algorithms Specialization", "url": "https://www.coursera.org/specializations/data-structures-algorithms", "platform": "Coursera" }
          ],
          "timeEstimate": "6-8 weeks"
        }
      ]
    },
    {
      "level": "Advanced",
      "skills": [
        {
          "name": "System Design",
          "completed": false,
          "courses": [
            { "name": "System Design for Beginners", "url": "https://www.udemy.com/course/system-design-interview/", "platform": "Udemy" },
            { "name": "Advanced System Design", "url": "https://www.coursera.org/learn/system-design", "platform": "Coursera" }
          ],
          "timeEstimate": "8-10 weeks"
        }
      ]
    }
  ],
  "machine-learning-engineer": [
    {
      "level": "Beginner",
      "skills": [
        {
          "name": "Python for Machine Learning",
          "completed": false,
          "courses": [
            { "name": "Python for Data Science and Machine Learning", "url": "https://www.udemy.com/course/python-for-data-science-and-machine-learning", "platform": "Udemy" },
            { "name": "Introduction to Python", "url": "https://www.coursera.org/learn/python-for-applied-data-science", "platform": "Coursera" }
          ],
          "timeEstimate": "6-8 weeks"
        },
        {
          "name": "Supervised Learning Algorithms",
          "completed": false,
          "courses": [
            { "name": "Supervised Learning with scikit-learn", "url": "https://www.udemy.com/course/supervised-learning-with-scikit-learn", "platform": "Udemy" },
            { "name": "Machine Learning with Python", "url": "https://www.coursera.org/learn/machine-learning-with-python", "platform": "Coursera" }
          ],
          "timeEstimate": "6-8 weeks"
        }
      ]
    },
    {
      "level": "Intermediate",
      "skills": [
        {
          "name": "Deep Learning Basics",
          "completed": false,
          "courses": [
            { "name": "Deep Learning with Python", "url": "https://www.udemy.com/course/deep-learning-with-python/", "platform": "Udemy" },
            { "name": "Deep Learning Specialization", "url": "https://www.coursera.org/specializations/deep-learning", "platform": "Coursera" }
          ],
          "timeEstimate": "8-12 weeks"
        },
        {
          "name": "Data Engineering for ML",
          "completed": false,
          "courses": [
            { "name": "Data Engineering for Machine Learning", "url": "https://www.udemy.com/course/data-engineering-for-machine-learning/", "platform": "Udemy" },
            { "name": "Data Engineering on Google Cloud", "url": "https://www.coursera.org/specializations/data-engineering", "platform": "Coursera" }
          ],
          "timeEstimate": "8-10 weeks"
        }
      ]
    },
    {
      "level": "Advanced",
      "skills": [
        {
          "name": "Reinforcement Learning",
          "completed": false,
          "courses": [
            { "name": "Reinforcement Learning Specialization", "url": "https://www.coursera.org/specializations/reinforcement-learning", "platform": "Coursera" },
            { "name": "Practical Deep Learning for Coders", "url": "https://www.udemy.com/course/practical-deep-learning-for-coders/", "platform": "Udemy" }
          ],
          "timeEstimate": "12-16 weeks"
        },
        {
          "name": "Machine Learning Systems Design",
          "completed": false,
          "courses": [
            { "name": "Designing Machine Learning Systems", "url": "https://www.udemy.com/course/designing-machine-learning-systems/", "platform": "Udemy" },
            { "name": "Machine Learning Systems Design", "url": "https://www.coursera.org/learn/machine-learning-systems-design", "platform": "Coursera" }
          ],
          "timeEstimate": "8-12 weeks"
        }
      ]
    }
  ],
  'devops-engineer': [
    {
      level: 'Beginner',
      skills: [
        {
          name: 'Linux Administration',
          completed: false,
          courses: [
            { name: 'Linux Administration Bootcamp', url: 'https://www.udemy.com/course/linux-administration-bootcamp', platform: 'Udemy' },
            { name: 'Linux Journey', url: 'https://linuxjourney.com/', platform: 'Linux Journey' }
          ],
          timeEstimate: '6-8 weeks'
        },
        {
          name: 'Shell Scripting',
          completed: false,
          courses: [
            { name: 'Shell Scripting Masterclass', url: 'https://www.udemy.com/course/shell-scripting-masterclass', platform: 'Udemy' },
            { name: 'Bash Academy', url: 'https://guide.bash.academy/', platform: 'Bash Academy' }
          ],
          timeEstimate: '3-4 weeks'
        },
        {
          name: 'Version Control',
          completed: false,
          courses: [
            { name: 'Git & GitHub Bootcamp', url: 'https://www.udemy.com/course/git-github-bootcamp', platform: 'Udemy' },
            { name: 'Advanced Git', url: 'https://www.atlassian.com/git/tutorials/advanced-overview', platform: 'Atlassian' }
          ],
          timeEstimate: '2-3 weeks'
        }
      ]
    },
    {
      level: 'Intermediate',
      skills: [
        {
          name: 'Docker & Containers',
          completed: false,
          courses: [
            { name: 'Docker Mastery', url: 'https://www.udemy.com/course/docker-mastery', platform: 'Udemy' },
            { name: 'Docker Documentation', url: 'https://docs.docker.com/get-started/', platform: 'Docker' }
          ],
          timeEstimate: '6-8 weeks'
        },
        {
          name: 'Kubernetes',
          completed: false,
          courses: [
            { name: 'Kubernetes Complete Course', url: 'https://www.udemy.com/course/kubernetes-complete', platform: 'Udemy' },
            { name: 'Kubernetes Basics', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', platform: 'Kubernetes' }
          ],
          timeEstimate: '8-10 weeks'
        },
        {
          name: 'CI/CD',
          completed: false,
          courses: [
            { name: 'Jenkins Complete Guide', url: 'https://www.udemy.com/course/jenkins-complete-guide', platform: 'Udemy' },
            { name: 'GitLab CI', url: 'https://docs.gitlab.com/ee/ci/', platform: 'GitLab' }
          ],
          timeEstimate: '4-6 weeks'
        }
      ]
    },
    {
      level: 'Advanced',
      skills: [
        {
          name: 'Infrastructure as Code',
          completed: false,
          courses: [
            { name: 'Terraform Certification', url: 'https://learn.hashicorp.com/terraform', platform: 'HashiCorp' },
            { name: 'Ansible for DevOps', url: 'https://www.udemy.com/course/ansible-for-devops', platform: 'Udemy' }
          ],
          timeEstimate: '8-10 weeks'
        },
        {
          name: 'Cloud Platforms',
          completed: false,
          courses: [
            { name: 'AWS DevOps Engineer', url: 'https://aws.amazon.com/certification/certified-devops-engineer-professional/', platform: 'AWS' },
            { name: 'Azure DevOps', url: 'https://docs.microsoft.com/en-us/learn/paths/azure-devops-devops-fundamentals/', platform: 'Microsoft' }
          ],
          timeEstimate: '12-16 weeks'
        },
        {
          name: 'Monitoring & Logging',
          completed: false,
          courses: [
            { name: 'Prometheus & Grafana', url: 'https://www.udemy.com/course/prometheus-grafana', platform: 'Udemy' },
            { name: 'ELK Stack', url: 'https://www.elastic.co/training', platform: 'Elastic' }
          ],
          timeEstimate: '6-8 weeks'
        }
      ]
    }
  ],
  
};

function RoadMap() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [skillsList, setSkillsList] = useState(skills[role] || []);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    const totalSkills = skillsList.reduce(
      (acc, level) => acc + level.skills.length,
      0
    );
    const completedSkills = skillsList.reduce(
      (acc, level) => acc + level.skills.filter(skill => skill.completed).length,
      0
    );
    setProgress((completedSkills / totalSkills) * 100);
  }, [skillsList]);

  const toggleSkill = (levelIndex, skillIndex) => {
    const newSkillsList = [...skillsList];
    newSkillsList[levelIndex].skills[skillIndex].completed = 
      !newSkillsList[levelIndex].skills[skillIndex].completed;
    setSkillsList(newSkillsList);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  if (!skills[role]) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Roadmap Not Found</h1>
        <p className="text-gray-600 mb-6">The requested career path roadmap does not exist.</p>
        <button
          onClick={() => navigate('/jobrole')}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          Go Back to Career Paths
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <motion.div
          className="flex items-center cursor-pointer mb-4"
          onClick={() => navigate('/jobrole')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-2 text-gray-700">Back to Career Paths</span>
        </motion.div>

        <motion.h1 
          className="text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Roadmap
        </motion.h1>

        <motion.div 
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-gray-700">Overall Progress</span>
              <span className="text-lg font-bold text-indigo-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-indigo-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="font-semibold text-green-700">Completed</div>
              <div className="text-green-600">{skillsList.reduce((acc, level) => acc + level.skills.filter(s => s.completed).length, 0)} skills</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="font-semibold text-yellow-700">In Progress</div>
              <div className="text-yellow-600">{skillsList.reduce((acc, level) => acc + level.skills.filter(s => !s.completed).length, 0)} skills</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="font-semibold text-blue-700">Total Time</div>
              <div className="text-blue-600">24-32 weeks</div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="space-y-12"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {skillsList.map((level, levelIndex) => (
          <motion.div
            key={level.level}
            variants={item}
            className="relative"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                {levelIndex + 1}
              </div>
              <h2 className="ml-4 text-2xl font-bold text-gray-900">{level.level}</h2>
            </div>
            
            <div className="ml-6 border-l-2 border-indigo-200 pl-6 space-y-6">
              {level.skills.map((skill, skillIndex) => (
                <motion.div
                  key={ skill.name}
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute -left-[2.2rem] top-4 w-4 h-4 rounded-full bg-white border-2 border-indigo-600" />
                  <div 
                    className={`bg-white rounded-xl shadow-md p-6 cursor-pointer ${
                      selectedSkill === `${levelIndex}-${skillIndex}` ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => setSelectedSkill(
                      selectedSkill === `${levelIndex}-${skillIndex}` ? null : `${levelIndex}-${skillIndex}`
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={skill.completed}
                          onChange={() => toggleSkill(levelIndex, skillIndex)}
                          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <h3 className={`ml-3 text-xl font-semibold ${
                          skill.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}>
                          {skill.name}
                        </h3>
                      </div>
                      <span className="text-sm text-gray-500">{skill.timeEstimate}</span>
                    </div>

                    {selectedSkill === `${levelIndex}-${skillIndex}` && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-100"
                      >
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Recommended Courses:</h4>
                        <div className="space-y-3">
                          {skill.courses.map((course, courseIndex) => (
                            <a
                              key={courseIndex}
                              href={course.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div>
                                <div className="font-medium text-indigo-600">{course.name}</div>
                                <div className="text-sm text-gray-500">{course.platform}</div>
                              </div>
                              <span className="text-indigo-600">→</span>
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default RoadMap;