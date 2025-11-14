// Repository Implementation: In-Memory + Observer Pattern

import type { Document } from '../../domain/Document';
import type { IDocumentRepository } from './IDocumentRepository';

/**
 * DocumentRepository - Implementación del Repository Pattern
 * 
 * Almacena documentos en memoria con patrón Observer
 * Permite múltiples suscriptores
 */
export class DocumentRepository implements IDocumentRepository {
  private documents: Document[] = [];
  private observers: Array<(docs: Document[]) => void> = [];

  /**
   * Obtiene todos los documentos
   */
  async getAll(): Promise<Document[]> {
    return [...this.documents];
  }

  /**
   * Guarda documentos y notifica observers
   */
  async save(documents: Document[]): Promise<void> {
    this.documents = [...documents];
    this.notifyObservers();
  }

  /**
   * Se suscribe a cambios
   */
  subscribe(observer: (docs: Document[]) => void): () => void {
    this.observers.push(observer);

    // Retorna función para desuscribirse
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }

  /**
   * Notifica a todos los observadores
   */
  private notifyObservers(): void {
    this.observers.forEach(observer => observer([...this.documents]));
  }
}