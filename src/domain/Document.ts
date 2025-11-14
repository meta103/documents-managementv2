/**
 * Documento - Modelo de dominio
 * Representa la estructura de un documento
 * 
 * Este es el corazón del negocio, independiente de cualquier framework o librería
 */
export interface Document {
  id: string;
  title: string;
  version: string;
  contributors: Contributor[];
  attachments: Attachment[];
  createdAt: string;
}

export interface DocumentRaw {
  ID: string;
  CreatedAt: string;
  UpdatedAt: string;
  Title: string;
  Version: string;
  Attachments: string[];
  Contributors: ContributorRaw[];
}

/**
 * Contribuidor - Value Object
 * Encapsula la información de quien contribuyó
 */
export interface Contributor {
  id: string;
  name: string;
}

export interface ContributorRaw {
  ID: string;
  Name: string;
}

/**
 * Attachment - Value Object
 * Representa un archivo adjunto
 */
export interface Attachment {
  name: string;
}

/**
 * Validación básica de Documento
 * Reglas de negocio simples pero importantes
 */
export class DocumentValidator {
  static validate(doc: Document): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!doc.id || doc.id.trim() === '') {
      errors.push('Document ID is required');
    }

    if (!doc.title || doc.title.trim() === '') {
      errors.push('Document title is required');
    }

    if (!doc.version || doc.version.trim() === '') {
      errors.push('Document version is required');
    }

    if (!Array.isArray(doc.contributors)) {
      errors.push('Contributors must be an array');
    }

    if (!Array.isArray(doc.attachments)) {
      errors.push('Attachments must be an array');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}