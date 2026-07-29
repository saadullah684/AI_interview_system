import { useEffect, useRef, useState } from "react";

export default function MicStream({ setAudio }) {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // 1. CLEAR existing cache ONLY at the start of a brand new question mount
    window.latestAudioChunks = [];
    chunksRef.current = []; // Ensure internal ref is empty too

    async function initMicrophone() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const options = { mimeType: "audio/webm;codecs=opus" };
        const recorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunksRef.current.push(e.data);
            
            // 2. FIXED: Use a shallow copy slice array assignment so it doesn't break by reference clear-out
            window.latestAudioChunks = [...chunksRef.current];

            const progressiveBlob = new Blob(chunksRef.current, { type: "audio/webm" });
            progressiveBlob.blob = progressiveBlob;
            setAudio(progressiveBlob);
          }
        };

        recorder.start(250);
        setIsRecording(true);
      } catch (err) {
        console.error("Hardware pipeline failed to mount microphone:", err);
      }
    }

    initMicrophone();

    return () => {
      // 3. FIXED: Stop recording cleanly, let it push its final chunk safely
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      // REMOVED: window.latestAudioChunks = []; from here! 
      // Wiping it out right here was discarding your audio data right before fetch sent it.
    };
  }, [setAudio]);

  return (
    <div className="flex items-center gap-2 mt-2 px-1">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <h4 className="text-xs font-semibold text-emerald-700 font-mono">
        {isRecording ? "🎤 Pipeline Connected & Encoding Speech..." : "Connecting Interface..."}
      </h4>
    </div>
  );
}