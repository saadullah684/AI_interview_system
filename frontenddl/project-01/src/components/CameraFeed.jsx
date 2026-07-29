import Webcam from "react-webcam";
import { useEffect, useRef } from "react";

export default function CameraStream({ setFrame }) {
  const webcamRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setFrame(imageSrc);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [setFrame]);

  return (
    <Webcam
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      width={320}
      height={240}
    />
  );
}