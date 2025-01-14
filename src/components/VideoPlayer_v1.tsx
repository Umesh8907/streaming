"use client";
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import './stylesheet.css';

const VideoPlayer1: React.FC = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  const mainVideoSource =
    "https://infano.duckdns.org/videos/chapter2/master.m3u8";

  const availableVideoSources = useMemo(
    () => [
      {
        label: "480p",
        src: "https://infano.duckdns.org/videos/chapter2/480p.m3u8",
      },
      {
        label: "720p",
        src: "https://infano.duckdns.org/videos/chapter2/720p.m3u8",
      },
      {
        label: "1080p",
        src: "https://infano.duckdns.org/videos/chapter2/1080p.m3u8",
      },
    ],
    []
  );

  const options: VideoJsPlayerOptions = useMemo(
    () => ({
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [
        {
          src: mainVideoSource,
          type: "application/x-mpegURL",
        },
      ],
    }),
    []
  );

  const handleResolutionChange = useCallback(
    (index: number) => {
      const player = playerRef.current;
      if (player) {
        const currentTime = player.currentTime();
        const resolution = availableVideoSources[index];

        console.log(`Switching to ${resolution.label} - ${resolution.src}`);

        player.src({
          src: resolution.src,
          type: "application/x-mpegURL",
        });

        player.ready(() => {
          player.currentTime(currentTime);
        });
      } else {
        console.error("Player is not initialized.");
      }
    },
    [availableVideoSources]
  );

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js" );
      videoElement.classList.add("vjs-big-play-centered" , "vjs-theme-fantasy");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options));
      console.log("Video.js player initialized.");

      availableVideoSources.forEach((resolution, index) => {
        const Button = videojs.getComponent("Button");

        const resolutionButton = new Button(player, {
          controlText: resolution.label,
          className: "vjs-visible-text",
        });

        resolutionButton.on("click", () => {
          console.log(`Button clicked: ${resolution.label}`);
          handleResolutionChange(index);
        });

        player.getChild("ControlBar")?.addChild(resolutionButton);
        console.log(`Added button for ${resolution.label}`);
      });
    } else if (playerRef.current) {
      const player = playerRef.current;
      player.autoplay(options.autoplay ?? false);
      player.src(options.sources ?? []);
    }
  }, [handleResolutionChange, options, availableVideoSources]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer1;

