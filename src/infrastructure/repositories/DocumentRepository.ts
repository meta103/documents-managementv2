import type { Document } from '../../domain/Document';
import type { IDocumentRepository } from './IDocumentRepository';

const STORAGE_KEY = 'documents_db';

export class DocumentRepository implements IDocumentRepository {
  private observers: Array<(docs: Document[]) => void> = [];

  constructor() {
  }

  async save(documents: Document[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
      //Notifica observers
      this.notifyObservers(documents);
    } catch (error) {
      throw new Error('Failed to save documents');
    }
  }

  async getAll(): Promise<Document[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return [];
      }

      const documents = JSON.parse(stored) as Document[];
      return documents;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  //Suscribirse a cambios
  subscribe(observer: (docs: Document[]) => void): () => void {
    this.observers.push(observer);
    // Retorna función para desuscribirse
    return () => {
      this.observers = this.observers.filter(o => o !== observer);
    };
  }

  private notifyObservers(documents: Document[]): void {
    this.observers.forEach(observer => {
      try {
        observer(documents);
      } catch (error) {
        console.error('Error in observer:', error);
      }
    });
  }

  //Limpiar storage (no implmentado, pero usar en test)
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}