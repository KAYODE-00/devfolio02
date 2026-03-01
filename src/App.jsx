import React from 'react'
import Navbar from './Sections/Navbar'
import Hero from './Sections/Hero'
import ServiceSummary from "./sections/ServiceSummary";
import Services from "./sections/Services";
import ReactLenis from "lenis/react";
import About from './Sections/About';
import Works from './Sections/Works';




const App = () => {
  return (
    <ReactLenis root className='relative w-screen min-h-screen overflow-x-auto'>
<Navbar />
        <Hero />
        <ServiceSummary />
        <Services />
        <About />
        <Works />
        {/* <ContactSummary />
        <Contact /> */}
    </ReactLenis>
  )
}

export default App