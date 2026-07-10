import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { KawaiiMascot } from '@/components/KawaiiMascot';
import type { Theme } from '@/types';

interface LayoutProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const pageVariants = {
  initial: {
    opacity: 0,
    clipPath: 'inset(5% 0 5% 0)',
    filter: 'blur(2px)',
  },
  animate: {
    opacity: 1,
    clipPath: 'inset(0% 0 0% 0)',
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
      clipPath: { duration: 0.35 },
      filter: { duration: 0.25 },
    },
  },
};

export function Layout({ theme, onToggleTheme }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col noise">
      {/* Subtle scanline overlay */}
      <div className="scanlines" />

      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <KawaiiMascot />

      {/* Page content with top padding for fixed navbar */}
      <main className="flex-1 pt-16">
        {/* Keyed remount animates each page in. No AnimatePresence here:
            exit animations deadlock with react-router's <Outlet /> and leave
            the incoming page stuck at opacity 0. */}
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="page-transition"
        >
          <Outlet />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
