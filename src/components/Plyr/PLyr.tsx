"use client";
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import "plyr/dist/plyr.css";
import { CgSpinner } from "react-icons/cg";

interface VideoPlayerProps {
  src: string; // URL to the master.m3u8 file
  thumbnail: string; // URL to the thumbnail image
  onVideoProgress: (percentage: number) => void; // Callback function for progress
}

const PlyrPlayer: React.FC<VideoPlayerProps> = ({
  src,
  thumbnail,
  onVideoProgress,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null); // Store Plyr instance here
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    // Check if video reference is available
    const video = videoRef.current;
    if (!video) return;

    // Initialize the player when the src is set
    const loadPlyr = async () => {
      const Plyr = (await import("plyr")).default; // Dynamically import Plyr

      const defaultOptions: Plyr.Options = {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "captions",
          "settings",
          "fullscreen",
        ],
        settings: ["quality", "speed"],
      };

      let hls: Hls | null = null;

      // Destroy previous instance if exists
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      // Only initialize the player if it's not already initialized
      if (Hls.isSupported() && src.endsWith(".m3u8")) {
        hls = new Hls();
        hls.loadSource(src);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          const availableQualities = hls.levels.map((level) => level.height);
          availableQualities.unshift(0); // Add "Auto" to the quality list

          defaultOptions.quality = {
            default: 0,
            options: availableQualities,
            forced: true,
            onChange: (newQuality) => updateQuality(newQuality),
          };

          defaultOptions.i18n = {
            qualityLabel: {
              0: "Auto",
            },
          };

          hls.on(Hls.Events.LEVEL_SWITCHED, function (_, data) {
            const autoLabel = document.querySelector(
              ".plyr__menu__container [data-plyr='quality'][value='0'] span"
            );
            if (autoLabel) {
              autoLabel.textContent = hls.autoLevelEnabled
                ? `AUTO (${hls.levels[data.level].height}p)`
                : "AUTO";
            }
          });

          // Initialize Plyr with the updated quality options
          playerRef.current = new Plyr(video, defaultOptions);
          setIsPlayerReady(true); // Mark the player as ready
        });

        hls.attachMedia(video);
        (window as any).hls = hls; // Expose HLS instance for debugging
      } else {
        playerRef.current = new Plyr(video, defaultOptions); // Fallback for browsers with native HLS support
        video.src = src;
        setIsPlayerReady(true); // Mark the player as ready
      }

      function updateQuality(newQuality: number) {
        if (!hls) return;

        if (newQuality === 0) {
          hls.currentLevel = -1; // Enable AUTO quality
        } else {
          hls.levels.forEach((level, index) => {
            if (level.height === newQuality) {
              hls.currentLevel = index;
            }
          });
        }
      }

      // Monitor video progress to send data to parent component
      const onTimeUpdate = () => {
        if (!video) return;
        const percentage = (video.currentTime / video.duration) * 100;

        if (percentage >= 90) {
          onVideoProgress(percentage); // Pass the percentage to the parent
        }
      };

      // Add timeupdate event listener to track progress
      video.addEventListener("timeupdate", onTimeUpdate);

      return () => {
        hls?.destroy();
        playerRef.current?.destroy();
        video.removeEventListener("timeupdate", onTimeUpdate); // Clean up event listener
      };
    };

    loadPlyr();
  }, [src]); // Trigger this effect whenever the `src` changes

  return (
    <div className={`video-wrapper ${isPlayerReady ? "" : "loading"}`}>
      <video
        ref={videoRef}
        className="plyr"
        poster={thumbnail}
        controls
        crossOrigin="anonymous"
        style={{ visibility: isPlayerReady ? "visible" : "hidden" }}
      ></video>
      {!isPlayerReady && <CgSpinner className="animate-spin" />}
    </div>
  );
};

export default PlyrPlayer;
