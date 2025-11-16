import { DocumentService } from '../../application/services/DocumentService';
import { CreateDocumentCommand } from '../../application/commands/CreateDocumentCommand';
import { WebSocketService, type WebSocketNotificationService } from '../../infrastructure/services/WebSocketService';
import { DocumentsGridView } from '../views/DocumentsGridView';
import { NotificationView } from '../views/NotificationView';
import { EventBus } from '../../infrastructure/event-bus/EventBus';
import { createCreateDocumentModal, type FormData } from '../components/CreateDocumentModal';
import { DocumentRepository } from '../../infrastructure/repositories/DocumentRepository';
import type { IDocumentRepository } from '../../infrastructure/repositories/IDocumentRepository';

/**
 * DocumentController - SIMPLIFICADO
 * SortBar es Web Component que se auto-renderiza
 */
export class DocumentController {
  private currentSortBy: 'name' | 'version' | 'createdDate' = 'createdDate';
  private allDocuments: any[] = [];
  private createDocumentCommand: CreateDocumentCommand;
  private unsubscribers: Array<() => void> = [];

  constructor(
    private documentService: DocumentService,
    private wsService: WebSocketService,
    private gridView: DocumentsGridView,
    private notificationView: NotificationView,
    documentRepository: IDocumentRepository
  ) {
    this.createDocumentCommand = new CreateDocumentCommand(documentRepository);
  }

  async initialize(): Promise<void> {
    try {
      console.log('📥 Loading documents...');

      // 1. Cargar documentos
      const documents = await this.documentService.loadAllDocuments();
      console.log(`✅ Loaded ${documents.length} documents`);
      this.notificationView.success(`Loaded ${documents.length} documents`);
      this.allDocuments = documents;

      EventBus.emit('DOCUMENTS_LOADED', { count: documents.length });

      // 2. Renderizar (inyecta <app-sort-bar> que se auto-renderiza)
      this.gridView.render(documents);

      // 4. Setup listeners via EventBus
      this.setupEventListeners();

      // 5. Suscribir a cambios del repositorio
      await this.documentService.observeDocuments(docs => {
        console.log('🔄 Documents changed in repository');
        this.allDocuments = docs;
        const sorted = this.applyCurrentSort(docs);
        this.gridView.render(sorted);
      });

      // 6. WebSocket
      try {
        await this.wsService.connect();
        console.log('✅ WebSocket connected');
        this.notificationView.info('Connected to real-time notifications');

        this.wsService.subscribe((notification: WebSocketNotificationService) => {
          const msg = `${notification.UserName} created "${notification.DocumentTitle}"`;
          /* this.notificationView.info(msg, 6000); */
        });
      } catch (error) {
        console.error('⚠️ WebSocket failed:', error);
        this.notificationView.warning('Real-time unavailable', 7000);
      }

      console.log('✅ Controller initialized');
    } catch (error) {
      console.error('❌ Init failed:', error);
      this.notificationView.error('Failed to load documents', 10000);
      throw error;
    }
  }

  /**
   * Abre el modal de crear documento
   */
  private openCreateDocumentModal(): void {
    const modal = createCreateDocumentModal(
      async (formData) => {
        await this.handleCreateDocument(formData);
      },
      () => {
        console.log('Modal cancelado');
      }
    );

    document.body.appendChild(modal);
  }

  /**
   * Maneja la creación de documento
   */
  private async handleCreateDocument(formData: FormData): Promise<void> {
    try {
      console.log('📝 Creating document...', formData);

      if (!this.createDocumentCommand) {
        throw new Error('CreateDocumentCommand not initialized');
      }

      const newDocument = await this.createDocumentCommand.execute(formData);

      console.log('✅ Document created:', newDocument);

      EventBus.emit('DOCUMENT_CREATED', { documentId: newDocument.id });

      this.notificationView.success(`Document "${newDocument.title}" created!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create document';
      console.error('❌ Error creating document:', error);
      this.notificationView.error(message, 8000);
      throw error;
    }
  }

  /**
   * Setup listeners via EventBus
   */
  private setupEventListeners(): void {
    const unsubscribeSort = EventBus.on('SORT_CHANGED', (payload) => {
      this.currentSortBy = payload.sortBy;
      console.log(`🔄 Sort changed to: ${this.currentSortBy}`);

      const sorted = this.applyCurrentSort(this.allDocuments);
      this.gridView.render(sorted);
    });

    const unsubscribeShowModal = EventBus.on('SHOW_MODAL', (payload) => {
      console.log(`🔄 Show modal to: ${payload.show}`);
      this.openCreateDocumentModal();


    });

    this.unsubscribers.push(unsubscribeSort);
    this.unsubscribers.push(unsubscribeShowModal)
  }

  /**
   * Aplica el sort actual
   */
  private applyCurrentSort(documents: any[]): any[] {
    console.log(`Sorting by ${this.currentSortBy}...`);
    return this.documentService.sortDocumentsSync(
      documents,
      this.currentSortBy
    );
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
    this.unsubscribers = [];
  }
}