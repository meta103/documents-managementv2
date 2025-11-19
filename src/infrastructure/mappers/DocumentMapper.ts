import type { Document, DocumentRaw } from '../../domain/Document';
export class DocumentMapper {
  //Para mapear el dto a nuestro modelo de dominio
  static toDomain(raw: DocumentRaw): Document {
    return {
      id: raw.ID,
      title: raw.Title,
      version: raw.Version,
      contributors: raw.Contributors.map(c => ({
        id: c.ID,
        name: c.Name,
      })),
      attachments: raw.Attachments.map(name => ({
        name,
      })),
      createdAt: raw.CreatedAt,
    };
  }
}