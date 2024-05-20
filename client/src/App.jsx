import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Create from './pages/Create';

const App = () => {
  return (
    <BrowserRouter>
    <div className="">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/create" element={<Create/>}/>
      </Routes>
      
       {/* <Home/> */}
    </div>
    </BrowserRouter>
  )
}

export default App
