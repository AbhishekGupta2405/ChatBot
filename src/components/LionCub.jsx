import React, { useRef, useEffect, useCallback } from "react";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import video3 from "../assets/video3.mp4";
import { useLanguage } from './LanguageContext';

const LionCub = ({ 
  currentVideo, 
  setCurrentVideo, 
  setHasPlayedIntro, 
  hasPlayedIntro,
  isSpeaking,
  isListening,
  isProcessing,
  onToggleListening,
  onStopSpeaking,
  cornerMode = false 
}) => {
  const { t } = useLanguage();
  const videoRef = useRef(null);

  const handleVideoEnd = useCallback(() => {
    console.log("Video ended:", currentVideo);
    if (currentVideo === "video1") {
      console.log("Intro video ended, switching to idle");
      setHasPlayedIntro(true);
      setCurrentVideo("video2");
    }
  }, [currentVideo, setCurrentVideo, setHasPlayedIntro]);

  // Load and play appropriate video
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      let videoSource;
      switch (currentVideo) {
        case "video1":
          videoSource = video1;
          break;
        case "video2":
          videoSource = video2;
          break;
        case "video3":
          videoSource = video3;
          break;
        default:
          videoSource = video1;
      }

      if (video.src !== videoSource) {
        video.src = videoSource;

        if (currentVideo === "video2" || currentVideo === "video3") {
          video.loop = true;
        } else {
          video.loop = false;
        }

        video.play().catch((e) => console.error("Video play error:", e));
      }
    }
  }, [currentVideo]);

  // Preload all videos
  useEffect(() => {
    [video1, video2, video3].forEach((videoSrc) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = videoSrc;
      document.head.appendChild(link);
    });
  }, []);

  const containerClass = cornerMode 
    ? "lion-video-container-corner" 
    : "lion-video-container-left";

  return (
    <div className={containerClass}>
      <div className="video-wrapper">
        <div className="video-container">
          {["video1", "video2", "video3"].map((video) => (
            <video
              key={video}
              ref={video === currentVideo ? videoRef : null}
              className={video === currentVideo ? "active" : ""}
              autoPlay
              muted
              loop={video !== "video1"}
              playsInline
              onEnded={video === "video1" ? handleVideoEnd : undefined}
              onError={(e) => console.error("Video error:", video, e)}
            >
              <source
                src={
                  video === "video1"
                    ? video1
                    : video === "video2"
                    ? video2
                    : video3
                }
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ))}
        </div>
      </div>

      <div className="controls">
        <button
          className={`mic-button ${isListening ? "listening" : ""}`}
          onClick={onToggleListening}
          disabled={isProcessing || isSpeaking}
        >
          {isListening ? t.stopListening : t.startListening}
        </button>

        <button
          className="stop-button"
          onClick={onStopSpeaking}
          disabled={!isSpeaking}
        >
          {t.stop}
        </button>
      </div>
    </div>
  );
};

export default LionCub;