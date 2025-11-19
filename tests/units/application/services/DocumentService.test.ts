import { DocumentService } from '../../../../src/application/services/DocumentService';

describe('DocumentService', () => {
  let repository: any;
  let apiService: any;
  let documentService: DocumentService;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      subscribe: jest.fn(() => jest.fn())
    };
    apiService = {
      getDocuments: jest.fn()
    };
    documentService = new DocumentService(repository, apiService);
  });



  it('should throw error if loading documents fails', async () => {
    apiService.getDocuments.mockRejectedValue(new Error('fail'));
    await expect(documentService.loadAllDocuments()).rejects.toThrow('Failed to load documents');
  });



  it('should subscribe to documents', () => {
    const observer = jest.fn();
    const unsubscribe = jest.fn();
    repository.subscribe.mockReturnValue(unsubscribe);

    const result = documentService.observeDocuments(observer);
    expect(repository.subscribe).toHaveBeenCalledWith(observer);
    expect(result).toBe(unsubscribe);
  });
});