"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "plyr/dist/plyr.css";

import Plyr from "plyr";

type VideoPlayerProps = {
  sources: {
    default: string; // Default source (main.m3u8)
    qualities: { [quality: string]: string }; // Object mapping quality (e.g., 720) to m3u8 file
  };
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ sources }) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [player, setPlayer] = useState<Plyr | null>(null);

  useEffect(() => {
    let plyrInstance: Plyr | null = null;

    if (playerRef.current) {
      console.log("Initializing Plyr...");
      plyrInstance = new Plyr(playerRef.current, {
        settings: ["quality"],
        quality: {
          default: Number(Object.keys(sources.qualities)[0]), // Default quality
          options: Object.keys(sources.qualities).map((q) => Number(q)),
          forced: true,
        },
      });

      plyrInstance.on("ready", () => {
        console.log("Plyr is ready!");
      });

      plyrInstance.on("qualitychange", (event: any) => {
        console.log("Quality changed to:", event.detail.quality);
        handleQualityChange(event.detail.quality);
      });

      setPlayer(plyrInstance);
    }

    // Cleanup Plyr on component unmount
    return () => {
      if (plyrInstance && typeof plyrInstance.destroy === "function") {
        console.log("Destroying Plyr instance...");
        plyrInstance.destroy();
      }
    };
  }, [sources]);

  const handleQualityChange = (newQuality: number) => {
    if (!player) return;

    const currentTime = player.currentTime;
    const selectedSource = sources.qualities[newQuality.toString()];

    if (selectedSource) {
      console.log("Changing source to:", selectedSource);

      player.source = {
        type: "video",
        sources: [
          {
            src: selectedSource,
            type: "application/x-mpegURL",
            size: newQuality,
          },
        ],
      };

      player.currentTime = currentTime; // Resume playback at the current time
      player.play();
    }
  };

  return (
    <div>
      <video
        ref={playerRef}
        className="plyr__video-embed"
        controls
        crossOrigin="anonymous"
      >
        <source src={sources.default} type="application/x-mpegURL" />
      </video>
    </div>
  );
};

export default VideoPlayer;
