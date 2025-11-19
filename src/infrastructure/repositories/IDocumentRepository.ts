import type { Document } from '../../domain/Document';
export interface IDocumentRepository {
  save(documents: Document[]): Promise<void>;
  getAll(): Promise<Document[]>;
  subscribe(observer: (docs: Document[]) => void): () => void;
}