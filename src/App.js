import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Context
import { PreloaderProvider, usePreloader } from './context/PreloaderContext';

// Auth / user pages
import Login from './components/Login';
import Signup from './components/Signup';
import Layout from './user/Layout';
import Dashboard from './user/Dashboard';
import Calendar from './user/Calendar';
import Loading from './user/Loading';
import Result from './user/Result';
import Patient from './user/Patient';
import Profile from './user/Profile';
import Analysis from './user/Analysis';
import PatientAll from './user/PatientAll';
import ChangePassword from './user/ChangePassword';

// Landing flow
import Preloader from './components/Preloader/Preloader';
import Header from './components/Header';
import Home1 from './components/Home1';
import Home2 from './components/Home2';
import Home3 from './components/Home3';
import Home4 from './components/Home4';
import Home5 from './components/Home5';

gsap.registerPlugin(ScrollTrigger);

function App() {
  return (
    <PreloaderProvider>
      <Router>
        <Routes>
          {/* Landing root: Preloader → SceneController via context */}
          <Route path='/' element={<AppShell />} />

          {/* Auth */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          {/* App (protected shell) */}
          <Route element={<Layout />} >
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='calendar' element={<Calendar />} />
            <Route path='patientAll' element={<PatientAll />} />
            <Route path='patient' element={<Patient />} />
            <Route path='analysis' element={<Analysis />} />
            <Route path='loading' element={<Loading />} />
            <Route path='result' element={<Result />} />
            <Route path='profile' element={<Profile />} />
            <Route path='changePassword' element={<ChangePassword />} />
          </Route>
        </Routes>
      </Router>
    </PreloaderProvider>
  );
}

function AppShell(){
  const { isLoaded, markLoaded } = usePreloader();
  useEffect(() => {
    const startEl = document.querySelector('#home2');
    const endEl = document.querySelector('#home5');

    if (!startEl || !endEl) return;

    // prevent duplicates on hot reload or remount
    const prev = ScrollTrigger.getById('header-color-h2toh5');
    if (prev) prev.kill();

    const trigger = ScrollTrigger.create({
      id: 'header-color-h2toh5',
      trigger: startEl,
      start: 'top 80%',      // when Home2 nears viewport
      endTrigger: endEl,
      end: 'bottom top',     // until Home5 leaves the top
      scrub: 0.3,
      anticipatePin: 1,
      onEnter:     () => document.body.classList.add('header-red'),
      onEnterBack: () => document.body.classList.add('header-red'),
      onLeave:     () => document.body.classList.remove('header-red'),
      onLeaveBack: () => document.body.classList.remove('header-red'),
    });

    ScrollTrigger.refresh();

    return () => {
      document.body.classList.remove('header-red');
      trigger.kill();
    };
  }, []);
  return (
    <>
      <Header />
      {/* Central scroll container for sections */}
      <div id="scroll-root">
        <section className="section" id="home1"><Home1 /></section>
        <section className="section" id="home2"><Home2 /></section>
        <section className="section" id="home3"><Home3 /></section>
        <section className="section" id="home4"><Home4 /></section>
        <section className="section" id="home5"><Home5 /></section>
      </div>
      <Preloader onDone={markLoaded} active={!isLoaded} />
    </>
  );
}

export default App;