import "./App.css";
import Navigation from "./components/Navigation.jsx";
import { Routes, Route } from "react-router";
import Landing from "./pages/Landing.jsx";
import Jobs from "./pages/Jobs.jsx";
import ChatBot from "./components/ChatBot.jsx";
import { SignedIn } from "@clerk/clerk-react";
import ProtectPage from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ResumeGenerator from "./pages/ResumeGenerator.jsx";
import JobSelection from './pages/JobSelection.jsx';
import Quiz from './pages/Quiz.jsx';
import JobTracker from "./pages/JobTracker.jsx";
import JobRoles from "./pages/JobRoles.jsx";
import RoadMap from "./pages/RoadMap.jsx";
import ATSResumeTracker from "./pages/ATSResumeTracker.jsx";
import ResumePage from "./pages/ResumePage.jsx";
function App() {
	return (
		<div>
			<Navigation/>
			<Routes> 
				<Route path="/" element={<Landing />} />
				<Route path="/jobs" element={<ProtectPage><Jobs /></ProtectPage>} />
				<Route path="/jobsTracker" element={<ProtectPage><JobTracker /></ProtectPage>} />
				<Route path="/dashboard" element={<ProtectPage><Dashboard /></ProtectPage>} />
				<Route path="/resume" element={<ProtectPage><ResumeGenerator /></ProtectPage>} />
				<Route path="/resumePage" element={<ResumePage />} />
				<Route path="/quiz" element={<ProtectPage><JobSelection/></ProtectPage>} />
				<Route path="/quiz/:roleId" element={<ProtectPage><Quiz /></ProtectPage>} />
				<Route path="/jobrole" element={<ProtectPage><JobRoles/></ProtectPage>} />
				<Route path="/jobrole/:role/roadmap" element={<RoadMap />} />
				<Route path="/ats" element={<ATSResumeTracker />} />
			</Routes>
			<SignedIn>
				<ChatBot/>
			</SignedIn>
		</div>
	);
}

export default App;
