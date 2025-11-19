import { App } from "./app";
import { registerCustomElements } from './bootstrap/registerCustomElements';
import './styles/main.css';

function startApp(): void {
  const rootElement = document.getElementById('app');
  if (!rootElement) {
    console.error("Root element not found in index.html");
    return;
  }

  try {
    // registrar los custom elements antes de iniciar la app
    registerCustomElements();

    //Instancia la app con el elemeneto raiz
    const app = new App(rootElement);
    //Inicia la App
    app.initialize();
  } catch (error) {
    console.error("Error initializing the app:", error);
    return;
  }
}

//iniciar la app cuando el dom este ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}