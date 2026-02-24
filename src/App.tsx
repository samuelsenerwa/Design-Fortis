import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import ProjectGrid from './components/sections/ProjectGrid'
import ProjectDetail from './pages/ProjectDetail'
import Archive from './pages/Archive'
import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  const { dark, toggle } = useTheme()

  return (
    <>
    <BrowserRouter>
      <Navbar dark={dark} toggleTheme={toggle} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero dark={dark} />
              <ProjectGrid dark={dark} />
            </>
          }
        />
        <Route path="/work/:slug" element={<ProjectDetail dark={dark} />} />
        <Route path="/archive" element={<Archive dark={dark} />} />
      </Routes>
    </BrowserRouter>
    <SpeedInsights />
    </>
  )
}

export default App
