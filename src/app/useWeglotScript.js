"use client"
import { useEffect } from 'react';

const useWeglotScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.weglot.com/weglot.min.js';
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && window.Weglot) {
        window.Weglot.initialize({
          api_key: 'wg_be7ebbaadfb1440097a7c172e9d482821',
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null; 
};

export default useWeglotScript;