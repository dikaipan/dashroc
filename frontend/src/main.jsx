import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Get root element
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a <div id="root"></div> in your HTML.')
}

// Create root and render with error handling
let root = null

try {
  root = ReactDOM.createRoot(rootElement)
  
  // Use StrictMode only in development for better performance in production
  const isDevelopment = import.meta.env.DEV;
  
  root.render(
    isDevelopment ? (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    ) : (
      <App />
    )
  )
} catch (error) {
  console.error('Failed to render React app with StrictMode:', error)
  
  // Fallback: try rendering without StrictMode
  if (root) {
    try {
      root.render(<App />)
      console.warn('App rendered without StrictMode due to error')
    } catch (fallbackError) {
      console.error('Failed to render even without StrictMode:', fallbackError)
      showErrorFallback(rootElement, error)
    }
  } else {
    // If root creation failed, show error message
    showErrorFallback(rootElement, error)
  }
}

function showErrorFallback(element, error) {
  element.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; max-width: 600px; margin: 50px auto;">
      <h1 style="color: #ef4444;">Application Error</h1>
      <p>Failed to initialize React application.</p>
      <details style="margin: 20px 0; padding: 10px; background: #f3f4f6; border-radius: 4px;">
        <summary style="cursor: pointer; font-weight: bold;">Error Details</summary>
        <pre style="margin-top: 10px; overflow: auto; font-size: 12px;">${error.message}\n${error.stack || ''}</pre>
      </details>
      <button onclick="window.location.reload()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
        Reload Page
      </button>
    </div>
  `
}