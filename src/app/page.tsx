'use client'
import PlyrPlayer from "@/components/Plyr/PLyr";
import MetaData from "@/Utils/MetaData";
import { useState } from "react";

export default function Home() {
  const videoSrc = "https://infano.duckdns.org/videos/chapter2/master.m3u8"; // Replace with your .m3u8 URL
  const thumbnailSrc = "/c1.png"; // Replace with your thumbnail URL

  // State to track whether 20% of the video has been watched
  const [watched90Percent, setWatched90Percent] = useState(false);

  // Callback function to update the watched20Percent state
  const handleVideoProgress = (percentage: number) => {
    if (percentage >= 90 && !watched90Percent) {
      setWatched90Percent(true);
    }
  };

  return (
    <div className=" ">
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
        <PlyrPlayer
          src={videoSrc}
          thumbnail={thumbnailSrc}
          onVideoProgress={handleVideoProgress} // Pass the callback function as a prop
        />
      </div>
      <div className="flex w-full mx-auto justify-center mt-6">
        <button className="px-6 py-2 bg-gradient-to-tr from-purple-500 to-purple-700 rounded-full shadow-purple-300 shadow-md text-white hover:from-purple-400 hover:to-purple-600 transition-all ease-in-out font-alfa_semibold text-xl">
          Book Your Seat Now
        </button>
      </div>
      {/* Display the message when 20% of the video is watched */}
      {watched90Percent && (
        <div className="text-center mt-4 text-xl text-green-500">
          You have successfully watched 90% of the video!
        </div>
      )}
    </div>
  );
}
