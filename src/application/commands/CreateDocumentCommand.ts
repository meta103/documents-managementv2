
import { type Document } from '../../domain/Document';
import type { IDocumentRepository } from '../../infrastructure/repositories/IDocumentRepository';

export interface CreateDocumentDTO {
  title: string;
  version: string;
  contributors: string[];
  attachments: string[];
}

export class CreateDocumentCommand {
  constructor(private repository: IDocumentRepository) { }

  async execute(dto: CreateDocumentDTO): Promise<Document> {
    // 1. Validar input
    this.validateInput(dto);

    // 2. Crear documento
    const document = this.createDocument(dto);

    // 3. Obtener documentos actuales
    const currentDocuments = await this.repository.getAll();

    // 4. Agregar el nuevo
    const allDocuments = [...currentDocuments, document];

    // 5. Guardar (dispara observers)
    await this.repository.save(allDocuments);

    return document;
  }

  private validateInput(dto: CreateDocumentDTO): void {
    if (!dto.title || dto.title.trim() === '') {
      throw new Error('Title is required');
    }

    if (!dto.version || dto.version.trim() === '') {
      throw new Error('Version is required');
    }

    if (!Array.isArray(dto.contributors) || dto.contributors.length === 0) {
      throw new Error('At least one contributor is required');
    }

    if (dto.contributors.some(c => !c || c.trim() === '')) {
      throw new Error('Contributor names cannot be empty');
    }

    if (!Array.isArray(dto.attachments)) {
      throw new Error('Attachments must be an array');
    }
  }

  private createDocument(dto: CreateDocumentDTO): Document {
    return {
      id: this.generateId(),
      title: dto.title.trim(),
      version: dto.version.trim(),
      contributors: dto.contributors.map(name => ({
        id: this.generateId(),
        name: name.trim(),
      })),
      attachments: dto.attachments.map(name => ({
        name: name.trim(),
      })),
      createdAt: new Date().toISOString(),
    };
  }

  private generateId(): string {
    return `${Math.random().toString(36)}`;
  }
}