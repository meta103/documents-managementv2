
import { Notification } from '../components/Notification';

/**
 * NotificationView - Crea notificaciones apiladas verticalmente
 * Cada notificación se acumula debajo de la anterior
 */
export class NotificationView {
  private container: HTMLElement;

  constructor() {
    this.container = this.createContainer();
    document.body.appendChild(this.container);
  }

  /**
   * Crea contenedor fijo para apilar notificaciones
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 9999;
      max-width: 450px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      pointer-events: none;
      max-height: 80vh;
      overflow-y: auto;
    `;
    return container;
  }

  /**
   * Muestra una notificación individual apilada
   * @param message Mensaje a mostrar
   * @param duration Duración en ms antes de auto-cerrar
   * @param type Tipo de notificación
   */
  show(
    message: string,
    duration: number = 5000,
    type: 'success' | 'info' | 'warning' | 'danger' = 'info'
  ): void {
    // Crea el elemento Notification
    const notif = document.createElement('app-notification') as Notification;

    // Inyecta el contenido
    notif.setContent(message, type);

    // Estilos para apilamiento
    notif.style.pointerEvents = 'auto';
    notif.style.width = '100%';
    notif.style.maxWidth = '450px';

    // Añade al contenedor (se apila automáticamente)
    this.container.appendChild(notif);

    // Muestra con auto-cierre
    notif.show(duration);
  }

  /**
   * Muestra notificación de éxito
   */
  success(message: string, duration?: number): void {
    this.show(message, duration, 'success');
  }

  /**
   * Muestra notificación de error
   */
  error(message: string, duration?: number): void {
    this.show(message, duration, 'danger');
  }

  /**
   * Muestra notificación de advertencia
   */
  warning(message: string, duration?: number): void {
    this.show(message, duration, 'warning');
  }

  /**
   * Muestra notificación informativa
   */
  info(message: string, duration?: number): void {
    this.show(message, duration, 'info');
  }

  /**
   * Limpia todas las notificaciones
   */
  clear(): void {
    this.container.innerHTML = '';
  }
}