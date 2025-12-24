import React, { useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

function formatTime(sec = 0) {
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function VideoPlayer({ media }) {
  const videoTag = useRef(null);
  const [mute, setMute] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [timeState, setTimeState] = useState({ current: 0, duration: 0 });

  const handleClick = () => {
    const video = videoTag.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setShowOverlay(true);
    } else {
      video.play();
      setIsPlaying(true);
      setShowOverlay(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoTag.current;
    if (!video || !video.duration) return;
    const current = video.currentTime;
    const duration = video.duration;
    setTimeState({ current, duration });
  };

  useEffect(() => {
    const video = videoTag.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setIsPlaying(true);
          setShowOverlay(false);
        } else {
          video.pause();
          setIsPlaying(false);
          setShowOverlay(true);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  return (
    <div
      className={`
        relative w-full overflow-hidden rounded-3xl border shadow-sm
        bg-gray-50
        transition-all duration-300
        ${
          hovered
            ? "border-blue-400/80 shadow-[0_10px_30px_rgba(37,99,235,0.25)]"
            : "border-gray-200"
        }
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <video
        ref={videoTag}
        src={media}
        autoPlay
        loop
        muted={mute}
        playsInline
        className="w-full h-full max-h-[520px] object-cover cursor-pointer"
        onClick={handleClick}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Center play overlay */}
      {showOverlay && (
        <button
          type="button"
          onClick={handleClick}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
        >
          <div className="h-16 w-16 rounded-full bg-white/80 border border-white shadow-[0_10px_25px_rgba(15,23,42,0.25)] flex items-center justify-center backdrop-blur-sm">
            <span className="border-l-[16px] border-l-blue-600 border-y-[10px] border-y-transparent ml-1" />
          </div>
        </button>
      )}

      {/* Time pill (optional, you can also remove this if you want it cleaner) */}
      {timeState.duration > 0 && (
        <div className="absolute top-2 right-2 z-20 px-2 py-1 rounded-full bg-black/55 text-[11px] text-white font-medium backdrop-blur-sm">
          {formatTime(timeState.current)} / {formatTime(timeState.duration)}
        </div>
      )}

      {/* Mute toggle */}
      <button
        type="button"
        onClick={() => setMute((prev) => !prev)}
        className="absolute bottom-3 right-3 flex items-center justify-center cursor-pointer bg-black/45 rounded-full p-1.5 backdrop-blur-sm"
      >
        {mute ? (
          <FiVolumeX className="w-5 h-5 text-white" />
        ) : (
          <FiVolume2 className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
}

export default VideoPlayer;
