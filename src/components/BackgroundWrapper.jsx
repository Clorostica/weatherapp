import { useRef, useEffect } from "react";
import HotVideo from "../videos/Hot.mp4";
import ClearVideo from "../videos/Clear.mp4";
import CloudyVideo from "../videos/Clouds.mp4";
import RainyVideo from "../videos/Rain.mp4";
import StormyVideo from "../videos/Stormy.mp4";
import SnowyVideo from "../videos/Snowy.mp4";
import ColdVideo from "../videos/Cold.mp4";
import NightVideo from "../videos/Night.mp4";

const BackgroundWrapper = ({ weatherType, children }) => {
  const videoRef = useRef(null);

  const getVideoSrc = (condition) => {
    switch (condition) {
      case "hot":
        return HotVideo;
      case "sunny":
        return ClearVideo;
      case "cloudy":
        return CloudyVideo;
      case "rainy":
        return RainyVideo;
      case "stormy":
        return StormyVideo;
      case "snowy":
        return SnowyVideo;
      case "cold":
        return ColdVideo;
      case "night":
        return NightVideo;
      case "default":
        return ClearVideo;
      default:
        return ClearVideo;
    }
  };
  useEffect(() => {
    const video = videoRef.current;
    if (video && weatherType) {
      const videoSrc = getVideoSrc(weatherType);
      video.src = videoSrc;
      video.load();
      video.play().catch((error) => {
        console.log("Error reproduciendo video:", error);
      });
    }
  }, [weatherType]);

  const containerStyle = {
    position: "relative",
    minHeight: "100vh",
    padding: "40px",
    color: "white",
    overflow: "hidden",
  };

  const videoStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -1,
  };

  const contentStyle = {
    position: "relative",
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <video
        ref={videoRef}
        style={videoStyle}
        autoPlay
        loop
        muted
        playsInline
      />
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
