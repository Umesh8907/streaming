'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import VideoPlayer8 from '@/components/VideoPlayer_V8';


// Dynamically import VideoPlayer with SSR disabled
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer_V8'), { ssr: false });

const Home = () => {
  // State for the current video source
  const [videoSource, setVideoSource] = useState({
    src: 'https://infano.duckdns.org/videos/m1c1/master.m3u8', // Default video source
    title: 'Chapter 1',
  });

  // Define chapters with different video sources
  const chapters = [
    { title: 'Chapter 1: Introduction', src: 'https://infano.duckdns.org/videos/m1c1/master.m3u8' },
    { title: 'Chapter 2: The Journey', src: 'https://infano.duckdns.org/videos/m1c2/master.m3u8' },
    { title: 'Chapter 3: The Conclusion', src: 'https://infano.duckdns.org/videos/m1c2/master.m3u8' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: '#f4f4f4', padding: '20px', borderRight: '1px solid #ddd' }}>
        <h2>Chapters</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {chapters.map((chapter, index) => (
            <li key={index} style={{ margin: '10px 0' }}>
              <button
                onClick={() => setVideoSource({ src: chapter.src, title: chapter.title })}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: chapter.title === videoSource.title ? '#007bff' : '#333',
                  fontWeight: chapter.title === videoSource.title ? 'bold' : 'normal',
                }}
              >
                {chapter.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>{videoSource.title}</h1>
        {/* Add key prop to force remounting when video source changes */}
        <VideoPlayer8 key={videoSource.src} source={videoSource.src} />
      </div>
    </div>
  );
};

export default Home;
