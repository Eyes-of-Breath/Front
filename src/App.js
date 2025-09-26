import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import ScanlineH1toH2 from './effects/ScanlineH1toH2';

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
  return (
    <>
      <Header />
      {/* Central scroll container for sections */}
      <div id="scroll-root">
        <section className="section"><Home1 /></section>
        {/* Transition: Home1 → Home2 (scanline cut-paper) */}
        <section className="section">
          <ScanlineH1toH2 pinVh={280} scrub={0.5} />
        </section>
        <section className="section"><Home2 /></section>
        <section className="section"><Home3 /></section>
        <section className="section"><Home4 /></section>
        <section className="section"><Home5 /></section>
      </div>
      <Preloader onDone={markLoaded} active={!isLoaded} />
    </>
  );
}

export default App;
