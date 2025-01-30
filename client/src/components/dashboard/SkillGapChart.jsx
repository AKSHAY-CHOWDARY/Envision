import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import DashboardCard from './DashboardCard';

ChartJS.register(ArcElement, Tooltip, Legend);

const SkillGapChart = () => {
  const skillsData = {
    labels: [
      'Cloud-Based Infrastructure',
      'Cyber Security',
      'Integrating New Technologies',
      'Data Management/Analytics',
      'Digital Business Transformation',
      'Network Systems',
      'Generalist Digital Skills'
    ],
    datasets: [{
      data: [22, 35, 66, 74, 90, 15, 45],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(99, 102, 241, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(124, 58, 237, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      borderWidth: 2,
      borderColor: 'white'
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`
        }
      }
    },
    cutout: '65%',
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000
    }
  };

  return (
    <DashboardCard title="Skills Gap Analysis">
      <div className="h-[400px] flex items-center justify-center relative">
        <Doughnut data={skillsData} options={options} />
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">75%</div>
            <div className="text-sm text-gray-500">Overall Progress</div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default SkillGapChart;