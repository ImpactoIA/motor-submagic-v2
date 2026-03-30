import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundaryWrapper } from './components/ErrorBoundary.tsx'
import './index.css' // 🔥 Vital: Importa el diseño "Industrial Premium"

// Verificación de seguridad para evitar pantallas blancas si falta el ID 'root'
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("FATAL: No se encontró el elemento raíz 'root' en el HTML.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundaryWrapper>
      <App />
    </ErrorBoundaryWrapper>
  </React.StrictMode>,
)
