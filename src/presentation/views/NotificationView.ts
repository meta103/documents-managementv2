import { Notification } from '../components/Notification';
import '../components/Notification';
import { NotifTypeEnum } from '../controllers/NotificationController';

export class NotificationView {
  private container: HTMLElement;

  constructor() {
    this.container = this.createContainer();
    document.body.appendChild(this.container);
  }

  //Contenedor fijo para ordenar las notificaciones
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      max-width: 450px;
      width: 100%;
      display: flex;
      flex-direction: column;
      max-height: 80vh;
      overflow-y: auto;
    `;
    return container;
  }

  renderNotification(message: string, type: NotifTypeEnum, duration: number = 5000): void {
    const notif = document.createElement('app-notification') as Notification;
    notif.setContent(message, type);
    notif.style.pointerEvents = 'auto';
    notif.style.width = '100%';
    notif.style.maxWidth = '450px';
    this.container.appendChild(notif);
    notif.show(duration);
  }

  clear(): void {
    this.container.innerHTML = '';
  }
}