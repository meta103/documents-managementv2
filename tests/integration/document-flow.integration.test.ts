import { DocumentService } from '../../src/application/services/DocumentService';
import { DocumentMapper } from '../../src/infrastructure/mappers/DocumentMapper';
import { DocumentRepository } from '../../src/infrastructure/repositories/DocumentRepository';

class MockApiService {
  async getDocuments(): Promise<any[]> {
    return [
      {
        ID: 'uuid-1234-5678-9999',
        Title: 'Quarterly Report',
        Version: '2.1',
        Contributors: [
          { ID: 'user-1', Name: 'Alice Smith' },
          { ID: 'user-2', Name: 'Bob Johnson' },
        ],
        Attachments: ['report.pdf', 'appendix.xlsx'],
        CreatedAt: '2025-01-15T10:30:00Z',
        UpdatedAt: '2025-01-20T14:15:00Z',
      },
      {
        ID: 'uuid-1234-5678-8888',
        Title: 'Team Guidelines',
        Version: '1.0',
        Contributors: [{ ID: 'user-3', Name: 'Carol White' }],
        Attachments: ['guidelines.md'],
        CreatedAt: '2025-01-10T09:00:00Z',
        UpdatedAt: '2025-01-10T09:00:00Z',
      },
    ];
  }
}

describe('Document Flow Integration', () => {
  let service: DocumentService;
  let repository: DocumentRepository;
  let apiService: MockApiService;

  beforeEach(() => {
    repository = new DocumentRepository();
    apiService = new MockApiService();
    service = new DocumentService(repository, apiService as any);
  });

  //carga mapeo y store
  it('should load documents from API, map them, validate, and store in repository', async () => {
    // Act
    const documents = await service.loadAllDocuments();

    // Assert
    expect(documents).toHaveLength(2);

    const firstDoc = documents[0];
    expect(firstDoc.title).toBe('Quarterly Report');
    expect(firstDoc.contributors).toHaveLength(2);
    expect(firstDoc.attachments).toHaveLength(2);
  });

  // mapeo de DTO a modelo de dominio
  it('should map DTO from API to domain model', () => {
    // Arrange
    const rawDoc = {
      ID: 'test-id',
      Title: 'Test',
      Version: '1.0',
      Contributors: [{ ID: 'c1', Name: 'Contributor' }],
      Attachments: ['file.pdf'],
      CreatedAt: '2025-01-01T00:00:00Z',
      UpdatedAt: '2025-01-01T00:00:00Z',
    };

    // Act
    const mapped = DocumentMapper.toDomain(rawDoc);

    // Assert
    expect(mapped.id).toBe('test-id');
    expect(mapped.title).toBe('Test');
    expect(mapped.contributors[0].name).toBe('Contributor');
  });

  //Repositorio guarda y recupera documentos
  it('should save and retrieve documents from repository', async () => {
    // Arrange
    /* const docs = await service.loadAllDocuments(); */

    // Act
    const retrieved = await repository.getAll();

    // Assert
    expect(retrieved).toHaveLength(2);
    expect(retrieved[0].title).toBe('Quarterly Report');
  });
});