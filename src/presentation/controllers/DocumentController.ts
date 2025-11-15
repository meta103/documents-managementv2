// Controller: Orquesta Application Service + Views

import { DocumentService } from '../../application/services/DocumentService';
import { WebSocketService, type WebSocketNotificationService } from '../../infrastructure/services/WebSocketService';
import type { DocumentsGridView } from '../views/DocumentsGridView';
import { NotificationView } from '../views/NotificationView';
import { SortBar } from '../components/SortBar';
import { Grid } from '../components/Grid';

/**
 * DocumentController - Controlador MVC
 * 
 * Responsabilidades:
 * 1. Recibir eventos del usuario
 * 2. Llamar a Application Service (casos de uso)
 * 3. Actualizar vistas con los resultados
 * 4. Manejar notificaciones
 * 
 * Ventaja: Desacoplado de detalles técnicos (API, persistencia, etc)
 */
export class DocumentController {
  private sortBar: SortBar | null = null;
  private grid: Grid | null = null;

  constructor(
    private documentService: DocumentService,
    private wsService: WebSocketService,
    private gridView: DocumentsGridView,
    private notificationView: NotificationView
  ) { }

  /**
   * Inicializa el controlador
   * Flujo:
   * 1. Carga documentos del servidor (via ApplicationService)
   * 2. Suscribe vista a cambios del repositorio
   * 3. Conecta WebSocket para notificaciones en tiempo real
   */
  async initialize(): Promise<void> {
    try {
      console.log('📥 Loading documents...');

      // 1. Carga documentos (Application Service se encarga de todo)
      const documents = await this.documentService.loadAllDocuments();
      // Muestra notificación
      this.notificationView.success(`Loaded ${documents.length} documents`);
      this.gridView.render(documents);
      // 2. Suscribe la vista a cambios del repositorio
      // Cuando el repositorio cambia, la vista se actualiza automáticamente
      //TODO: Esto hace algo? 
      this.documentService.observeDocuments(docs => {
        console.log('🔄 Documents changed, updating view...');
        const sortBy = this.sortBar?.getSortBy() || 'name';
        const order = this.sortBar?.getOrder() || 'asc';
        this.renderWithSort(docs, sortBy, order);
        /* this.gridView.render(docs); */
      });

      // 3. Conecta WebSocket para notificaciones en tiempo real
      console.log('🔗 Connecting WebSocket...');
      try {
        await this.wsService.connect();
        console.log('✅ WebSocket connected');

        // Muestra notificación de conexión
        this.notificationView.info('Connected to real-time notifications');

        // Suscribe a notificaciones de WebSocket
        this.wsService.subscribe((notification: WebSocketNotificationService) => {
          this.handleNewDocumentNotification(notification);
        });
      } catch (error) {
        console.error('⚠️ WebSocket connection failed:', error);
        // App sigue funcionando sin WebSocket
        this.notificationView.warning(
          'Real-time notifications unavailable',
          7000
        );
      }

      console.log('✅ Controller initialized successfully');
    } catch (error) {
      console.error('❌ Controller initialization failed:', error);
      this.notificationView.error('Failed to load documents', 10000);
      throw error;
    }
  }

  private async renderWithSort(
    documents: any[],
    sortBy: 'name' | 'version' | 'createdDate',
    order: 'asc' | 'desc'
  ): Promise<void> {
    const sorted = await this.documentService.getDocumentsSorted(sortBy, order);
    console.log(sorted);

    this.gridView.render(sorted);
  }

  /**
   * Maneja notificación de nuevo documento creado por otro usuario
   * 
   * WebSocket notifica: "Otro usuario creó un documento"
   * Mostramos una notificación visual al usuario
   */
  private handleNewDocumentNotification(
    notification: WebSocketNotificationService
  ): void {
    const message = `${notification.UserName} created "${notification.DocumentTitle}"`;

    // Muestra notificación visual
    /* this.notificationView.info(message, 6000); */

    // Nota: En el futuro, aquí podríamos:
    // - Cargar el nuevo documento automáticamente
    // - Añadirlo al grid sin recargar
    // - Hacer refresh de los datos
  }
}