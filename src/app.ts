import { DocumentService } from "./application/services/DocumentService";
import { DocumentRepository } from "./infrastructure/repositories/DocumentRepository";
import { ApiService } from "./infrastructure/services/ApiService";
import { WebSocketService } from "./infrastructure/services/WebSocketService";
import { DocumentController } from "./presentation/controllers/DocumentController";
import { NotificationController } from "./presentation/controllers/NotificationController";
import { DocumentsGridView } from "./presentation/views/DocumentsGridView";
import { NotificationView } from "./presentation/views/NotificationView";

export class App {
  private rootElement: HTMLElement;
  private documentsController: DocumentController;


  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;

    //Infrastructure Layer
    const apiService = new ApiService();
    const wsService = new WebSocketService();
    const documentRepository = new DocumentRepository();

    //Application Layer
    const documentService = new DocumentService(
      documentRepository,
      apiService
    );

    //Presentation Layer
    const gridView = new DocumentsGridView(this.rootElement);
    const notificationView = new NotificationView();

    //Controllers Layer
    const notificationController = new NotificationController(notificationView);
    this.documentsController = new DocumentController(
      documentService,
      wsService,
      gridView,
      notificationController,
      documentRepository
    );

  }

  async initialize(): Promise<void> {
    try {
      await this.documentsController.initialize();
    } catch (error) {
      console.error("Failed to initialize app:", error);
      throw error;
    }
  }
}