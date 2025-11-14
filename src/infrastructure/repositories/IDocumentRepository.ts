// Repository Interface: Contrato de persistencia

import type { Document } from '../../domain/Document';

/**
 * IDocumentRepository - Contrato
 * 
 * Pattern: Repository Pattern
 * Ventaja: La aplicación NO sabe cómo se persisten los datos
 * Permite cambiar de In-Memory a API a DB sin tocar Application
 */
export interface IDocumentRepository {
  /**
   * Obtiene todos los documentos
   */
  getAll(): Promise<Document[]>;

  /**
   * Guarda documentos (reemplaza los anteriores)
   */
  save(documents: Document[]): Promise<void>;

  /**
   * Se suscribe a cambios
   */
  subscribe(observer: (docs: Document[]) => void): () => void;
}