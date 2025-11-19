//Testeamos solo la logica de negocio, ni api ni bd

import type { IDocumentRepository } from "../../../../src/infrastructure/repositories/IDocumentRepository";
import type { Document } from "../../../../src/domain/Document";
import { DocumentService } from "../../../../src/application/services/DocumentService";

// Mock repository
class MockDocumentRepository implements IDocumentRepository {
  private documents: Document[] = [];
  private observers: Array<(docs: Document[]) => void> = [];

  async getAll(): Promise<Document[]> {
    return this.documents;
  }

  subscribe(observer: (docs: Document[]) => void): () => void {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }

  async save(_documents: Document[]): Promise<void> {
    // no-op mock save
    return;
  }
}

// Mock ApiService
class MockApiService {
  async getDocuments(): Promise<any[]> {
    return [
      { ID: '1', Title: 'Doc 1', Version: 'v1', Contributors: [{ Name: 'Alice' }], Attachments: ['file1.pdf'], CreatedAt: '2023-01-01' },
      { ID: '2', Title: '', Version: 'v1', Contributors: [{ Name: 'Bob' }], Attachments: ['file2.pdf'], CreatedAt: '2023-01-02' }, // Invalid
    ];
  }
};

describe('DocumentService', () => {
  let mockRepository: MockDocumentRepository;
  let mockApiService: MockApiService;
  let documentService: DocumentService;

  beforeEach(() => {
    mockRepository = new MockDocumentRepository();
    mockApiService = new MockApiService();
    documentService = new DocumentService(mockRepository, mockApiService);
  });

  //Cargar documentos
  it('should load and return valid documents', async () => {
    const documents = await documentService.loadAllDocuments();

    expect(documents).toHaveLength(1);
    expect(documents[0].title).toBe('Doc 1');
    expect(documents[0].version).toBe('v1');
  });

  //Obtener documents del repositorio
  it('should ger all docs from repository', async () => {
    await documentService.loadAllDocuments();

    const documents = await documentService.getAllDocuments();
    expect(documents).toHaveLength(0); //Porque el save esta comentado
  });
});
