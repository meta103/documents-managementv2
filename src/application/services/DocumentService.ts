import { type Document, DocumentSorter, SortByEnum } from '../../domain/Document';
import { DocumentMapper } from '../../infrastructure/mappers/DocumentMapper';
import type { DocumentRepository } from '../../infrastructure/repositories/DocumentRepository';
import { ApiService } from '../../infrastructure/services/ApiService';

export class DocumentService {
  constructor(
    private repository: DocumentRepository,
    private apiService: ApiService
  ) { }

  async loadAllDocuments(): Promise<Document[]> {
    try {
      // 1. Obtiene datos del servidor
      const rawDocuments = await this.apiService.getDocuments();

      // 2. Mapea a nuestro modelo
      const documents = rawDocuments.map(raw => DocumentMapper.toDomain(raw));

      // 3. Guarda en repositorio local
      await this.repository.save(documents);

      // 4. Retorna documentos
      return documents;
    } catch (error) {
      throw new Error('Failed to load documents');
    }
  }

  sortDocumentsSync({
    documents,
    sortBy = SortByEnum.DATE
  }: { documents: Document[], sortBy: SortByEnum }): Document[] {
    return DocumentSorter.sort(documents, sortBy, 'asc');
  }

  observeDocuments(observer: (docs: Document[]) => void): () => void {
    return this.repository.subscribe(observer);
  }
}