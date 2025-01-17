import VideoPlayer from "@/components/VideoPlayer_V5";


export default function Home() {
  return (
    <div className="w-[50%] mx-auto mt-20">
      <h1 className="text-center mb-10 font-bold underline">
        Video Player with Dash / HLS Quality Selector
      </h1>
      <div className=" overflow-hidden rounded-xl shadow-lg ">
        <VideoPlayer
          source="https://infano.duckdns.org/videos/chapter2/master.m3u8"
          poster="https://plus.unsplash.com/premium_photo-1732721750556-f5aef2460dfd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </div>
    </div>
  );
}
