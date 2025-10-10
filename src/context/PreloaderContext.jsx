// src/context/PreloaderContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const PreloaderContext = createContext({ isLoaded: false, markLoaded: () => {}, markUnloaded: () => {} });

export function PreloaderProvider({ children }) {
  // ⚠️ 중요: 초기값이 false여야 프리로더가 표시됩니다!
  const [isLoaded, setIsLoaded] = useState(false);

  // BFCache(뒤로가기 캐시) 복원 시 프리로더가 다시 뜨도록 상태 초기화
  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) {
        console.log('[PreloaderContext] ♻️ pageshow(persisted) → isLoaded=false');
        setIsLoaded(false);
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);
  
  const markLoaded = useCallback(() => {
    console.log('[PreloaderContext] markLoaded 호출됨');
    setIsLoaded(true);
  }, []);

  const markUnloaded = useCallback(() => {
    console.log('[PreloaderContext] markUnloaded 호출됨');
    setIsLoaded(false);
  }, []);

  const value = { isLoaded, markLoaded, markUnloaded };
  
  console.log('[PreloaderContext] 렌더링 - isLoaded:', isLoaded);
  
  return <PreloaderContext.Provider value={value}>{children}</PreloaderContext.Provider>;
}

export function usePreloader() {
  return useContext(PreloaderContext);
}