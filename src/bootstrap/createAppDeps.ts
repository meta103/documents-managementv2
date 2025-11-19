import { DocumentService } from '../application/services/DocumentService';
import { DocumentRepository } from '../infrastructure/repositories/DocumentRepository';
import { ApiService } from '../infrastructure/services/ApiService';
import { WebSocketService } from '../infrastructure/services/WebSocketService';
import { NotificationController } from '../presentation/controllers/NotificationController';
import { DocumentsGridView } from '../presentation/views/DocumentsGridView';
import { NotificationView } from '../presentation/views/NotificationView';

export interface AppDeps {
  apiService?: ApiService;
  wsService?: WebSocketService;
  documentRepository?: DocumentRepository;
  documentService?: DocumentService;
  gridView?: DocumentsGridView;
  notificationView?: NotificationView;
  notificationController?: NotificationController;
}

export function createAppDeps(rootElement: HTMLElement): AppDeps {
  const apiService = new ApiService();
  const wsService = new WebSocketService();
  const documentRepository = new DocumentRepository();
  const documentService = new DocumentService(documentRepository, apiService);
  const gridView = new DocumentsGridView(rootElement);
  const notificationView = new NotificationView();
  const notificationController = new NotificationController(notificationView);

  return {
    apiService,
    wsService,
    documentRepository,
    documentService,
    gridView,
    notificationView,
    notificationController,
  };
}
