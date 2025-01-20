'use client';
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ src, options = {}, onPlayerReady }) => {
  const videoRef = useRef(null); // Reference to the video element
  const playerRef = useRef(null); // Reference to the Video.js player instance

  useEffect(() => {
    // Initialize the Video.js player only once
    if (!playerRef.current && videoRef.current) {
      playerRef.current = videojs(videoRef.current, options, () => {
        if (onPlayerReady) {
          onPlayerReady(playerRef.current);
        }
      });
    }

    // Update the player's source dynamically when `src` changes
    if (playerRef.current) {
      const currentSrc = playerRef.current.src();
      if (currentSrc !== src) {
        playerRef.current.src({ src, type: 'application/x-mpegURL' });
        playerRef.current.play().catch((error) => {
          console.error('Error playing the video:', error);
        });
      }
    }

    return () => {
      // Cleanup the player only when the component unmounts
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, options, onPlayerReady]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
