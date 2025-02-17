import React, { useState, useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Gallery from "@/Components/Home/Gallery";
import HeroSection from "@/Components/Home/HeroSection";
import Schedule from "@/Components/Home/Schedule";
import { useSelector } from "react-redux";
import VideoLoader from "@/Components/Loaders/Videoloader";
import webSiteLoaderVideo from "@/assets/Website_Loader.webm";
import ImageStudio from "@/Components/Home/ImageStudio";

function Home() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if the page was reloaded or if it's an internal navigation
    const isPageReload = window.performance.navigation.type === 1;
    const isInternalNavigation = sessionStorage.getItem("isInternalNavigation") === "true";

    // Set loading only for external navigations and first page load
    if (!isPageReload && !isInternalNavigation) {
      const timer = setTimeout(() => setLoading(false), 9800); // Adjust timing as needed
      sessionStorage.setItem("isInternalNavigation", "true"); // Set for future navigations
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  useLayoutEffect(() => {
    const hash = window.location.hash;
    if (hash && hash !== "#") {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }
  }, [location]);

  const state = useSelector((state) => state.user.user); // Corrected selector return

  if (loading) {
    return <VideoLoader loading={loading} video={webSiteLoaderVideo} />;
  }

  return (
    <div className="bg-floralWhite relative z-20 overflow-x-hidden">
      <HeroSection />
      <Schedule />
      {/* <Gallery /> */}
      <ImageStudio />
    </div>
  );
}

export default Home;
