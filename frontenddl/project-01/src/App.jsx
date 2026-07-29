import { BrowserRouter, Routes, Route, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import "./index.css";

import Interview from "./pages/Interview";
import Dashboard from "./pages/Dashboard";

function Home() {
  const [resume, setResume] = useState("");
  const navigate = useNavigate();

  const startInterview = async () => {
    try {
      // Create a clean initial session state with the resume context
      const initialSession = {
        session_id: "session_" + Math.random().toString(36).substring(2, 11),
        context: resume,
        question: "Welcome! Thank you for sharing your background. To kick things off, can you tell me a bit about yourself and your experience?",
        current_score: 0.0
      };
      
      // Save to localStorage for the Interview Room to read
      localStorage.setItem("session", JSON.stringify(initialSession));
      navigate("/interview");
    } catch (err) {
      console.error("Transmission Error:", err);
    }
  };

  const wordCount = resume.trim() ? resume.trim().split(/\s+/).length : 0;

  const interviewTips = [
    { text: "Research your potential employer", indent: "pl-0 sm:ml-0" },
    { text: "Review the job description", indent: "pl-4 sm:ml-8" },
    { text: "Practice answering interview questions", indent: "pl-0 sm:ml-16" },
    { text: "Understand the STAR method", indent: "pl-8 sm:ml-24" },
    { text: "Dress appropriately for your interview", indent: "pl-2 sm:ml-20" },
    { text: "Think about your questions in advance", indent: "pl-0 sm:ml-12" },
    { text: "Follow up after the interview", indent: "pl-6 sm:ml-28" }
  ];

  return (
    <div className="min-h-screen bg-[#F4F9F9] text-[#1A1A1A] font-sans antialiased flex flex-col justify-between">
      
      {/* 1. GLOBAL NAVIGATION HEADER */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2">
              <span className="text-[#085FF7] font-black text-2xl tracking-tight font-sans flex items-center">
                iP<span className="text-[#1A1A1A] text-lg font-bold ml-1 tracking-normal">Interview Pro</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-[15px] font-medium text-gray-600">
              <Link to="/" className="text-[#085FF7] border-b-2 border-[#085FF7] pb-1 font-semibold">Home</Link>
              <Link to="/interview" className="hover:text-gray-900 transition-colors">Interview Room</Link>
              <Link to="/dashboard" className="hover:text-gray-900 transition-colors">Performance Dashboard</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. SPLIT HERO COMPONENT HERO SECTION */}
      <main className="relative flex-grow">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8F1F5] via-[#EDF5F4] to-[#F4F9F9] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT CARD: ACTIONS & TEXT AREA INPUT */}
          <div className="lg:col-span-5 space-y-6 bg-white/95 p-8 rounded-2xl shadow-xl border border-gray-100">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] tracking-tight leading-[1.1]">
              ACE YOUR NEXT<br />
              <span className="text-[#2557a7]">INTERVIEW</span>
            </h1>
            <p className="text-[15px] text-gray-600 leading-relaxed font-normal">
              Career success is within your reach. Submit your resume text below to activate your comprehensive mock environment and receive dynamic real-time questions.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Paste Credentials / Resume Base
              </label>
              <textarea
                rows={6}
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your skills, experience, or raw resume transcript here to calibrate system questions..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#085FF7] focus:bg-white resize-none transition-all"
              />
              <div className="flex justify-between items-center text-xs text-gray-400 font-mono px-1">
                <span>Words: {wordCount}</span>
                <span>Chars: {resume.length}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={startInterview}
                disabled={!resume.trim()}
                className="w-full bg-[#2557a7] text-white font-bold text-[15px] px-6 py-3.5 rounded-lg shadow-sm hover:bg-[#1c4280] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-center block"
              >
                Start Interview
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT COLUMN */}
          <div className="lg:col-span-7 py-4">
            <div className="max-w-xl mx-auto lg:mr-0 space-y-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937] tracking-tight text-left font-sans pl-2">
                Tips to succeed in your next interview
              </h2>
              
              <div className="flex flex-col space-y-3 relative">
                {interviewTips.map((tip, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-4 transition-transform hover:translate-x-1 duration-150 ${tip.indent}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-[#1A332B] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-md">
                      {idx + 1}
                    </span>
                    <p className="text-[14px] font-semibold text-gray-700 tracking-wide bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 flex-grow sm:flex-grow-0">
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}