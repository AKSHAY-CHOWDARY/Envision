import React from 'react';
import {
  Brain,
  Target,
  BookOpen,
  TrendingUp,
  FileText,
  ChevronRight,
  Star,
  Linkedin,
  Twitter,
  Facebook
} from 'lucide-react';
import { useNavigate } from 'react-router';
function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="p-6 bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
      <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function TestimonialCard({ name, role, quote, image }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700">
      <div className="flex items-center mb-4">
        <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover mr-4" />
        <div>
          <h4 className="font-bold text-white">{name}</h4>
          <p className="text-gray-400 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-gray-300 italic">"{quote}"</p>
    </div>
  );
}

function Landing() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900">
      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Empower Your Career with AI-Driven Insights
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Transform your professional journey with personalized AI guidance, skill development, and job matching.
            </p>
            <button onClick={()=>navigate('/jobs')} className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center group">
              Get Started Free
              <ChevronRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
              alt="AI Career Platform"
              className="rounded-xl shadow-2xl ring-1 ring-gray-700"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-gray-900/50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Powerful Features to Accelerate Your Career</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Brain}
              title="AI Job Matching"
              description="Get personalized job recommendations based on your skills and preferences"
            />
            <FeatureCard
              icon={Target}
              title="Skill Gap Analysis"
              description="Identify and bridge crucial skill gaps for your dream role"
            />
            <FeatureCard
              icon={BookOpen}
              title="Learning Pathways"
              description="Access customized learning resources and certification tracks"
            />
            <FeatureCard
  icon={FileText}
  title="Smart Resume Builder"
  description="Create ATS-optimized resumes with AI-powered suggestions"
/>
<button onClick={() => navigate('/resume')} className="mt-4 text-indigo-400 hover:underline">
  Try Resume Builder
</button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-indigo-600/20">
                  {step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {step === 1 && "Create Profile"}
                  {step === 2 && "Get Matched"}
                  {step === 3 && "Learn & Grow"}
                  {step === 4 && "Succeed"}
                </h3>
                <p className="text-gray-400">
                  {step === 1 && "Set up your professional profile"}
                  {step === 2 && "Receive tailored job matches"}
                  {step === 3 && "Access personalized learning"}
                  {step === 4 && "Achieve your career goals"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-900/50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Software Engineer"
              quote="The AI-powered platform helped me identify and acquire the exact skills I needed to transition into tech."
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
            />
            <TestimonialCard
              name="Michael Chen"
              role="Data Analyst"
              quote="The personalized learning pathways were game-changing for my career progression."
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="Product Manager"
              quote="Thanks to the AI job matching, I found my dream role at a top tech company."
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-12 text-center border border-indigo-700">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Your Career Journey Today
            </h2>
            <p className="text-indigo-200 text-xl mb-8">
              Join thousands of professionals who've accelerated their careers with our AI-powered platform
            </p>
            <button className="bg-white text-indigo-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors">
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">CareerAI</h3>
              <p className="text-gray-400">Empowering careers through AI innovation</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><Linkedin className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><Twitter className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><Facebook className="w-6 h-6" /></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
