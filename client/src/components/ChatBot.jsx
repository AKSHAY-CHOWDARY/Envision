import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Minimize2, Bot } from 'lucide-react';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {useUser} from'@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import Markdown from 'react-markdown';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi there! 👋 Welcome to Envision your personalized career empowerment platform! 🚀 Whether you're looking for your dream job, upgrading your skills, or preparing for an interview, I'm here to help. How can I assist you today? 😊",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const userObj = useUser();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  const suggestions = [
    "What services do you offer?",
    "How can I get started?",
    "Tell me about pricing",
    "Can you help with technical issues?"
  ];
  
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    maxOutputTokens: 500,
    apiKey: API_KEY,
  });

 
  const handleSend = async () => {
    if (inputText.trim()) {
      setMessages(prev => [...prev, {
        text: inputText,
        sender: 'user',
        timestamp: new Date()
      }]);
      
      const userMessage = inputText.trim();
      setInputText('');
      setIsTyping(true);

      const promptTemplate = `You are an intelligent and helpful assistant for Envision, a comprehensive AI-powered platform designed to help users achieve their career goals through personalized job matching, skill gap analysis, tailored learning pathways, and more.

      Your goal is to:
      
      Stay Focused: Answer user queries only from the perspective of Envision's features and benefits. Do not provide unrelated information.
      
      Educate the User: Explain how each feature of the platform works, how it benefits the user, and how they can use it effectively.
      
      Promote Usability: If a query involves career growth, skill-building, job search, resume building, or interview preparation, show how the platform solves their problem.
      
      Be Specific: Use the following information as the foundation for all responses:
      
      AI-Powered Job Matching & Training Suggestions: Helps users find jobs and training tailored to their skills and preferences.
      Skill Gap Diagnostics & Tailored Learning: Assesses user weaknesses and provides targeted learning resources.
      Adaptive Learning Pathways: Provides step-by-step learning plans personalized to user goals.
      Real-Time Job Market Insights: Keeps users updated on trending skills and opportunities.
      Skills Verification & Certifications: Helps users earn and showcase certifications.
      AI-Powered Resume Builder: Simplifies the creation of ATS-friendly resumes.
      Community Forum & Virtual Events: Facilitates networking, knowledge sharing, and participation in workshops.
      Smart Interview Prep Assistant: Prepares users with role-specific questions and AI feedback.
      Gamified Skill Assessments: Makes learning interactive with quizzes and challenges.
      Personalized Learning AI Tutor: Offers a fully tailored study plan to achieve goals.
      End with a Call to Action: Conclude responses with a suggestion to explore or use the relevant platform feature for further assistance.
      
      When responding, always provide clear, concise, and platform-aligned answers. Begin every response with a reference to Envision and guide the user step-by-step on how to utilize the platform to address their query.
      
      For example:
      
      If asked, 'How can I improve my skills?' your response should explain the 'Skill Gap Diagnostics' and 'Adaptive Learning Pathways' features.
      If asked, 'How do I prepare for an interview?' mention the 'Smart Interview Prep Assistant' and its benefits.
      At the end of every query, include something like: 'I recommend exploring [Feature Name] on Envision to achieve this effectively.'
      
      Stick to these principles to ensure your answers remain consistent and aligned with Envision's purpose. Remember, your goal is to guide users to the platform's features and help them achieve their career goals effectively.
      
      USER QUERY: ${userMessage}
      `;
        
      
      try {
        const res = await model.invoke(promptTemplate);
        const botResponse = res.content
        
        setMessages(prev => [...prev, {
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        }]);
      } catch (error) {
        console.error("API call error:", error);
        setMessages(prev => [...prev, {
          text: "Oops! Something went wrong. Please try again.",
          sender: 'bot',
          timestamp: new Date()
        }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
  };

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center gap-2 
            hover:p-5">
          <MessageCircle className="h-6 w-6" />
          <span className="text-sm font-medium">Chat with us</span>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl w-[380px] h-[600px] flex flex-col">
          <div className="bg-indigo-600 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-white" />
              <h3 className="text-white font-medium">EnviBot</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-indigo-200"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
          </div>

          <div id="chat-container" className="flex-1 overflow-y-auto p-4 space-y-4">
  {messages.map((message, index) => (
    <div
      key={index}
      className={`flex items-start ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.sender === 'bot' && (
        <div className="flex-shrink-0">
          <Bot className="h-8 w-8 text-indigo-600" />
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow ${
          message.sender === 'user'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-800'
        } ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'} `}
      >
        <p><Markdown>{message.text}</Markdown></p>
        <div
          className={`text-xs mt-2 ${
            message.sender === 'user'
              ? 'text-indigo-300'
              : 'text-gray-500'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
      {message.sender === 'user' && (
        <div className="flex-shrink-0">
          <img src={userObj.hasImage?userObj.imageUrl:`https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ycnZ4a1N4Z1A2VVBTTUttRmZGOG40YUFyRW0iLCJyaWQiOiJ1c2VyXzJzNzgwTFRPVzRVR0NJVUNwYUNRTjU0NnlBdSJ9&w=64&q=75`} alt="U" className="h-8 w-8 rounded-full" />
        </div>
      )}
    </div>
  ))}
  {isTyping && (
    <div className="flex justify-start items-center gap-2">
      <Bot className="h-8 w-8 text-indigo-600" />
      <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 max-w-[75%] shadow">
        AI is typing...
      </div>
    </div>
  )}
</div>


          <div className="p-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-indigo-600"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                className={`text-indigo-600 hover:text-indigo-700 ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isTyping}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
