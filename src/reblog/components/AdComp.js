"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';

const AdSenseBlock = ({ clientId, slotId, format }) => {
  const adRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryDelay = 1000;
  
  // Create refs to break circular dependencies
  const initAdRef = useRef();
  const retryLoadAdRef = useRef();

  const loadAd = useCallback(() => {
    if (!adRef.current || !window.adsbygoogle) {
      return false;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setIsLoaded(true);
      return true;
    } catch (error) {
      console.error('Erreur lors du chargement AdSense:', error);
      return false;
    }
  }, []);

  const retryLoadAd = useCallback(() => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        if (initAdRef.current) {
          initAdRef.current();
        }
      }, retryDelay * (retryCount + 1));
    }
  }, [retryCount, maxRetries, retryDelay]);

  // Update the ref
  useEffect(() => {
    retryLoadAdRef.current = retryLoadAd;
  }, [retryLoadAd]);

  const initAd = useCallback(() => {
    if (!window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => loadAd();
      script.onerror = () => {
        if (retryLoadAdRef.current) {
          retryLoadAdRef.current();
        }
      };
      document.head.appendChild(script);
    } else {
      loadAd();
    }
  }, [loadAd]);

  // Store the latest initAd function in a ref
  useEffect(() => {
    initAdRef.current = initAd;
  }, [initAd]);

  useEffect(() => {
    setIsLoaded(false);
    setRetryCount(0);

    const currentAdRef = adRef.current;
    initAd();

    return () => {
      if (currentAdRef) {
        currentAdRef.remove();
      }
    };
  }, [clientId, slotId, initAd]);

  return (
    <>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {retryCount > 0 && !isLoaded && (
        <div className="ad-loading">
        </div>
      )}
    </>
  );
};

export default AdSenseBlock;