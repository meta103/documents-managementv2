import { CreateDocumentCommand } from '../../application/commands/CreateDocumentCommand';
import { DocumentService } from '../../application/services/DocumentService';
import { Document, SortByEnum } from '../../domain/Document';
import { EventBus } from '../../infrastructure/event-bus/EventBus';
import type { IDocumentRepository } from '../../infrastructure/repositories/IDocumentRepository';
import { WebSocketService, type WebSocketNotificationService } from '../../infrastructure/services/WebSocketService';
import { CreateDocumentModal, type FormData } from '../components/CreateDocumentModal';
import { DocumentsGridView } from '../views/DocumentsGridView';
import { NotificationController } from '../controllers/NotificationController';

export class DocumentController {
  private currentSortBy: SortByEnum = SortByEnum.DATE;
  private allDocuments: any[] = [];
  private createDocumentCommand: CreateDocumentCommand;
  private unsubscribers: Array<() => void> = [];

  constructor(
    private documentService: DocumentService,
    private wsService: WebSocketService,
    private gridView: DocumentsGridView,
    private notificationController: NotificationController,
    documentRepository: IDocumentRepository
  ) {
    this.createDocumentCommand = new CreateDocumentCommand(documentRepository);
  }

  async initialize(): Promise<void> {
    try {
      // 1. Cargar documentos
      const documents = await this.documentService.loadAllDocuments();
      this.notificationController.success(`Loaded ${documents.length} documents`);
      this.allDocuments = documents;

      // 2. Renderizar
      const sorted = this.documentService.sortDocumentsSync({ documents, sortBy: this.currentSortBy });
      this.gridView.render(sorted);

      // 4. Setup listeners via EventBus
      this.setupEventListeners();

      // 5. Suscribir a cambios del repositorio
      await this.documentService.observeDocuments((docs: Document[]) => {
        this.allDocuments = docs;
        const sorted = this.documentService.sortDocumentsSync({ documents: docs, sortBy: this.currentSortBy });
        this.gridView.render(sorted);
      });

      // 6. WebSocket
      try {
        await this.wsService.connect();
        this.wsService.subscribe((notification: WebSocketNotificationService) => {
          const msg = `${notification.UserName} created "${notification.DocumentTitle}"`;
          this.notificationController.info(msg, 6000);
        });
      } catch (error) {
        this.notificationController.warning('Real-time unavailable', 7000);
      }
    } catch (error) {
      this.notificationController.error(error instanceof Error ? error.message : 'Failed to load documents', 10000);
      throw error;
    }
  }

  private openCreateDocumentModal(): void {
    const modal = CreateDocumentModal(
      async (formData) => {
        await this.handleCreateDocument(formData);
      },
      () => {
        console.log('Modal cancelado');
      }
    );

    document.body.appendChild(modal);
  }

  private async handleCreateDocument(formData: FormData): Promise<void> {
    try {
      const newDocument = await this.createDocumentCommand.execute(formData);
      this.notificationController.success(`Document "${newDocument.title}" created!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create document';
      this.notificationController.error(message, 1000);
      throw error;
    }
  }

  private setupEventListeners(): void {
    const unsubscribeSort = EventBus.on('SORT_CHANGED', ({ sortBy }) => {
      const sorted = this.documentService.sortDocumentsSync({ documents: this.allDocuments, sortBy });
      this.currentSortBy = sortBy;
      this.gridView.render(sorted);
    });

    const unsubscribeShowModal = EventBus.on('SHOW_MODAL', () => {
      this.openCreateDocumentModal();
    });

    this.unsubscribers.push(unsubscribeSort);
    this.unsubscribers.push(unsubscribeShowModal)
  }

  //limpiar listeners
  destroy(): void {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
    this.unsubscribers = [];
  }
}