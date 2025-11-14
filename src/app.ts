import { DocumentService } from "./application/services/DocumentService";
import { DocumentRepository } from "./infrastructure/repositories/DocumentRepository";
import { ApiService } from "./infrastructure/services/ApiService";
import { WebSocketService } from "./infrastructure/services/WebSocketService";
import { DocumentController } from "./presentation/controllers/DocumentController";
import { DocumentsGridView } from "./presentation/views/DocumentsGridView";
import { NotificationView } from "./presentation/views/NotificationView";


export class App {
  private rootElement: HTMLElement;
  private documentsController: DocumentController;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;

    // ===== INFRASTRUCTURE LAYER =====
    const apiService = new ApiService();
    const wsService = new WebSocketService();
    const documentRepository = new DocumentRepository();

    // ===== APPLICATION LAYER =====
    const documentService = new DocumentService(
      documentRepository,
      apiService
    );

    // ===== PRESENTATION LAYER =====
    const gridView = new DocumentsGridView(this.rootElement);
    const notificationView = new NotificationView();

    // ===== CONTROLLERS (orquestan presentation + application) =====
    this.documentsController = new DocumentController(
      documentService,
      wsService,
      gridView,
      notificationView
    );
  }

  async initialize(): Promise<void> {
    try {
      //Inicializa el controlador, que hace todo lo demas.
      await this.documentsController.initialize();
    } catch (error) {
      console.error("Failed to initialize app:", error);
      throw error;
    }
  }
}