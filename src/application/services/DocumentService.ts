// Application Service: Orquesta Domain + Infrastructure

import { type Document, DocumentSorter, SortBy } from '../../domain/Document';
import { DocumentMapper } from '../../infrastructure/mappers/DocumentMapper';
import type { DocumentRepository } from '../../infrastructure/repositories/DocumentRepository';
import { ApiService } from '../../infrastructure/services/ApiService';

/**
 * DocumentService - Application Service
 * 
 * Responsabilidades:
 * - Orquestar casos de uso (Load Documents, etc)
 * - Coordinar Domain + Infrastructure
 * - Validar invariantes de negocio
 * 
 * Ventaja: Controller NO necesita saber detalles de persistencia
 */
export class DocumentService {
  constructor(
    private repository: DocumentRepository,
    private apiService: ApiService
  ) { }

  /**
   * Caso de uso: Cargar todos los documentos
   * 
   * Flujo:
   * 1. Obtiene datos del API
   * 2. Mapea al modelo de dominio
   * 3. Valida cada documento
   * 4. Guarda en el repositorio
   * 5. Retorna documentos válidos
   */
  async loadAllDocuments(): Promise<Document[]> {
    try {
      // 1. Obtiene datos del servidor
      const rawDocuments = await this.apiService.getDocuments();

      // 2. Mapea a nuestro modelo
      const documents = rawDocuments.map(raw => DocumentMapper.toDomain(raw));

      // 3. Guarda en repositorio
      //TODO: el save hace algo??? 
      await this.repository.save(documents);

      // 4. Retorna documentos
      return documents;
    } catch (error) {
      console.error('Error loading documents:', error);
      throw new Error('Failed to load documents');
    }
  }

  /**
   * Caso de uso: Obtener todos los documentos del repositorio
   */
  async getAllDocuments(): Promise<Document[]> {
    return this.repository.getAll();
  }

  sortDocumentsSync({
    documents,
    sortBy = SortBy.DATE
  }: { documents: Document[], sortBy: SortBy }): Document[] {
    return DocumentSorter.sort(documents, sortBy, 'asc');
  }

  observeDocuments(observer: (docs: Document[]) => void): () => void {
    return this.repository.subscribe(observer);
  }
}