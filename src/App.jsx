import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './routes/Home';
import Dailys from './routes/Dailys';
import About from './routes/About';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import './App.css';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dailys" element={<Dailys />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App
