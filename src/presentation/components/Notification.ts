import { NotifTypeEnum } from "../controllers/NotificationController";

export class Notification extends HTMLElement {
  private message: string = '';
  private type: NotifTypeEnum = NotifTypeEnum.INFO;
  private autoCloseTimer?: number;

  constructor() {
    super();
  }

  setContent(
    message: string,
    type: NotifTypeEnum = NotifTypeEnum.INFO
  ): void {
    this.message = message;
    this.type = type;
    this.render();
  }

  show(autocloseMs?: number): void {
    this.style.opacity = '1';
    this.style.pointerEvents = 'auto';

    if (autocloseMs) {
      this.autoCloseTimer = window.setTimeout(() => {
        this.close();
      }, autocloseMs);
    }
  }

  close(): void {
    this.classList.add('closing');
    setTimeout(() => {
      if (this.parentElement) {
        this.parentElement.removeChild(this);
      }
    }, 300);
  }

  private render(): void {
    const emoji = this.getEmoji();
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

if (!customElements.get('app-notification')) {
  customElements.define('app-notification', Notification);
}