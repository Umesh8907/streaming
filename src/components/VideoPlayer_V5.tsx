// Import dependencies
"use client";
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.css";
import "./stylesheet.css";
interface VideoPlayerProps {
  source: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source ,poster}) => {
  const videoNode = useRef<HTMLVideoElement | null>(null);
  const player = useRef<videojs.Player | null>(null);

  useEffect(() => {
    if (videoNode.current) {
      player.current = videojs(videoNode.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
        techOrder: ["html5"],
        sources: [
          {
            src: source,
            type: "application/x-mpegURL",
          },
        ],
      });

      player.current.ready(() => {
        player.current?.hlsQualitySelector({ displayCurrentQuality: false });
      });
    }

    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, [source]);

  return (
    <div data-vjs-player>
      <video
        ref={videoNode}
        className="video-js  vjs-big-play-centered  vjs-theme-fantasy "
        poster={poster}
      />
    </div>
  );
};

export default VideoPlayer;
