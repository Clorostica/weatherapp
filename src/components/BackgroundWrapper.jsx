import { useRef, useEffect } from "react";

import hotVideo    from "../videos/Hot.mp4";
import clearVideo  from "../videos/Clear.mp4";
import sunVideo    from "../videos/sun.mp4";
import cloudyVideo from "../videos/cloudy.mp4";
import rainyVideo  from "../videos/Rain.mp4";
import stormyVideo from "../videos/storm.mp4";
import snowyVideo  from "../videos/snow.mp4";
import fogVideo    from "../videos/fog.mp4";
import nightVideo  from "../videos/Night.mp4";

const videoSources = {
  hot:    hotVideo,
  sunny:  clearVideo,
  sun:    sunVideo,
  cloudy: cloudyVideo,
  rainy:  rainyVideo,
  stormy: stormyVideo,
  snowy:  snowyVideo,
  fog:    fogVideo,
  night:  nightVideo,
};

const BackgroundWrapper = ({ weatherType = "sunny", children }) => {
  const videoRef = useRef(null);
  const currentVideoSrcRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const condition = weatherType || "sunny";
    const videoSrc = videoSources[condition] || videoSources.sunny;

    if (currentVideoSrcRef.current === videoSrc) return;
    currentVideoSrcRef.current = videoSrc;

    video.pause();
    video.src = videoSrc;
    video.load();
    video.play().catch((error) => {
      if (error.name !== "AbortError" && error.name !== "NotAllowedError") {
        console.error("Error reproduciendo video:", error);
      }
    });
  }, [weatherType]);

  return (
    <div className="bg-wrapper" style={{ width: "100%", minHeight: "100vh" }}>
      <div className="bg-overlay" />
      <video
        ref={videoRef}
        className="fixed -z-10"
        style={{
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          objectPosition: "center center",
          minWidth: "100%",
          minHeight: "100%",
        }}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div style={{ width: "100%", position: "relative" }}>{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
