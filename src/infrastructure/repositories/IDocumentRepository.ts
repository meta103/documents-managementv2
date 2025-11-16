import type { Document } from '../../domain/Document';

/**
 * IDocumentRepository - Contrato/Interface
 * 
 * Define qué métodos DEBE tener cualquier repository
 * Permite cambiar la implementación sin afectar el resto del código
 */
export interface IDocumentRepository {
  /**
   * Guarda documentos
   */
  save(documents: Document[]): Promise<void>;

  /**
   * Obtiene todos los documentos
   */
  getAll(): Promise<Document[]>;

  /**
   * ⭐ Suscribirse a cambios
   * Retorna función para desuscribirse
   */
  subscribe(observer: (docs: Document[]) => void): () => void;
}