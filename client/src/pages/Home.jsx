import { Link } from 'react-router-dom';
import Navbar from '../components/interview/Navbar';

function Home() {
  return (
    <div>
      <Navbar />
    <div className="max-w-4xl mx-auto text-center">
      
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Interactive AI Mock Interview
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Practice interviews with our AI interviewer using voice and video.
        Get real-time feedback and improve your interview skills.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Voice Interaction</h3>
          <p className="text-gray-600">Speak naturally with our AI interviewer and get voice responses.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Video Recording</h3>
          <p className="text-gray-600">Practice your body language and presentation skills.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Instant Feedback</h3>
          <p className="text-gray-600">Get real-time transcription and review your performance.</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Before You Start</h2>
        <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
          <li>✓ Ensure your camera and microphone are working</li>
          <li>✓ Find a quiet environment for better voice recognition</li>
          <li>✓ Position yourself in good lighting for video</li>
          <li>✓ Have your resume ready for reference</li>
        </ul>
      </div>
      <Link
        to="/interview"
        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Start Video Interview
      </Link>
    </div>
    </div>
  );
}

export default Home;