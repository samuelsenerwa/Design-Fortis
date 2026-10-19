import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import HomeAbout from './components/sections/HomeAbout'
import HomeProjects from './components/sections/HomeProjects'
import ServicesSection from './components/sections/ServicesSection'
import Preloader from './components/motion/Preloader'
import CustomCursor from './components/motion/CustomCursor'
import PageTransition from './components/motion/PageTransition'
import SmoothScrollProvider from './components/motion/SmoothScrollProvider'
import { SpeedInsights } from '@vercel/speed-insights/react'

// Route-level code-splitting: keeps the lightbox library and secondary-page
// bundles out of the initial Home load.
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Archive = lazy(() => import('./pages/Archive'))
const About = lazy(() => import('./pages/About'))
const ContactUs = lazy(() => import('./pages/ContactUs'))

function Home({ dark }: { dark: boolean }) {
  return (
    <>
      <Hero />
      <HomeAbout dark={dark} />
      <HomeProjects dark={dark} />
      <ServicesSection dark={dark} />
      <Footer dark={dark} />
    </>
  )
}

function App() {
  const { dark, toggle } = useTheme()

  return (
    <>
      <BrowserRouter>
        <Preloader />
        <CustomCursor />
        <Navbar dark={dark} toggleTheme={toggle} />
        <SmoothScrollProvider>
          <PageTransition>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home dark={dark} />} />
                <Route path="/work/:slug" element={<ProjectDetail dark={dark} />} />
                <Route path="/archive" element={<Archive dark={dark} />} />
                <Route path="/about" element={<About dark={dark} />} />
                <Route path="/contact" element={<ContactUs dark={dark} />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </SmoothScrollProvider>
      </BrowserRouter>
      <SpeedInsights />
    </>
  )
}

export default App
