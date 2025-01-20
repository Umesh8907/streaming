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
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0); // Track the current chapter index

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

  // Handle chapter select and set current chapter index
  const handleChapterSelect = (chapter: { videoSrc: string; thumbnail: string }, index: number) => {
    setCurrentChapter(chapter);
    setCurrentChapterIndex(index);
    setWatched90Percent(false); // Reset watched percentage for new chapter
  };

  // Handle Next Chapter logic
  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      const nextChapter = chapters[currentChapterIndex + 1];
      handleChapterSelect(nextChapter, currentChapterIndex + 1);
      setWatched90Percent(false);
    }
  };

  return (
    <div className="mb-20">
      <MetaData
        title="Video Player with Dash / HLS Quality Selector"
        description="Video Player with Dash / HLS Quality Selector"
        keywords="Video Player with Dash / HLS Quality Selector"
      />

      <div>
        <p className="text-center text-[40px] font-alfa_semibold leading-[2.5rem] tracking-[0.025em] mt-10">
          Start Your <span className="text-purple-600">Health</span> <br />
          <span className="text-purple-600">Journey</span> In 2 Hours.
        </p>
        <p className="font-alfa_regular text-center text-[20px] mt-2 text-gray-700 ">
          Your first Health Benefits is just one workshop away.
        </p>
      </div>
      {watched90Percent && (
        <div className="text-center mt-4 text-xl text-green-500">
          You have successfully watched 90% of the video!
        </div>
      )}

      <div className="flex justify-center items-center">
        <div className="w-[50%] mx-auto mt-2 overflow-hidden rounded-xl shadow-purple-300 shadow-xl border-2">
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

        <div className="chapter-nav mt-4 p-8">
          <h3 className="text-center text-xl font-semibold">Chapters</h3>
          <div className="justify-center mt-4">
            {chapters.map((chapter, index) => (
              <div
                key={index}
                className="cursor-pointer flex gap-2 items-center mt-2 bg-slate-300 p-2 rounded-xl"
                onClick={() => handleChapterSelect(chapter, index)}
              >
                <img
                  src={chapter.thumbnail}
                  alt={chapter.title}
                  className="w-[40px] h-[40px] object-cover rounded-lg"
                />
                <p className="mt-2 text-sm text-center">{chapter.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Chapter Button */}
      <div className="flex justify-center mt-6">
      <button
  className={`px-6 py-2 rounded-full shadow-md font-alfa_semibold text-xl transition-all ease-in-out ${
    watched90Percent
      ? "bg-gradient-to-tr from-purple-500 to-purple-700 text-white hover:from-purple-400 hover:to-purple-600 shadow-purple-300"
      : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
  }`}
  onClick={handleNextChapter}
  disabled={!watched90Percent} // Disable button if less than 90% watched
>
  Next Chapter
</button>
      </div>

      <div className="flex w-full mx-auto justify-center mt-6">
        <button className="px-6 py-2 bg-gradient-to-tr from-purple-500 to-purple-700 rounded-full shadow-purple-300 shadow-md text-white hover:from-purple-400 hover:to-purple-600 transition-all ease-in-out font-alfa_semibold text-xl">
          Book Your Seat Now
        </button>
      </div>
    </div>
  );
}
