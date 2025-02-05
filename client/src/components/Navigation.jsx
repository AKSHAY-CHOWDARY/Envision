import React, { useState } from 'react';
import { useUser, SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { CircuitBoard, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router';

function Navigation() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showJobsDropdown, setShowJobsDropdown] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Roadmaps', path: '/jobrole' },
    { 
      label: 'Jobs',
      dropdownItems: [
        { label: 'Job Tracker', path: '/jobsTracker' },
        { label: 'Resume Tracker', path: '/ats' },
        { label: 'Mock Interview', path: '/home' },
        { label: 'Jobs', path: '/jobs' }
      ]
    },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Quiz', path: '/jobselection' },
  ];

  return (
    <>
      <div className="bg-[#160637] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(140,100,220,0.3),rgba(255,255,255,0))] fixed top-0 w-full z-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <SignedOut>
            <div className="flex justify-end space-x-3 ">
              <button className="font-semibold px-4 bg-indigo-200 hover:bg-indigo-400 hover:text-indigo-950 hover:pt-1 rounded-md py-2"><SignInButton/></button>
              <button className="font-semibold px-4 bg-indigo-200  hover:bg-indigo-400 hover:text-indigo-950 hover:pt-1 rounded-md py-2"><SignUpButton/></button>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex justify-between items-center">
              <p className="font-bold text-3xl cursor-pointer text-white">Envision</p>

              {/* Mobile menu button */}
              <button 
                className="md:hidden text-white"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => (
                  <div key={item.label} className="relative group">
                    {item.dropdownItems ? (
                      <div 
                        className="font-semibold text-white text-lg cursor-pointer hover:text-indigo-200"
                        onClick={() => setShowJobsDropdown(!showJobsDropdown)}
                      >
                        {item.label}
                        {showJobsDropdown && (
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                            {item.dropdownItems.map((dropdownItem) => (
                              <button
                                key={dropdownItem.path}
                                onClick={() => navigate(dropdownItem.path)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                              >
                                {dropdownItem.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => navigate(item.path)}
                        className="font-semibold text-white text-lg cursor-pointer hover:text-indigo-200"
                      >
                        {item.label}
                      </button>
                    )}
                  </div>
                ))}
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9 rounded-full border-2 border-white/20'
                    }
                  }}
                />
              </div>

              {/* Mobile Navigation */}
              {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#160637]  py-4 px-4 ">
                  {navItems.map((item) => (
                    <div key={item.label} className="py-2">
                      {item.dropdownItems ? (
                        <>
                          <button
                            onClick={() => setShowJobsDropdown(!showJobsDropdown)}
                            className="font-semibold text-white text-lg w-full text-left"
                          >
                            {item.label}
                          </button>
                          {showJobsDropdown && (
                            <div className="pl-4 mt-2 space-y-2">
                              {item.dropdownItems.map((dropdownItem) => (
                                <button
                                  key={dropdownItem.path}
                                  onClick={() => {
                                    navigate(dropdownItem.path);
                                    setIsOpen(false);
                                  }}
                                  className="block text-white/80 hover:text-white text-sm py-1"
                                >
                                  {dropdownItem.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            navigate(item.path);
                            setIsOpen(false);
                          }}
                          className="font-semibold text-white text-lg w-full text-left"
                        >
                          {item.label}
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="pt-4">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: 'w-9 h-9 rounded-full border-2 border-white/20'
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </SignedIn>
        </div>
      </div>
 
    </>
  );
}

export default Navigation;