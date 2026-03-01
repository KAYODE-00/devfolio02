import React from 'react'
import Navbar from './Sections/Navbar'
import Hero from './Sections/Hero'
import ServiceSummary from "./sections/ServiceSummary";


const App = () => {
  return (
    <div className='relative w-screen min-h-screen overflow-x-auto'>
<Navbar />
        <Hero />
        <ServiceSummary />
        
        {/* <Services />
        <About />
        <Works />
        <ContactSummary />
        <Contact /> */}
    </div>
  )
}

export default App