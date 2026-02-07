import { useTheme } from './hooks/useTheme'
import Navbar from './components/layout/Navbar'

function App() {
  const { dark, toggle } = useTheme()

  return (
    <>
      <Navbar dark={dark} toggleTheme={toggle} />
      <main className="pt-16">
        <h1 className="text-3xl font-bold text-foreground text-center mt-20">
          Design Fortis
        </h1>
      </main>
    </>
  )
}

export default App
