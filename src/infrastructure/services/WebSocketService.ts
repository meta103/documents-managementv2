export interface WebSocketNotificationService {
  Timestamp: string;
  UserId: string;
  UserName: string;
  DocumentID: string;
  DocumentTitle: string;
};

type NotificationHandler = (notification: WebSocketNotificationService) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string = 'ws://localhost:8080/notifications';
  private reconnectAttempt: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 2000;
  private handlers: NotificationHandler[] = [];
  private isManuallyClosed: boolean = false;

  /* Conect to WebSocket server */

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isManuallyClosed = false;
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.reconnectAttempt = 0;
          this.isManuallyClosed = false;
          resolve();
        };

        this.ws.onmessage = (event: MessageEvent) => {
          const notification: WebSocketNotificationService = JSON.parse(event.data);
          this.handlers.forEach(handler => handler(notification));
        };

        this.ws.onclose = () => {
          if (!this.isManuallyClosed) {
            this.reconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    })
  }

  subscribe(handler: NotificationHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    }
  };

  disconnect(): void {
    this.isManuallyClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempt < this.maxReconnectAttempts) {
      this.reconnectAttempt++;
      const delay = this.reconnectDelay * this.reconnectAttempt;
      setTimeout(() => {
        this.connect().catch((error) => { console.error("Reconnection failed:", error); });
      }, delay)
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}