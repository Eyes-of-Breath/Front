// src/context/PreloaderContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const PreloaderContext = createContext({ isLoaded: false, markLoaded: () => {} });

export function PreloaderProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const markLoaded = useCallback(() => setIsLoaded(true), []);
  const value = { isLoaded, markLoaded };
  return <PreloaderContext.Provider value={value}>{children}</PreloaderContext.Provider>;
}

export function usePreloader(){
  return useContext(PreloaderContext);
}