
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Erro crítico na renderização:", error);
    container.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
      <h3>Erro de Inicialização</h3>
      <p>${error instanceof Error ? error.message : String(error)}</p>
    </div>`;
  }
} else {
  console.error("Elemento #root não encontrado.");
}
