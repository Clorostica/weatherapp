import { useRef, useEffect, useCallback } from "react";

// Lazy load videos - solo se cargan cuando se necesitan
const videoImports = {
  hot: () => import("../videos/Hot.mp4"),
  sunny: () => import("../videos/Clear.mp4"),
  cloudy: () => import("../videos/Clouds.mp4"),
  rainy: () => import("../videos/Rain.mp4"),
  stormy: () => import("../videos/Stormy.mp4"),
  snowy: () => import("../videos/Snowy.mp4"),
  cold: () => import("../videos/Cold.mp4"),
  night: () => import("../videos/Night.mp4"),
};

const BackgroundWrapper = ({ weatherType = "sunny", children }) => {
  const videoRef = useRef(null);
  const currentVideoSrcRef = useRef(null);
  const videoCacheRef = useRef(new Map());

  const getVideoSrc = useCallback(async (condition) => {
    if (videoCacheRef.current.has(condition)) {
      return videoCacheRef.current.get(condition);
    }

    const videoLoader = videoImports[condition] || videoImports.sunny;
    try {
      const module = await videoLoader();
      const videoSrc = module.default;
      videoCacheRef.current.set(condition, videoSrc);
      return videoSrc;
    } catch (error) {
      console.error(`Error loading video for ${condition}:`, error);

      if (condition !== "sunny") {
        return getVideoSrc("sunny");
      }
      return null;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentWeatherType = weatherType || "sunny";

    const handleCanPlay = () => {
      video.play().catch((error) => {
        if (error.name !== "AbortError" && error.name !== "NotAllowedError") {
          console.error("Error reproduciendo video:", error);
        }
      });
    };

    const handleLoadedData = () => {
      video.play().catch((error) => {
        if (error.name !== "AbortError" && error.name !== "NotAllowedError") {
          console.error("Error reproduciendo video:", error);
        }
      });
    };

    const handleError = (e) => {
      console.error("Error cargando video:", currentWeatherType, "Error:", e);
    };

    const loadVideo = async () => {
      const videoSrc = await getVideoSrc(currentWeatherType);

      if (!videoSrc) return;

      if (currentVideoSrcRef.current === videoSrc) {
        return;
      }

      currentVideoSrcRef.current = videoSrc;

      video.pause();

      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);

      video.src = videoSrc;
      video.preload = "auto";
      video.load();

      video.addEventListener("canplay", handleCanPlay, { once: true });
      video.addEventListener("loadeddata", handleLoadedData, { once: true });
      video.addEventListener("error", handleError, { once: true });
    };

    loadVideo();

    return () => {
      if (video) {
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("error", handleError);
      }
    };
  }, [weatherType, getVideoSrc]);

  return (
    <div className="width: 100vw">
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
      <div>{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
