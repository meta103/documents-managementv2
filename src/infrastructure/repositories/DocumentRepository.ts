import type { Document } from '../../domain/Document';
import type { IDocumentRepository } from './IDocumentRepository';

const STORAGE_KEY = 'documents_db'; // Clave para localStorage

/**
 * DocumentRepository - Con persistencia en localStorage
 * 
 * ✅ Los documentos persisten entre reloads
 * ✅ Se sincroniza automáticamente
 * ✅ Pattern Observer para cambios reactivos
 */
export class DocumentRepository implements IDocumentRepository {
  private observers: Array<(docs: Document[]) => void> = [];

  constructor() {
    console.log('📦 DocumentRepository initialized (localStorage)');
  }

  /**
   * Guardar documentos
   * 
   * IMPORTANTE: Siempre guarda TODOS los documentos (no reemplaza)
   */
  async save(documents: Document[]): Promise<void> {
    try {
      // ⭐ Persiste en localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
      console.log(`💾 Saved ${documents.length} documents to localStorage`);

      // ⭐ Notifica observers
      this.notifyObservers(documents);
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
      throw new Error('Failed to save documents');
    }
  }

  /**
   * Obtener todos los documentos
   */
  async getAll(): Promise<Document[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        console.log('📂 No documents in localStorage, returning empty array');
        return [];
      }

      const documents = JSON.parse(stored) as Document[];
      console.log(`📂 Retrieved ${documents.length} documents from localStorage`);
      return documents;
    } catch (error) {
      console.error('❌ Error reading from localStorage:', error);
      return [];
    }
  }

  /**
   * Suscribirse a cambios
   * 
   * Retorna función para desuscribirse
   */
  subscribe(observer: (docs: Document[]) => void): () => void {
    this.observers.push(observer);
    console.log(`👁️ Observer registered (total: ${this.observers.length})`);

    // Retorna función para desuscribirse
    return () => {
      this.observers = this.observers.filter(o => o !== observer);
      console.log(`👁️ Observer unregistered (total: ${this.observers.length})`);
    };
  }

  /**
   * Notifica a todos los observers
   */
  private notifyObservers(documents: Document[]): void {
    console.log(`📢 Notifying ${this.observers.length} observers...`);
    this.observers.forEach(observer => {
      try {
        observer(documents);
      } catch (error) {
        console.error('❌ Error in observer:', error);
      }
    });
  }

  /**
   * Limpia todo (útil para tests/debug)
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Cleared all documents from localStorage');
  }
}