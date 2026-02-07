import { useTheme } from './hooks/useTheme'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'

function App() {
  const { dark, toggle } = useTheme()

  return (
    <>
      <Navbar dark={dark} toggleTheme={toggle} />
      <Hero dark={dark} />
    </>
  )
}

export default App
