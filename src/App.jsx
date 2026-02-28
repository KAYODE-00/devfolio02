import React from 'react'
import Navbar from './Sections/Navbar'

const App = () => {
  return (
    <div className='relative w-screen min-h-screen overflow-x-auto'>
      <Navbar/>
      <section  id='Home' className='min-h-screen'/>
       <section id='Services' className='min-h-screen'/>
    </div>
  )
}

export default App