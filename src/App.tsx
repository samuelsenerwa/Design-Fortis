import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Gallery from './components/Gallery'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <>
      <div className="flex items-center justify-end w-full absolute top-4 right-4">
        <button
          onClick={() => setDark(!dark)}
          className="rounded-full border border-border bg-accent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl font-bold text-foreground mt-10">Vite + React</h1>
      <div className="card">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="rounded-lg border border-border bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          count is {count}
        </button>
        <p className="text-foreground mt-4">
          Edit <code className="bg-muted px-1.5 py-0.5 rounded text-sm">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-muted-foreground">
        Click on the Vite and React logos to learn more
      </p>

      <Gallery />
    </>
  )
}

export default App
