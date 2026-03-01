import React from 'react'
import Navbar from './Sections/Navbar'
import Hero from './Sections/Hero'

const App = () => {
  return (
    <div className='relative w-screen min-h-screen overflow-x-auto'>
      <Navbar/>
      <Hero/>
    </div>
  )
}

export default App