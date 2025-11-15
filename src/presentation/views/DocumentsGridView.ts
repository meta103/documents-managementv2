import type { Document } from '../../domain/Document';
import { CellList } from '../components/CellList';
import { CellTitle } from '../components/CellTitle';
import { Grid } from '../components/Grid';

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

    //Inyectar filtro 
    const sortBar = document.createElement('app-sort-bar');
    gridContainer.appendChild(sortBar);

    //Inyectar Grid
    const gridMain = new Grid();
    gridContainer.appendChild(gridMain);

    const cardContainer = gridMain.getElementsByClassName('grid')[0] as HTMLElement;
    documents.forEach(({ title, version, contributors, attachments }: Document) => {
      const cellName = new CellTitle(title, version);
      const cellContributors = new CellList(contributors.map(({ name }) => name));
      const cellAttachments = new CellList(attachments.map(({ name }) => name));
      /* cellName.setAttribute('data-document-id', doc.id);
      cellContributors.setAttribute('data-document-id', doc.id);
      cellAttachments.setAttribute('data-document-id', doc.id); */
      cardContainer.appendChild(cellName);
      cardContainer.appendChild(cellContributors);
      cardContainer.appendChild(cellAttachments);
    })
    //Card para cada document
    /* documents.forEach((doc: Document) => {
      const card = new DocumentCard(doc);
      card.setAttribute('data-document-id', doc.id);
      gridMain.appendChild(card);
    }); */

    //Insertar en DOM:
    this.root.appendChild(gridContainer);
  }
}