import { useEffect, useState } from "react";
import {
	AcademicCapIcon,
	ChartBarIcon,
	CheckCircleIcon,
	ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import axios from "axios";
import StatCard from "../components/dashboard/StatCard";
import SkillGapChart from "../components/dashboard/SkillGapChart";
import PerformanceTrends from "../components/dashboard/PerformanceTrends";
import SubjectAnalysis from "../components/dashboard/SubjectAnalysis";
import { useUser } from "@clerk/clerk-react";
import Top5Courses from "../components/courses/Top5Courses";

function Dashboard() {
	const [stats, setStats] = useState({
		testsTaken: 0,
		averageScore: 0,
		accuracyRate: 0,
		improvement: 0,
		testsTakenThisMonth: 0,
	});

	const { user } = useUser();
	const userId = user?.id;
	const [testsData, setTestsData] = useState([]);
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/test-api/get-all-tests/${userId}`
				);
				const tests = response.data.tests || [];
				setTestsData(tests);

				if (tests.length > 0) {
					const totalTests = tests.length;
					const totalScore = tests.reduce(
						(acc, test) => acc + (test.score || 0),
						0
					);
					const totalAccuracy = tests.reduce((acc, test) => {
						return (
							acc +
							(test.quiz?.length
								? ((test.score ? test.score : 0) / test.quiz.length) * 100
								: 0)
						);
					}, 0);

					const currentMonth = new Date().getMonth();
					const testsThisMonth = tests.filter((test) => {
						const testMonth = new Date(test.date).getMonth();
						return testMonth === currentMonth;
					}).length;

					const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
					const lastMonthTests = tests.filter((test) => {
						const testMonth = new Date(test.date).getMonth();
						return testMonth === lastMonth;
					});

					const lastMonthScore = lastMonthTests.reduce(
						(acc, test) => acc + (test.score || 0),
						0
					);
					const lastMonthAverage = lastMonthTests.length
						? lastMonthScore / lastMonthTests.length
						: 0;
					const currentMonthAverage = totalTests ? totalScore / totalTests : 0;
					const improvement = lastMonthAverage
						? (
								((currentMonthAverage - lastMonthAverage) / lastMonthAverage) *
								100
						  ).toFixed(2)
						: 0;

					setStats({
						testsTaken: totalTests,
						averageScore: totalTests
							? (totalScore / totalTests).toFixed(2) * 100
							: 0,
						accuracyRate: totalTests
							? (totalAccuracy / totalTests).toFixed(2)
							: 0,
						improvement: improvement,
						testsTakenThisMonth: testsThisMonth,
					});

					// Identify low-scoring tests and extract skills
					const lowScoringSkills = tests
						.filter((test) => test.score < 50) // Assuming a score below 50 is considered low
						.flatMap((test) => test.quiz.map((q) => q.skill)); // Extract skills from each quiz item

					fetchCourses(lowScoringSkills);
				}
			} catch (error) {
				console.error("Error fetching test data:", error);
			}
		};

		const fetchCourses = async (skills) => {
			try {
				let response = await axios.post(
					"http://localhost:5000/user-api/recommend-courses",
					{ skills: skills }
				);
				if (response.data.message === "courses") {
					setCourses(response.data.payload);
				}
			} catch (err) {
				console.error("Error fetching courses", err);
			}
		};
		if (userId) {
			fetchStats();
		}
	}, [userId]);

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
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
						value={stats.testsTaken}
						icon={AcademicCapIcon}
						trend={`+${stats.testsTakenThisMonth} this month`}
						color="blue"
					/>
					<StatCard
						title="Average Score"
						value={`${stats.averageScore}%`}
						icon={ChartBarIcon}
						trend="+2.5% vs last month"
						color="green"
					/>
					<StatCard
						title="Accuracy Rate"
						value={`${stats.accuracyRate}%`}
						icon={CheckCircleIcon}
						trend="+1.2% improvement"
						color="purple"
					/>
					<StatCard
						title="Improvement"
						value={
							stats.improvement !== 0
								? `+${stats.improvement}%`
								: "No tests taken last month"
						}
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
						<PerformanceTrends data={testsData} />
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

				<Top5Courses courses={courses} />
			</motion.div>
		</div>
	);
}

export default Dashboard;
