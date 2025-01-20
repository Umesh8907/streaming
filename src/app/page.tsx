"use client";
import PlyrPlayer from "@/components/Plyr/PLyr";
import MetaData from "@/Utils/MetaData";
import { useState } from "react";

export default function Home() {
  // Default chapter (e.g., Chapter 1)
  const [watched90Percent, setWatched90Percent] = useState(false);

  const [currentChapter, setCurrentChapter] = useState({
    videoSrc: "https://infano.duckdns.org/videos/m1c1/master.m3u8",
    thumbnail: "/c1.png",
  });

  // Chapter data
  const chapters = [
    {
      title: "Chapter 1: Introduction",
      videoSrc: "https://infano.duckdns.org/videos/m1c1/master.m3u8",
      thumbnail: "/c1.png",
    },
    {
      title: "Chapter 2: Health Basics",
      videoSrc: "https://infano.duckdns.org/videos/m1c2/master.m3u8",
      thumbnail: "/c1.png",
    },
    {
      title: "Chapter 3: Advanced Techniques",
      videoSrc: "https://infano.duckdns.org/videos/m1c3/master.m3u8",
      thumbnail: "/c1.png",
    },
  ];

  const handleChapterSelect = (chapter: { videoSrc: string; thumbnail: string }) => {
    setCurrentChapter(chapter); // Update the current chapter
  };

  return (
    <div>
      <MetaData
        title="Video Player with Dash / HLS Quality Selector"
        description="Video Player with Dash / HLS Quality Selector"
        keywords="Video Player with Dash / HLS Quality Selector"
      />

      <div>
        <div className="w-full h-[40px] bg-gradient-to-r from-orange-600 to-yellow-400 flex items-center justify-center text-[20px]">
          <marquee>Buy Now. Start Learning.</marquee>
        </div>
        <p className="text-center text-[40px] font-alfa_semibold leading-[2.5rem] tracking-[0.025em] mt-10">
          Start Your <span className="text-purple-600">Health</span> <br />
          <span className="text-purple-600">Journey</span> In 2 Hours.
        </p>
        <p className="font-alfa_regular text-center text-[20px] mt-2 text-gray-700 ">
          Your first Health Benefits is just one workshop away.
        </p>
      </div>

      <div className="md:w-[50%] w-[95%] mx-auto mt-2 overflow-hidden rounded-xl shadow-purple-300 shadow-xl border-2">
        {/* Using the key to force re-render on src change */}
        <PlyrPlayer
          key={currentChapter.videoSrc} // Using videoSrc as the key
          src={currentChapter.videoSrc}
          thumbnail={currentChapter.thumbnail}
          onVideoProgress={(percentage: number) => {
            // Handle video progress if needed
            if (percentage >= 90 && !watched90Percent) {
              setWatched90Percent(true);
            }
          }}
        />
      </div>

      {/* Chapter Navigation Bar */}
      <div className="chapter-nav mt-4">
        <h3 className="text-center text-xl font-semibold">Chapters</h3>
        <div className="flex justify-center mt-2 space-x-4">
          {chapters.map((chapter, index) => (
            <div
              key={index}
              className="cursor-pointer flex flex-col items-center"
              onClick={() => handleChapterSelect(chapter)}
            >
              <img
                src={chapter.thumbnail}
                alt={chapter.title}
                className="w-[100px] h-[100px] object-cover rounded-lg"
              />
              <p className="mt-2 text-sm text-center">{chapter.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full mx-auto justify-center mt-6">
        <button className="px-6 py-2 bg-gradient-to-tr from-purple-500 to-purple-700 rounded-full shadow-purple-300 shadow-md text-white hover:from-purple-400 hover:to-purple-600 transition-all ease-in-out font-alfa_semibold text-xl">
          Book Your Seat Now
        </button>
      </div>
      {watched90Percent && (
        <div className="text-center mt-4 text-xl text-green-500">
          You have successfully watched 90% of the video!
        </div>
      )}
    </div>
  );
}
