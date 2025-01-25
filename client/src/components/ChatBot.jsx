import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Minimize2, Bot } from 'lucide-react';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
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
    maxOutputTokens: 1048,
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
      
      try {
        const res = await model.invoke(userMessage);
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
          className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="text-sm font-medium">Chat with us</span>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl w-[380px] h-[600px] flex flex-col">
          <div className="bg-indigo-600 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-white" />
              <h3 className="text-white font-medium">AI Assistant</h3>
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
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {message.text}
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">AI is typing...</div>
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
