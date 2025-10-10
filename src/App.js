import React, { useEffect, useState, useRef } from 'react';
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
import HeaderColorTrigger from './components/HeaderColorTrigger'; // ⭐ 추가
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

function AppShell() {
  const { isLoaded, markLoaded } = usePreloader();
  const [showContent, setShowContent] = useState(false);
  const contentRef = useRef(null);

  console.log('[AppShell] 렌더링 - isLoaded:', isLoaded, 'showContent:', showContent);

  // Ensure content is shown if preloader is already done (e.g., after logout -> '/')
  useEffect(() => {
    if (isLoaded && !showContent) {
      setShowContent(true);
    }
  }, [isLoaded, showContent]);

  // 슬라이드 업 애니메이션 효과
  useEffect(() => {
    if (!showContent || !contentRef.current) return;

    // 초기 위치를 화면 아래로 설정
    gsap.set(contentRef.current, {
      y: '100%',
      opacity: 0
    });

    // 밑에서 위로 올라오는 애니메이션
    gsap.to(contentRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      clearProps: 'transform', // ⭐ 핵심: 애니메이션 후 transform 제거
      onComplete: () => {
        // transform 완전히 제거 (이중 안전장치)
        if (contentRef.current) {
          contentRef.current.style.transform = '';
        }
        
        // 스크롤 위치 초기화
        window.scrollTo(0, 0);
        
        // ScrollTrigger 새로고침 (약간의 딜레이 후)
        requestAnimationFrame(() => {
          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh(true); // true: 강제 새로고침
          }
        });
      }
    });
  }, [showContent]);

  const handlePreloaderReveal = () => {
    console.log('[AppShell] 🎬 onReveal 호출 - 컨텐츠 표시');
    setShowContent(true);
  };

  const handlePreloaderDone = () => {
    console.log('[AppShell] ✅ onDone 호출 - markLoaded 실행');
    markLoaded();
  };

  return (
    <>
      {/* Preloader - isLoaded가 false일 때만 표시 */}
      {!isLoaded && (
        <Preloader 
          onReveal={handlePreloaderReveal}
          onDone={handlePreloaderDone}
        />
      )}

      {/* Header와 컨텐츠 - showContent가 true일 때 렌더링 */}
      {showContent && (
        <div ref={contentRef}>
          <HeaderColorTrigger /> {/* ⭐ header-red 토글 관리 */}
          <Header />
          <div id="scroll-root">
            <section className="section" id="home1"><Home1 /></section>
            <section className="section" id="home2"><Home2 /></section>
            <section className="section" id="home3"><Home3 /></section>
            <section className="section" id="home4"><Home4 /></section>
            <section className="section" id="home5"><Home5 /></section>
          </div>
        </div>
      )}
    </>
  );
}

export default App;