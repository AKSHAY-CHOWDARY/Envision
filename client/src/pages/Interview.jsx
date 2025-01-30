import { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { analyzeAnswer, generateOverallFeedback } from '../utils/gemini';
import { generateInterviewPDF } from '../utils/pdfGenerator';

const mockQuestions = [
  "Tell me about yourself.",
  "What are your greatest strengths?",
  "Where do you see yourself in 5 years?",
  "Why should we hire you?",
  "What is your biggest weakness?"
];

function Interview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [hasWebcamPermission, setHasWebcamPermission] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyses, setAnalyses] = useState([]);
  const [overallFeedback, setOverallFeedback] = useState(null);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const webcamRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setTranscript(transcript);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    // Request permissions
    const requestPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasWebcamPermission(true);
        setHasMicPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Error getting permissions:', error);
      }
    };

    requestPermissions();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };
  }, [isListening]);

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    recognitionRef.current.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current.stop();
  };

  const speakQuestion = (question) => {
    const utterance = new SpeechSynthesisUtterance(question);
    synthRef.current.speak(utterance);
  };

  const handleNextQuestion = async () => {
    if (transcript.trim()) {
      const newAnswer = {
        question: mockQuestions[currentQuestion],
        answer: transcript
      };
      
      const analysis = await analyzeAnswer(newAnswer.question, newAnswer.answer);
      setAnalyses([...analyses, analysis]);
      
      setAnswers([...answers, newAnswer]);

      if (currentQuestion < mockQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTranscript('');
        setTimeout(() => {
          speakQuestion(mockQuestions[currentQuestion + 1]);
        }, 1000);
      } else {
        setIsFinished(true);
        analyzeInterview([...answers, newAnswer]);
      }
    }
  };

  const analyzeInterview = async (allAnswers) => {
    setIsAnalyzing(true);
    const feedback = await generateOverallFeedback(allAnswers);
    setOverallFeedback(feedback);
    setIsAnalyzing(false);
  };

  const handleDownloadPDF = () => {
    const pdf = generateInterviewPDF(answers, analyses, overallFeedback);
    pdf.save('interview-assessment.pdf');
  };

  const handleStartInterview = () => {
    speakQuestion(mockQuestions[currentQuestion]);
    startListening();
  };

  if (!hasWebcamPermission || !hasMicPermission) {
    return (
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Permission Required</h2>
          <p className="text-gray-600 mb-4">
            This interview requires access to your camera and microphone.
            Please allow access when prompted.
          </p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Interview Complete!</h2>
        
        {isAnalyzing ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">Analyzing your responses...</p>
          </div>
        ) : overallFeedback ? (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Overall Assessment</h3>
              <div className="mb-4">
                <p className="text-2xl font-bold text-blue-600">
                  Score: {overallFeedback.score}/100
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Key Strengths</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {overallFeedback.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-600">{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Areas for Improvement</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {overallFeedback.improvements.map((improvement, index) => (
                      <li key={index} className="text-gray-600">{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download Assessment PDF
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {answers.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-lg mb-2">Q: {item.question}</h3>
                  <p className="text-gray-600 mb-4">A: {item.answer}</p>
                  {analyses[index] && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-2">Analysis</h4>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Relevance</p>
                          <p className="text-lg font-semibold">{analyses[index].relevance}/10</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Clarity</p>
                          <p className="text-lg font-semibold">{analyses[index].clarity}/10</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Confidence</p>
                          <p className="text-lg font-semibold">{analyses[index].confidence}/10</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-red-600">Error analyzing responses. Please try again.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-8 mx-auto mb-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Question & Answer Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="mb-6">
            <span className="text-sm text-gray-500 tracking-wide">
              Question {currentQuestion + 1} of {mockQuestions.length}
            </span>
            <h2 className="text-2xl font-semibold mt-3 text-gray-900">
              {mockQuestions[currentQuestion]}
            </h2>
          </div>
          <div className="mb-5">
            <p className="text-gray-600 font-medium mb-2">Your Answer:</p>
            <div className="min-h-[120px] p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-gray-700">
              {transcript || "Waiting for your response..."}
            </div>
          </div>
          <div className="flex space-x-4">
            {!isListening ? (
              <button
                onClick={handleStartInterview}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md"
              >
                🎤 Start Speaking
              </button>
            ) : (
              <>
                <button
                  onClick={stopListening}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-md"
                >
                  ⏹ Stop Speaking
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-md"
                >
                  ⏭ Next Question
                </button>
              </>
            )}
          </div>
        </div>
  
        {/* Video Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center">
          <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden border border-gray-300 shadow-md">
            <Webcam ref={webcamRef} audio={false} mirrored={true} className="w-full" />
          </div>
          <p className="text-sm text-gray-500 text-center font-medium">
            🎥 Your video feed is active during the interview
          </p>
        </div>
      </div>
    </div>
  );
}
  

export default Interview