import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <p style={{ fontFamily: 'Inter, sans-serif', padding: 24 }}>
      FABi Design System — run <code>npm run storybook</code>
    </p>
  </StrictMode>,
)
