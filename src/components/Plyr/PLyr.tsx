"use client";
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import "plyr/dist/plyr.css";


interface VideoPlayerProps {
  src: string; 
  thumbnail: string; 
  onVideoProgress: (percentage: number) => void; 
}

const PlyrPlayer: React.FC<VideoPlayerProps> = ({
  src,
  thumbnail,
  onVideoProgress,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const loadPlyr = async () => {
      const Plyr = (await import("plyr")).default;

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

      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      if (Hls.isSupported() && src.endsWith(".m3u8")) {
        hls = new Hls();
        hls.loadSource(src);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
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

          hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
            const autoLabel = document.querySelector(
              ".plyr__menu__container [data-plyr='quality'][value='0'] span"
            );
            if (autoLabel) {
              autoLabel.textContent = hls.autoLevelEnabled
                ? `AUTO (${hls.levels[data.level].height}p)`
                : "AUTO";
            }
          });

          playerRef.current = new Plyr(video, defaultOptions);
          setIsPlayerReady(true);
        });

        hls.attachMedia(video);
        (window as any).hls = hls;
      } else {
        playerRef.current = new Plyr(video, defaultOptions);
        video.src = src;
        setIsPlayerReady(true);
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

      const onTimeUpdate = () => {
        if (!video) return;
        const percentage = (video.currentTime / video.duration) * 100;
        if (percentage >= 90) {
          onVideoProgress(percentage);
        }
      };

      video.addEventListener("timeupdate", onTimeUpdate);

      return () => {
        hls?.destroy();
        playerRef.current?.destroy();
        video.removeEventListener("timeupdate", onTimeUpdate);
      };
    };

    setIsPlayerReady(false);
    loadPlyr();
  }, [src]);

  return (
    <div className="video-wrapper relative">
      <video
        ref={videoRef}
        className="plyr"
        poster={thumbnail}
        controls
        crossOrigin="anonymous"
      ></video>

    
    </div>
  );
};

export default PlyrPlayer;
