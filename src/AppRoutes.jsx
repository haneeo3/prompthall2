import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import IntelHome from './pages/intel/IntelHome';
import LegalDocument from './pages/legal/LegalDocument';

export default function AppRoutes() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const legal = pathname === '/privacy' || pathname === '/terms';
    const title = pathname === '/privacy' ? 'Privacy Policy' : 'Terms of Service';
    document.title = legal
      ? `${title} (Draft) | PromptHall`
      : 'PromptHall | Managed Website Monitoring for Small Businesses';
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://prompthall.space${legal ? pathname : '/'}`);
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, follow';
    if (legal) document.head.appendChild(robots);
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
    return () => robots.remove();
  }, [pathname, hash]);

  return <Routes>
    <Route path="/" element={<IntelHome />} />
    <Route path="/privacy" element={<LegalDocument kind="privacy" />} />
    <Route path="/terms" element={<LegalDocument kind="terms" />} />
    <Route path="/intel" element={<Navigate to="/" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
