
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('SigaLab: Iniciando montagem do componente root...');

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('SigaLab: Renderização enviada ao DOM.');
  } catch (error) {
    console.error("Erro crítico na renderização do React:", error);
    container.innerHTML = `
      <div style="padding: 40px; color: #ef4444; font-family: sans-serif; text-align: center;">
        <h3>Erro Fatal</h3>
        <p>${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `;
  }
} else {
  console.error("Erro: Elemento #root não encontrado no documento.");
}
