// src/components/Notification.ts
// Custom Element SIN Shadow DOM - Recibe estilos Bulma directamente

/**
 * Notification - Web Component sin Shadow DOM
 * Recibe todos los estilos Bulma del documento principal
 * 
 * Uso:
 * const notif = document.createElement('app-notification') as Notification;
 * notif.setContent('Mensaje', 'success');
 * notif.show(5000);
 * document.body.appendChild(notif);
 */
export class Notification extends HTMLElement {
  private message: string = '';
  private type: 'success' | 'info' | 'warning' | 'danger' = 'info';
  private autoCloseTimer: number | null = null;

  constructor() {
    super();
    // ❌ NO usamos Shadow DOM
    // this.attachShadow({ mode: 'open' });
  }

  /**
   * Setea el contenido del mensaje y tipo
   */
  setContent(
    message: string,
    type: 'success' | 'info' | 'warning' | 'danger' = 'info'
  ): void {
    this.message = message;
    this.type = type;
    this.render();
  }

  /**
   * Muestra la notificación y opcionalmente auto-cierra
   */
  show(autocloseMs?: number): void {
    this.style.opacity = '1';
    this.style.pointerEvents = 'auto';

    if (autocloseMs) {
      this.autoCloseTimer = window.setTimeout(() => {
        this.close();
      }, autocloseMs);
    }
  }

  /**
   * Cierra la notificación con animación
   */
  close(): void {
    this.classList.add('closing');
    setTimeout(() => {
      if (this.parentElement) {
        this.parentElement.removeChild(this);
      }
    }, 300);
  }

  /**
   * Recibe estilos Bulma directamente del documento
   */
  private render(): void {
    const emoji = this.getEmoji();

    // Usa className en lugar de Shadow DOM innerHTML
    this.className = `message is-${this.type}`;
    this.style.cssText = `
      display: block;
      margin-bottom: 1rem;
      animation: slideIn 0.3s ease-out;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    this.innerHTML = `
      <div class="notification is-${this.type} is-light">
          <div>
            ${emoji} ${this.message}
          </div>
          <button class="delete"></button>
      </div>  
    `;

    // Event listener para cerrar
    const closeBtn = this.querySelector('.delete');
    closeBtn?.addEventListener('click', () => this.close());

    // Inyecta animación CSS
    if (!this.style.animation) {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(120%);
            opacity: 0;
          }
        }

        app-notification {
          animation: slideIn 0.3s ease-out;
        }

        app-notification.closing {
          animation: slideOut 0.3s ease-out forwards;
        }
      `;
      document.head.appendChild(style);
    }
  }

  private getEmoji(): string {
    switch (this.type) {
      case 'success':
        return '✅';
      case 'danger':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  }
}

// Registra el custom element
customElements.define('app-notification', Notification);