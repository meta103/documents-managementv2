// Application Service: Orquesta Domain + Infrastructure

import { type Document, DocumentValidator } from '../../domain/Document';
import { ApiService } from '../../infrastructure/services/ApiService';
import { DocumentMapper } from '../../infrastructure/mappers/DocumentMapper';
import type { IDocumentRepository } from '../../infrastructure/repositories/IDocumentRepository';

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
    private repository: IDocumentRepository,
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

      // 3. Valida cada documento
      const validDocuments = documents.filter(doc => {
        const validation = DocumentValidator.validate(doc);
        if (!validation.valid) {
          console.warn(`Invalid document ${doc.id}:`, validation.errors);
        }
        return validation.valid;
      });

      // 4. Guarda en repositorio
      //TODO: el save hace algo??? 
      /* await this.repository.save(validDocuments); */

      // 5. Retorna documentos
      return validDocuments;
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

  observeDocuments(observer: (docs: Document[]) => void): () => void {
    return this.repository.subscribe(observer);
  }
}