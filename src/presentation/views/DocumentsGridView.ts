import { DocumentCard } from '../components/DocumentCard';
import type { Document } from '../../domain/Document';

export class DocumentsGridView {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  render(documents: Document[]): void {

    this.root.innerHTML = ''; // Limpiar contenido previo

    if (documents.length === 0) {
      this.root.innerHTML = '<p>No hay documentos disponibles.</p>';
      return;
    }

    //Grid: 
    const gridContainer = document.createElement('div');
    gridContainer.className = 'documents-grid';

    //Card para cada document
    documents.forEach((doc: Document) => {
      const card = new DocumentCard(doc);
      card.setAttribute('data-document-id', doc.id);
      gridContainer.appendChild(card);
    });

    //Insertar en DOM:
    this.root.appendChild(gridContainer);
  }
}