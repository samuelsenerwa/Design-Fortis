import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import Navbar from './components/layout/Navbar'
import CustomCursor from './components/motion/CustomCursor'
import PageTransition from './components/motion/PageTransition'
import SmoothScrollProvider from './components/motion/SmoothScrollProvider'
import HomePage from './home/HomePage'
import { SpeedInsights } from '@vercel/speed-insights/react'

// Route-level code-splitting: keeps the lightbox library and secondary-page
// bundles out of the initial Home load.
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Archive = lazy(() => import('./pages/Archive'))
const About = lazy(() => import('./pages/About'))
const ContactUs = lazy(() => import('./pages/ContactUs'))

/**
 * The home and about pages are self-contained experiences (its own header, cursor,
 * scroll engine and footer), so the shared chrome only mounts on other routes.
 */
function Shell() {
  const { dark, toggle } = useTheme()
  const { pathname } = useLocation()
  // Home and About are self-contained (own header, cursor, scroll engine and footer).
  const isHome = pathname === '/' || pathname === '/about'

  return (
    <>
      {!isHome && <CustomCursor />}
      {!isHome && <Navbar dark={dark} toggleTheme={toggle} />}
      <SmoothScrollProvider enabled={!isHome}>
        <PageTransition>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/work/:slug" element={<ProjectDetail dark={dark} />} />
              <Route path="/archive" element={<Archive dark={dark} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactUs dark={dark} />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </SmoothScrollProvider>
    </>
  )
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
      <SpeedInsights />
    </>
  )
}

export default App
