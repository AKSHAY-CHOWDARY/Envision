import { Link } from 'react-router-dom';
import Navbar from '../components/interview/Navbar';

function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            AI Mock Interview Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Elevate your interview skills with our cutting-edge AI interviewer. Practice, learn, and confidently ace your next job interview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Voice Interaction",
              description: "Engage in natural conversations with our AI interviewer",
              icon: "🎙️"
            },
            {
              title: "Video Recording",
              description: "Analyze and improve your body language and presentation",
              icon: "🎥"
            },
            {
              title: "Instant Feedback",
              description: "Receive real-time performance insights and recommendations",
              icon: "📊"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Interview Preparation Checklist
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Ensure camera and microphone are working",
              "Find a quiet, well-lit environment",
              "Position yourself professionally",
              "Have resume ready for reference",
              "Check internet connection",
              "Dress professionally"
            ].map((tip, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/interview"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Begin Your Mock Interview
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;