import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GameProvider } from './hooks/useGame.tsx'

// Check for service worker updates every 10 minutes
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    setInterval(() => registration.update(), 10 * 60 * 1000);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
)
