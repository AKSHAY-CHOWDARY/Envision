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
import JobSelection from './components/JobSelection';
import Quiz from './components/Quiz';
import JobRoles from "./pages/JobRoles.jsx";
import RoadMap from "./pages/RoadMap.jsx";

function App() {
	return (
		<div>
			<Navigation/>
			<Routes> 
				<Route path="/" element={<Landing />} />
				<Route path="/jobs" element={<ProtectPage><Jobs /></ProtectPage>} />
				<Route path="/dashboard" element={<ProtectPage><Dashboard /></ProtectPage>} />
				<Route path="/resume" element={<ProtectPage><ResumeGenerator /></ProtectPage>} />
				<Route path="/quiz" element={<JobSelection />} />
				<Route path="/quiz/:roleId" element={<ProtectPage><Quiz /></ProtectPage>} />
				<Route path="/jobrole" element={<ProtectPage><JobRoles/></ProtectPage>} />
				<Route path="/jobrole/:role/roadmap" element={<RoadMap />} />
			</Routes>
			<SignedIn>
				<ChatBot/>
			</SignedIn>
		</div>
	);
}

export default App;
