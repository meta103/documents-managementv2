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
export interface Contributor {
  id: string;
  name: string;
}

export interface ContributorRaw {
  ID: string;
  Name: string;
}
export interface Attachment {
  name: string;
}

export const enum SortByEnum {
  DATE = 'createdAt',
  VERSION = 'version',
  NAME = 'name'
}

export class DocumentSorter {
  static sort(
    documents: Document[],
    sortBy: SortByEnum = SortByEnum.DATE,
    order: 'asc' | 'desc' = 'asc'
  ): Document[] {
    const sorted = [...documents];

    sorted.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case SortByEnum.NAME:
          compareValue = a.title.localeCompare(b.title);
          break;

        case SortByEnum.VERSION:
          compareValue = this.compareVersions(a.version, b.version);
          break;

        case SortByEnum.DATE:
          compareValue = this.compareCreatedDates(a.createdAt, b.createdAt);
          break;

        default:
          compareValue = 0;
      }

      return order === 'desc' ? -compareValue : compareValue;
    });

    return sorted;
  }

  private static compareVersions(versionA: string, versionB: string): number {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);

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