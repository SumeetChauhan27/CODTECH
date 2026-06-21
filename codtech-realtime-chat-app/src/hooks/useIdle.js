import { useState, useEffect } from 'react';

export function useIdle(timeoutMs = 5 * 60 * 1000) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timeoutId;

    const handleActivity = () => {
      if (isIdle) {
        setIsIdle(false);
      }
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsIdle(true);
      }, timeoutMs);
    };

    // Setup initial timeout
    handleActivity();

    // Listen to activity events
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Also handle tab visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is not visible, count as idle immediately or let the timeout handle it?
        // Let's count as idle if they leave the tab
        setIsIdle(true);
      } else {
        handleActivity();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timeoutMs, isIdle]);

  return isIdle;
}
