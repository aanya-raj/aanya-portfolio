import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { AdminProvider } from '@/lib/admin-context';
import { Layout } from '@/app/Layout';
import { ScrollToTop } from '@/components/ScrollToTop';
import { CursorSparkle } from '@/components/CursorSparkle';
import { LoadingScreen } from '@/components/LoadingScreen';
import { StickerLayer } from '@/components/StickerLayer';
import { AdminToolbar } from '@/components/AdminToolbar';
import { Home } from '@/pages/Home';
import { Projects } from '@/pages/Projects';
import { ProjectDetail } from '@/pages/ProjectDetail';
import { About } from '@/pages/About';
import { Playground } from '@/pages/Playground';
import { Contact } from '@/pages/Contact';
import { Admin } from '@/pages/Admin';
import { NotFound } from '@/pages/NotFound';

export function App() {
  const { theme, toggleTheme } = useTheme();
  // Full deck-shuffle intro only once per session; quick fade on repeat visits
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const seen = sessionStorage.getItem('deck_shuffled');
    const duration = seen || prefersReducedMotion ? 400 : 2000;
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('deck_shuffled', '1');
    }, duration);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  return (
    <AdminProvider>
      <LoadingScreen isLoading={isLoading} />
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        {!prefersReducedMotion && <CursorSparkle />}
        <ScrollToTop />
        <StickerLayer />
        <AdminToolbar />
        <Routes>
          <Route element={<Layout theme={theme} onToggleTheme={toggleTheme} />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:slug" element={<ProjectDetail />} />
            <Route path="about" element={<About />} />
            <Route path="playground" element={<Playground />} />
            <Route path="contact" element={<Contact />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}
