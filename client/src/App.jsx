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

function App() {
	return (
		<div>
			<Navigation />
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/jobs" element={<ProtectPage><Jobs /></ProtectPage>} />
				<Route path="/dashboard" element={<ProtectPage><Dashboard /></ProtectPage>} />
				<Route path="/resume" element={<ProtectPage><ResumeGenerator /></ProtectPage>} />

			</Routes>
			<SignedIn>
				<ChatBot/>
			</SignedIn>
		</div>
	);
}

export default App;
