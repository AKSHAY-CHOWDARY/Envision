import { motion } from 'framer-motion';

const colors = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  indigo: 'from-indigo-500 to-indigo-600'
};

const StatCard = ({ title, value, trend, icon: Icon, color = 'blue' }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-effect rounded-xl p-6 stat-card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${colors[color]} bg-opacity-10`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`text-sm font-medium bg-gradient-to-r ${colors[color]} text-transparent bg-clip-text`}>
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;