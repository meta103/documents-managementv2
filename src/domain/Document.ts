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

export class DocumentSorter {
  /**
   * Tipos de ordenamiento soportados
   */
  static readonly SORT_BY = {
    NAME: 'name',
    VERSION: 'version',
    CREATED_DATE: 'createdAt',
  } as const;

  /**
   * Orden ascendente o descendente
   */
  static readonly SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
  } as const;

  /**
   * Ordena documentos por el campo especificado
   * 
   * @param documents Array de documentos a ordenar
   * @param sortBy Campo por el cual ordenar: 'name' | 'version' | 'createdAt'
   * @param order Orden: 'asc' | 'desc'
   * @returns Array ordenado (no modifica el original)
   */
  static sort(
    documents: Document[],
    sortBy: 'name' | 'version' | 'createdAt' = 'createdAt',
    order: 'asc' | 'desc' = 'asc'
  ): Document[] {
    const sorted = [...documents];

    sorted.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'name':
          // Ordenar por título alfabéticamente
          compareValue = a.title.localeCompare(b.title);
          break;

        case 'version':
          // Ordenar por versión semántica
          compareValue = this.compareVersions(a.version, b.version);
          break;

        case 'createdAt':
          // Ordenar por fecha de creación
          compareValue = this.compareCreatedDates(a.createdAt, b.createdAt);
          break;

        default:
          compareValue = 0;
      }

      // Invertir si es descendente
      return order === 'desc' ? -compareValue : compareValue;
    });

    return sorted;
  }

  /**
   * Compara versiones semánticas correctamente
   * 
   * Ejemplos:
   * - "1.0.0" > "0.9.0" ✅
   * - "2.1.0" > "2.0.5" ✅
   * - "1.0.0" = "1.0.0" ✅
   */
  private static compareVersions(versionA: string, versionB: string): number {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);

    // Itera por cada parte de la versión
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const partA = partsA[i] || 0;
      const partB = partsB[i] || 0;

      if (partA !== partB) {
        return partA - partB;
      }
    }

    // Versiones iguales
    return 0;
  }

  private static compareCreatedDates(dateA: string, dateB: string): number {
    const timeA = new Date(dateA).getTime();
    const timeB = new Date(dateB).getTime();

    return timeB - timeA;
  }
}