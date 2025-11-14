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

  subscribe(observer: (docs: Document[]) => void): () => void;
  //Mas adelante: otros métodos CRUD:
  /* save(documents: Document[]): Promise<void>; */
}