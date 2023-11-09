import React, { useState } from 'react';
import Titlebar from './components/titlebar/titlebar';
import Footer from './components/footer/footer';
import { Route, Routes, Navigate } from 'react-router-dom';
import Main from './pages/Main';

function RedirectToLanguage() {
  const defaultLanguage = localStorage.getItem('language') || 'en';
  
  return <Navigate to={`/${defaultLanguage}/`} replace />;
}

const App = () => {

  async function click() {
    let res = await window.api.start();
  }

   return (
    <>
      <Routes>
        <Route path=':lang' element={<Main/>}/>
        <Route path='*' element={<RedirectToLanguage/>} />
      </Routes>
      <Footer/>
    </>
   )
};

export default App;
