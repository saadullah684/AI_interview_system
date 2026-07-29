import { useState } from "react";
import { startInterview } from "../services/api";

export default function Home({ setSession }) {
  const [resume, setResume] = useState("");

  const handleStart = async () => {
    const res = await startInterview(resume);
    setSession(res);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>🎤 AI Interview System</h1>

      <textarea
        rows="8"
        cols="50"
        placeholder="Paste Resume..."
        onChange={(e) => setResume(e.target.value)}
      />

      <br />

      <button onClick={handleStart}>
        Start Interview
      </button>
    </div>
  );
}