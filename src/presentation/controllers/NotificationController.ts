import { NotificationView } from '../views/NotificationView';

export enum NotifTypeEnum {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger'
}

export class NotificationController {
  private notificationView: NotificationView;

  constructor(notificationView: NotificationView) {
    this.notificationView = notificationView;
  }

  show(message: string, duration: number = 5000, type: NotifTypeEnum = NotifTypeEnum.INFO) {
    this.notificationView.renderNotification(message, type, duration);
  }

  success(message: string, duration?: number): void {
    this.show(message, duration, NotifTypeEnum.SUCCESS);
  }

  error(message: string, duration?: number): void {
    this.show(message, duration, NotifTypeEnum.DANGER);
  }

  warning(message: string, duration?: number): void {
    this.show(message, duration, NotifTypeEnum.WARNING);
  }

  info(message: string, duration?: number): void {
    this.show(message, duration, NotifTypeEnum.INFO);
  }

  clear(): void {
    this.notificationView.clear();
  }
}
