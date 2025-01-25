import {
    AcademicCapIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon
  } from '@heroicons/react/24/outline';
  import { motion } from 'framer-motion';
  import StatCard from '../components/StatCard';
  import SkillGapChart from '../components/SkillGapChart';
  import PerformanceTrends from '../components/PerformanceTrends';
  import SubjectAnalysis from '../components/SubjectAnalysis';
  
  function App() {
    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <div className="flex items-center justify-between mb-8">
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Skill Gap Analysis
            </motion.h1>
            <motion.div 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Last updated: {new Date().toLocaleDateString()}
            </motion.div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Tests Taken"
              value="42"
              icon={AcademicCapIcon}
              trend="+5 this month"
              color="blue"
            />
            <StatCard
              title="Average Score"
              value="85%"
              icon={ChartBarIcon}
              trend="+2.5% vs last month"
              color="green"
            />
            <StatCard
              title="Accuracy Rate"
              value="78%"
              icon={CheckCircleIcon}
              trend="+1.2% improvement"
              color="purple"
            />
            <StatCard
              title="Improvement"
              value="+12%"
              icon={ArrowTrendingUpIcon}
              trend="Consistently rising"
              color="indigo"
            />
          </div>
  
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div 
              className="chart-container"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <SkillGapChart />
            </motion.div>
            <motion.div 
              className="chart-container"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <PerformanceTrends />
            </motion.div>
          </div>
  
          {/* Subject Analysis */}
          <motion.div 
            className="mb-8 chart-container"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <SubjectAnalysis />
          </motion.div>
        </motion.div>
      </div>
    );
  }
  
  export default App;