import { useEffect, useState } from "react";
import CameraStream from "../components/CameraFeed";
import MicStream from "../components/MicRecorder";
import QuestionBox from "../components/QuestionBox";
import {
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer
} from "recharts";

export default function Interview() {
  const [session, setSession] = useState(null);
  const [question, setQuestion] = useState("Welcome! Loading your custom workspace profile context...");
  const [frame, setFrame] = useState("");
  const [audio, setAudio] = useState(null); 
  const [micOn, setMicOn] = useState(true);
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentScore, setCurrentScore] = useState(0.0);

  useEffect(() => {
    const s = localStorage.getItem("session");
    if (s) {
      const parsed = JSON.parse(s);
      setSession(parsed);
      if (parsed.question) setQuestion(parsed.question);
      if (parsed.current_score) setCurrentScore(parsed.current_score);
    }
    if (!localStorage.getItem("interview_progress")) {
      localStorage.setItem("interview_progress", "0");
    }
  }, []);

  const nextQuestion = async () => {
    if (loading) return; 
    setLoading(true);
    
    try {
      const formData = new FormData();
      let compiledBlob = null;
      let zeroAudioScore = false;

      if (window.latestAudioChunks && window.latestAudioChunks.length > 0) {
        compiledBlob = new Blob(window.latestAudioChunks, { type: "audio/webm;codecs=opus" });
      } else if (audio && audio.blob instanceof Blob) {
        compiledBlob = audio.blob;
      } else if (audio instanceof Blob) {
        compiledBlob = audio;
      }

      if (!compiledBlob || compiledBlob.size <= 10) {
        zeroAudioScore = true;
      }

      let finalAudioFile;
      if (!zeroAudioScore && compiledBlob) {
        finalAudioFile = new File([compiledBlob], "interview_audio.webm", {
          type: "audio/webm",
        });
      } else {
        const dummyBuffer = new Uint8Array(100);
        finalAudioFile = new File([dummyBuffer], "interview_audio.webm", {
          type: "audio/webm",
        });
      }

      formData.append("audio_file", finalAudioFile);
      formData.append("context", session?.context || "General Engineering Interview");
      formData.append("previous_score", currentScore.toString());
      formData.append("emotion", "Neutral");
      formData.append("posture", "Good");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch("http://127.0.0.1:8000/start", {
        method: "POST",
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server returned HTTP state: ${res.status}`);
      }

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.warn("Could not parse JSON response body.", jsonErr);
      }
      
      if (zeroAudioScore) {
        data.dashboard_score = currentScore; 
        data.status = "Unsuccessful";
        data.transcription = "[System: Low input signal / restricted noise profile captured]";
        data.next_question = data.next_question || "Background sound detected instead of an answer. Please try answering again.";
        data.cnn_emotion = "Unknown";
        data.cnn_confidence = 0;
        data.posture_result = "Restricted";
        data.audio_confidence = 0;
        data.ai_confidence = 0;
      }

      if (data?.next_question) {
        setQuestion(data.next_question);
      }

      setResults(data);

      if (data?.dashboard_score !== undefined) {
        setCurrentScore(data.dashboard_score);
      }

      const newHistoryItem = {
        index: history.length + 1,
        score: data?.dashboard_score !== undefined ? data.dashboard_score : currentScore,
        transcription: data?.transcription || "No text audio parsed.",
        status: data?.status || "Unsuccessful"
      };

      const updatedHistory = [...history, newHistoryItem];
      setHistory(updatedHistory);
      localStorage.setItem("results", JSON.stringify(updatedHistory));

      window.latestAudioChunks = [];
      setAudio(null);

      if (data?.status === "Success") {
        const nextProgress = progress + 15;
        if (nextProgress >= 100) {
          setProgress(100);
          localStorage.setItem("interview_progress", "100");
          localStorage.setItem("interview_completed_status", "true");
          localStorage.removeItem("session");
          window.location.href = "/dashboard";
        } else {
          setProgress(nextProgress);
          localStorage.setItem("interview_progress", nextProgress.toString());
        }
      }

    } catch (err) {
      console.error("Session network processing log:", err);
      if (err.name === 'AbortError') {
        alert("The AI engine took longer than 45s to respond. Please check your main.py terminal logs.");
      } else {
        alert(`Frontend parse notice: ${err.message || "Check network/console properties"}`);
      }
    } finally {
      setLoading(false); 
    }
  };

  const endSession = () => {
    localStorage.setItem("interview_progress", progress.toString());
    if (progress < 100) {
      localStorage.setItem("interview_completed_status", "false");
    }
    localStorage.removeItem("session");
    window.location.href = "/dashboard";
  };

  const chartData = [
    { name: "Current Progress Score", value: currentScore }
  ];

  return (
    <div className="min-h-screen bg-[#F4F9F9] text-[#1A1A1A] font-sans antialiased flex flex-col justify-between">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#085FF7] font-black text-2xl tracking-tight flex items-center">
              iP<span className="text-[#1A1A1A] text-lg font-bold ml-1 tracking-normal">Interview Pro</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live AI Proctor Evaluation
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#085FF7]">Assessment Target</span>
              <h2 className="text-xl font-bold text-gray-900">Active Question Prompt</h2>
            </div>
            
            <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-1">
              <QuestionBox question={question} />
            </div>

            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800 aspect-video shadow-inner group">
                <CameraStream setFrame={setFrame} />
                <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-md text-xs font-mono text-white backdrop-blur-sm">
                  CAM_01_FEED
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${micOn ? 'bg-blue-50 text-[#085FF7]' : 'bg-rose-50 text-rose-600'}`}>
                    {micOn ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 0 3-3v-6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m0 0L18.364 18.364" /></svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Audio Stream Channel</p>
                    <p className="text-xs text-gray-400 font-mono">{micOn ? "Active pipeline recording" : "Hardware interface muted"}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMicOn(!micOn)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                    micOn 
                      ? 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50' 
                      : 'border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100'
                  }`}
                >
                  {micOn ? "Mute Mic" : "Enable Mic"}
                </button>
              </div>

              {micOn && (
                <MicStream setAudio={setAudio} />
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Session Matrix Progression</span>
                <span>{progress}% Complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200/50">
                <div 
                  className="h-full bg-gradient-to-r from-[#085FF7] to-[#2557a7] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                onClick={nextQuestion}
                disabled={loading}
                className="w-full bg-[#2557a7] text-white font-bold text-[15px] py-3.5 rounded-xl shadow-md hover:bg-[#1c4280] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? "Invoking Live AI Engine..." : "Next Question"}
              </button>

              <button
                onClick={endSession}
                className="w-full bg-white border border-gray-200 text-gray-700 font-bold text-sm py-3 rounded-xl hover:bg-gray-50 transition-all text-center"
              >
                End Session
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div id="report-area" className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-8" style={{ minHeight: '100%' }}>
            <div className="border-b border-gray-100 pb-6 flex justify-between items-start">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Evaluation Snapshot</h3>
                <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">AI Metric Performance Record</h2>
              </div>
              <div className="text-right font-mono text-xs text-gray-400">
                <p>REF: {session?.session_id ? session.session_id.substring(0, 8).toUpperCase() : "N/A"}</p>
                <p>DATE: 2026-06-22</p>
              </div>
            </div>

            {results && (
              <div className="space-y-6">
                <div className={`p-4 rounded-xl border ${
                  results?.status === "Success" 
                    ? "border-emerald-100 bg-emerald-50/50 text-emerald-800" 
                    : "border-rose-100 bg-rose-50/50 text-rose-800"
                }`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Latest Engine Feedback status:</h4>
                  <p className="text-sm font-bold">{results?.status || "Unsuccessful"}</p>
                  {results?.transcription && (
                    <p className="text-xs text-gray-600 mt-2 italic">" {results.transcription} "</p>
                  )}
                </div>

                {/* --- CONVERTED GRID LABELS TO 3-COLUMN METRICS WITH SPEECH MATCH --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4 space-y-1 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CNN Emotion Classification</span>
                    <p className="text-base font-bold text-gray-800 flex items-center justify-between">
                      <span>{results?.cnn_emotion || "Neutral"}</span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                        {results?.cnn_confidence || 0}% Conf
                      </span>
                    </p>
                  </div>

                  <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4 space-y-1 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Audio Transcription Match</span>
                    <p className="text-base font-bold text-gray-800 flex items-center justify-between">
                      <span>Speech Accuracy</span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded">
                        {results?.audio_confidence !== undefined ? results.audio_confidence : 0}% Conf
                      </span>
                    </p>
                  </div>

                  <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4 space-y-1 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Proctor Posture Monitor</span>
                    <p className="text-base font-bold text-gray-800 flex items-center justify-between">
                      <span>{results?.posture_result || "Good Position"}</span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">
                        {results?.ai_confidence || 0}% Acc
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#085FF7]"></span>
                    Live Dashboard Score Metrics
                  </h4>
                  <div className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-4 pt-6">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#F3F4F6' }} />
                        <Bar dataKey="value" fill="#085FF7" radius={[6, 6, 0, 0]} barSize={45} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {!results && (
              <div className="py-24 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 border border-gray-100 text-gray-300 rounded-full flex items-center justify-center mx-auto text-2xl">📊</div>
                <div className="max-w-sm mx-auto space-y-1">
                  <h4 className="font-bold text-gray-700">Telemetry Data Awaiting Initialization</h4>
                  <p className="text-sm text-gray-400">Respond to the active prompt using your mic and click "Next Question" to render diagnostic metrics.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}