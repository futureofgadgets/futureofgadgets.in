"use client";

import { useRef, useEffect, useState } from "react";
import { Play } from "lucide-react";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
};

export default function YoutubeSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [contactSettings, setContactSettings] = useState({ youtube: '' });

  useEffect(() => {
    Promise.all([
      fetch('/api/youtube-videos').then(r => r.json()).catch(() => ({ videos: [] })),
      fetch('/api/settings').then(r => r.json()).catch(() => ({}))
    ]).then(([videoData, settingsData]) => {
      setVideos(videoData.videos || []);
      if (settingsData.contact?.youtube) {
        setContactSettings({ youtube: settingsData.contact.youtube });
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!scrollRef.current || videos.length === 0 || isPaused) return;

    const scrollContainer = scrollRef.current;
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    
    if (maxScroll <= 0) return;

    let animationId: number;

    const autoScroll = () => {
      scrollContainer.scrollLeft += 1;
      if (scrollContainer.scrollLeft >= maxScroll) {
        scrollContainer.scrollLeft = 0;
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationId);
  }, [videos, isPaused]);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-6">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mb-6 animate-pulse"></div>
          <div className="flex gap-6 overflow-x-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0">
                <div className="w-[320px] h-[180px] bg-gray-200 animate-pulse rounded-xl mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-gray-200">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Latest Videos
            </h2>
            <p className="text-sm hidden sm:block text-gray-600">Visit our YouTube channel for more tech content</p>
          </div>
          {contactSettings.youtube && (
            <button
              onClick={() => window.open(contactSettings.youtube, '_blank')}
              className="flex items-center gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-sm sm:rounded-lg transition-colors font-medium hover:cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Subscribe
            </button>
          )}
        </div>
        
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hidden py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex-shrink-0 w-[320px] cursor-pointer group"
                onClick={() => window.open(video.url, '_blank')}
              >
                <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-[180px] object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold mt-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}