import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Routes, Route, useLocation, useParams } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import Navbar from './components/layout/Navbar'
import CustomCursor from './components/motion/CustomCursor'
import PageTransition from './components/motion/PageTransition'
import SmoothScrollProvider from './components/motion/SmoothScrollProvider'
import HomePage from './home/HomePage'
import { isLvPath } from './home/pageTransition'
import { SpeedInsights } from '@vercel/speed-insights/react'

// Route-level code-splitting: keeps the lightbox library and secondary-page
// bundles out of the initial Home load.
const Projects = lazy(() => import('./pages/Projects'))
const Project = lazy(() => import('./pages/Project'))
const Archive = lazy(() => import('./pages/Archive'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

/** Old case-study URLs keep working. */
function LegacyProjectRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/projects/${slug}`} replace />
}

/**
 * Home, About and the projects pages are self-contained experiences (their own header,
 * cursor, scroll engine and footer), so the shared chrome only mounts on other routes.
 */
function Shell() {
  const { dark, toggle } = useTheme()
  const { pathname } = useLocation()
  const isHome = isLvPath(pathname)

  return (
    <>
      {!isHome && <CustomCursor />}
      {!isHome && <Navbar dark={dark} toggleTheme={toggle} />}
      <SmoothScrollProvider enabled={!isHome}>
        <PageTransition>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<Project />} />
              <Route path="/work/:slug" element={<LegacyProjectRedirect />} />
              <Route path="/archive" element={<Archive dark={dark} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
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
