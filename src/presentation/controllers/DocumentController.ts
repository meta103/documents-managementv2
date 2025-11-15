// Controller: Orquesta Application Service + Views

import { DocumentService } from '../../application/services/DocumentService';
import { EventBus } from '../../infrastructure/event-bus/EventBus';
import { WebSocketService, type WebSocketNotificationService } from '../../infrastructure/services/WebSocketService';
import { Grid } from '../components/Grid';
import { SortBar } from '../components/SortBar';
import type { DocumentsGridView } from '../views/DocumentsGridView';
import { NotificationView } from '../views/NotificationView';

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
  private currentSortBy: 'name' | 'version' | 'createdDate' = 'name';
  private allDocuments: any[] = [];
  private unsubscribers: Array<() => void> = [];

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

      // Guarda copia para usar en sort
      this.allDocuments = documents;
      //2. Render grid
      const sorted = this.applyCurrentSort(documents);
      this.gridView.render(sorted);
      //3. Setup listeners via EventBus
      this.setupEventListeners();

      // 2. Suscribe la vista a cambios del repositorio
      // Cuando el repositorio cambia, la vista se actualiza automáticamente
      //TODO: Esto hace algo? 
      this.documentService.observeDocuments(docs => {
        console.log('🔄 Documents changed, updating view...');
        console.log(docs);
        this.allDocuments = docs;
        const sorted = this.applyCurrentSort(docs);
        this.gridView.render(sorted);
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

  /**
   * Setup listeners via EventBus
   * 
   * Ventajas vs addEventListener:
   * - Type-safe: TypeScript valida eventos y payloads
   * - Centralized: Un único punto de verdad
   * - Easy cleanup: guardamos unsubscribers
   * - Debuggable: console.log en EventBus
   */
  private setupEventListeners(): void {
    // Listener para SORT_CHANGED
    const unsubscribeSort = EventBus.on('SORT_CHANGED', (payload) => {
      this.currentSortBy = payload.sortBy;
      console.log(`🔄 Sort changed to: ${this.currentSortBy}`);

      const sorted = this.applyCurrentSort(this.allDocuments);
      this.gridView.render(sorted);
    });

    this.unsubscribers.push(unsubscribeSort);
  }

  /**
   * Aplica el sort actual a los documentos
   */
  private applyCurrentSort(documents: any[]): any[] {
    console.log(`Sorting by ${this.currentSortBy}...`);
    return this.documentService.sortDocumentsSync(
      documents,
      this.currentSortBy
    );
  }

  /**
   * Limpieza: desuscribir de todos los eventos
   * (útil si el controller se destruye)
   */
  destroy(): void {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
    this.unsubscribers = [];
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