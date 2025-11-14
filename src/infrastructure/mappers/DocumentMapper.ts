// Mapper: Convierte DTO del servidor a nuestro modelo
import type { Document, DocumentRaw } from '../../domain/Document';

/**
 * DocumentRaw - DTO del servidor
 * Representa el formato que viene del API
 */


/**
 * DocumentMapper - Transforma DTO ↔ Domain Model
 * 
 * Ventaja: Desacopla la estructura del API de nuestro dominio
 * Si el API cambia, solo cambiamos el mapper
 */
export class DocumentMapper {
  /**
   * Mapea DTO del servidor a modelo de dominio
   */
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

  /**
   * Mapea array de DTOs
   */
  static toDomainArray(rawDocs: DocumentRaw[]): Document[] {
    return rawDocs.map(doc => this.toDomain(doc));
  }

  /**
   * Mapea modelo de dominio a DTO (para enviar al servidor)
   */
  static toDTO(doc: Document): DocumentRaw {
    return {
      ID: doc.id,
      Title: doc.title,
      Version: doc.version,
      Contributors: doc.contributors.map(c => ({
        ID: c.id,
        Name: c.name,
      })),
      Attachments: doc.attachments.map(a => a.name),
      CreatedAt: doc.createdAt,
      UpdatedAt: new Date().toISOString(),
    };
  }
}