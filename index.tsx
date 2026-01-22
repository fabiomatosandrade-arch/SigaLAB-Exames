
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('SigaLab: Ponto de entrada index.tsx alcançado.');

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('SigaLab: Montagem do React solicitada.');
  } catch (error) {
    console.error("SigaLab: Erro fatal ao montar React:", error);
    container.innerHTML = `
      <div style="padding: 40px; color: #ef4444; font-family: sans-serif; text-align: center;">
        <h3>Erro de Renderização</h3>
        <p>${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `;
  }
} else {
  console.error("SigaLab: Falha crítica - Elemento #root não encontrado.");
}
