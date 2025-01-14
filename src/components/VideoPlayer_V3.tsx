"use client";
import React, { useEffect, useRef } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import "./stylesheet.css";

// Import the quality selector plugin
import vjsqs from "@silvermine/videojs-quality-selector";
import "@silvermine/videojs-quality-selector/dist/css/quality-selector.css";

const VideoPlayer3: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  const options: VideoJsPlayerOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    controlBar: {
      children: [
        "playToggle",
        "progressControl",
        "volumePanel",
        "qualitySelector", // Add the quality selector to the control bar
        "fullscreenToggle",
      ],
    },
    sources: [
      {
        src: "https://infano.duckdns.org/videos/chapter2/master.m3u8",
        type: "application/x-mpegURL",
        label: "Auto",
        res: 0,
      },
      {
        src: "https://infano.duckdns.org/videos/chapter2/480p.m3u8",
        type: "application/x-mpegURL",
        label: "480p",
        res: 480,
      },
      {
        src: "https://infano.duckdns.org/videos/chapter2/720p.m3u8",
        type: "application/x-mpegURL",
        label: "720p",
        res: 720,
      },
      {
        src: "https://infano.duckdns.org/videos/chapter2/1080p.m3u8",
        type: "application/x-mpegURL",
        label: "1080p",
        res: 1080,
      },
    ],
  };

  useEffect(() => {
    // Initialize the quality selector plugin
    vjsqs(videojs);

    if (videoRef.current && !playerRef.current) {
      const player = (playerRef.current = videojs(videoRef.current, options));

      player.on("ready", () => {
        console.log("Video.js player ready.");
      });

      // Preserve playback position on quality change
      player.on("beforequalitychange", () => {
        playerRef.current?.setCache("playbackTime", player.currentTime());
      });

      player.on("qualitychange", () => {
        const playbackTime = playerRef.current?.getCache("playbackTime");
        if (playbackTime) {
          player.currentTime(playbackTime);
        }
      });

      player.on("ended", () => {
        alert("Video has ended.");
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered vjs-theme-fantasy"
      />
    </div>
  );
};

export default VideoPlayer3;
