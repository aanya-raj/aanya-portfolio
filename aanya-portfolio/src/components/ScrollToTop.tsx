import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 'instant' isn't a standard ScrollBehavior and can throw in some browsers.
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
