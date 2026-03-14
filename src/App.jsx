import React, { useEffect, useState } from "react";
import Navbar from "./Sections/Navbar";
import Hero from "./Sections/Hero";
import ServiceSummary from "./Sections/ServiceSummary";
import Services from "./Sections/Services";
import ReactLenis from "lenis/react";
import About from "./Sections/About";
import Works from "./Sections/Works";
import TechStacks from "./Sections/TechStacks";
import Contact from "./Sections/Contact";
import Ai from "./Components/Ai";
import { Route, Routes } from "react-router-dom";
import DigitalVersion from "./Sections/DigitalVersion";
import Splashscreen from "./Sections/Splashscreen";

const Home = () => (
  <>
    <Navbar />
    <Hero />
    <ServiceSummary /> <Works />
    <About />
    <Services />
    {/* <TechStacks /> */}
    <Contact />
  </>
);

const App = () => {
  const [isReady, setIsReady] = useState(false);

  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-auto">
      <Splashscreen isReady={isReady} setIsReady={setIsReady} />

      <div
        className={`${
          isReady ? "opacity-100" : "opacity-0"
        } transition-opacity duration-1000`}
      >
        <Ai />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/digitalVersion" element={<DigitalVersion />} />
        </Routes>
      </div>
    </ReactLenis>
  );
};

export default App;
