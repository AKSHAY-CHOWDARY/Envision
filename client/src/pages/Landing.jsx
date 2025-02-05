import React from 'react';
import {
  Brain,
  Sparkles,
  GraduationCap,
  Lightbulb,
  Notebook as Robot,
  ChevronRight,
  Code,
  LineChart,
  Rocket,
  Github,
  Twitter,
  Linkedin,
  FileText,
  ArrowRight,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router';
import {Link} from 'react-router-dom';
import resume from '../assets/resume.jpg'

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group relative p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:transform hover:scale-105">
      <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-500" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors duration-500">{title}</h3>
        <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-500">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
      <div className="relative p-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 group-hover:border-cyan-500/50 transition-all duration-500">
        <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-500">
          {number}
        </div>
        <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-500">{label}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ name, role, quote, image }) {
  return (
    <div className="group relative p-8">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
      <div className="relative bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 group-hover:border-cyan-500/50 transition-all duration-500 p-8">
        <div className="flex items-center mb-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full opacity-50 blur-sm" />
            <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover relative" />
          </div>
          <div className="ml-4">
            <h4 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-500">{name}</h4>
            <p className="text-slate-400">{role}</p>
          </div>
        </div>
        <div className="relative">
          <Star className="absolute -left-2 -top-2 w-6 h-6 text-cyan-500/20" />
          <p className="text-slate-300 italic leading-relaxed">{quote}</p>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-10 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
      <div className="relative p-8 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 group-hover:border-cyan-500/50 transition-all duration-500">
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
          <span className="text-xl font-bold text-white">{number}</span>
        </div>
        <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors duration-500">{title}</h3>
        <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-500">{description}</p>
      </div>
    </div>
  );
}

function Landing() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#020817] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      {/* Hero Section */}
      <header className="container mx-auto px-6 pt-24 pb-32 relat">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-3xl opacity-20 animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.3),transparent)] animate-pulse" />
        </div>
        <div className="relative ">
          <div className="text-center max-w-4xl mx-auto pt-5">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 mb-8 hover:border-cyan-500/50 transition-colors duration-500">
              <Sparkles className="w-4 h-4 text-cyan-400 mr-2 animate-pulse" />
              <span className="text-sm text-slate-300">The Future of Learning is Here</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-white"></span>
              <span className="relative">
                <span className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 blur-xl opacity-20" />
                <span className="relative bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"> EnVision </span>
              </span>
              <span className="text-white"> Greatness, Embrace the Journey!</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
              Experience personalized learning at its finest with our cutting-edge AI technology.
              Master new skills, track your progress, and achieve your educational goals faster than ever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={()=>navigate('/jobs')} className="group relative px-8 py-4 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-transform duration-500 group-hover:scale-105" />
                <div className="relative flex items-center text-white font-semibold">
                  Start Learning Now
                  <ChevronRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-500" />
                </div>
              </button>
              <button className="px-8 py-4 bg-slate-800/50 backdrop-blur-xl rounded-xl text-white font-semibold border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:bg-slate-800/70">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="50K+" label="Active Learners" />
            <StatCard number="5000+" label="Courses" />
            <StatCard number="95%" label="Success Rate" />
            <StatCard number="24/7" label="AI Support" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.08),transparent)]" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-white mb-6 relative">
              <span className="absolute -inset-1 opacity-20 " />
              <span className="relative">Revolutionary Learning Features</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Our platform combines cutting-edge AI technology with proven learning methodologies
              to deliver an unmatched educational experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/ats">
            <FeatureCard
              icon={Brain}
              title="AI Job Matching"
              description="Get personalized job recommendations based on your skills and preferences
"
            />
             </Link>
             <Link to="/dashboard">
            <FeatureCard
              icon={Robot}
              title="Skill Gap Analysis"
              description="Identify and bridge crucial skill gaps for your dream role"
            />
            </Link>
            <Link to="/jobrole">
            <FeatureCard
              icon={LineChart}
              title="Learning Pathways"
              description="Access customized learning resources and certification tracks"
            />
            </Link>
            <Link to="/resume">
            <FeatureCard
              icon={Code}
              title="Smart Resume builder"
              description="Create ATS-optimized resumes with AI-powered suggestions"
            />
            </Link>
            <Link to="/quiz">
            <FeatureCard
              icon={GraduationCap}
              title="Smart Assessments"
              description="Adaptive tests that evolve with your knowledge level"
            />
            </Link>
            <Link to="/home">
            <FeatureCard
              icon={Lightbulb}
              title="Mock Interviews"
              description="Sharpen your interview skills with customized mock sessions aligned with your career path."
            />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(120,119,198,0.15),transparent)]" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-white mb-6 relative">
              <span className="absolute -inset-1" />
              <span className="relative">How It Works</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Our AI-powered platform makes learning simple and effective
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Create Profile"
              description="Set up your personalized learning profile with AI-guided assistance"
            />
            <StepCard
              number="2"
              title="AI Analysis"
              description="Our AI analyzes your goals and creates a custom learning path"
            />
            <StepCard
              number="3"
              title="Start Learning"
              description="Access interactive courses and real-time AI tutoring"
            />
            <StepCard
              number="4"
              title="Track Progress"
              description="Monitor your growth with advanced analytics and insights"
            />
          </div>
        </div>
      </section>

      {/* Resume Builder Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 mb-8">
                <FileText className="w-4 h-4 text-cyan-400 mr-2" />
                <span className="text-sm text-slate-300">AI-Powered Resume Builder</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6 relative">
                <span className="absolute -inset-1" />
                <span className="relative">Create Your Perfect Resume</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Let our AI help you craft a professional resume that stands out. Our intelligent system analyzes your experience and suggests improvements in real-time.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "AI-powered content suggestions",
                  "Professional templates",
                  "Real-time formatting",
                  "ATS-friendly designs"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center mr-3">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/resume')} className="group relative px-8 py-4 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r cursor-pointer from-cyan-500 via-blue-500 to-purple-500 transition-transform duration-500 group-hover:scale-105" />
                <span className="relative text-white font-semibold">Build Your Resume</span>
              </button>
            </div>
            <div className="relative mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-20 w-[400px] blur-xl" />
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border w-[370px] border-slate-700/50 p-5 ">
                <img
                  src={resume}
                  alt="Resume Builder"
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.15),transparent)]" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-white mb-6 relative">
              <span className="absolute -inset-1" />
              <span className="relative">Success Stories</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Hear from our learners who have transformed their careers with our platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Chen"
              role="Software Engineer"
              quote="The AI-powered learning path helped me transition from marketing to software engineering in just 6 months. The personalized approach made all the difference."
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
            />
            <TestimonialCard
              name="Michael Rodriguez"
              role="Data Scientist"
              quote="The interactive courses and AI tutor were like having a personal mentor available 24/7. I went from beginner to landing my dream job."
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
            />
            <TestimonialCard
              name="Emily Patel"
              role="Product Manager"
              quote="The resume builder and career guidance features were game-changers. The AI suggestions helped me highlight my achievements perfectly."
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.3),transparent)]" />
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-20 blur-xl" />
            <div className="relative p-16 backdrop-blur-xl">
              <div className="text-center max-w-3xl mx-auto">
                <Rocket className="w-16 h-16 text-cyan-400 mx-auto mb-8" />
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Transform Your Learning Journey?
                </h2>
                <p className="text-slate-300 text-lg mb-8">
                  Join thousands of learners who are already experiencing the future of education.
                  Start your journey today with a free trial.
                </p>
                <button className="group relative px-8 py-4 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-transform duration-500 group-hover:scale-105" />
                  <span className="relative text-white font-semibold">Get Started Free</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="font-bold text-xl text-white mb-4">Envision</h3>
              <p className="text-slate-400">Transforming education through artificial intelligence</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">Courses</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-400">
            <p>&copy; 2024 Envision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;


         

      