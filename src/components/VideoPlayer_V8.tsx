'use client';

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels'; // For quality levels
import 'videojs-hls-quality-selector'; // HLS quality selector plugin

interface VideoPlayerProps {
  source: string;
  poster?: string;
}

const VideoPlayer8: React.FC<VideoPlayerProps> = ({ source, poster }) => {
  const videoNode = useRef<HTMLVideoElement | null>(null);
  const player = useRef<videojs.Player | null>(null);

  useEffect(() => {
    if (videoNode.current) {
      // Initialize the Video.js player
      player.current = videojs(videoNode.current, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        techOrder: ['html5'],
        sources: [
          {
            src: source,
            type: 'application/x-mpegURL',
          },
        ],
      });

      // Wait for player to be ready and then apply the HLS quality selector plugin
      player.current.ready(() => {
        player.current?.hlsQualitySelector({ displayCurrentQuality: false });
      });
    }

    // Dispose of the player when the component unmounts or the source changes
    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, [source]); // Reinitialize player whenever source changes

  return (
    <div data-vjs-player>
      <video ref={videoNode} className="video-js vjs-big-play-centered vjs-theme-fantasy" poster={poster} />
    </div>
  );
};

export default VideoPlayer8;
