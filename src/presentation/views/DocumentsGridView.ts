import type { Document } from '../../domain/Document';
import { AddDocumentButton } from '../components/AddDocumentButton';
import { CellCreatedDate } from '../components/CellCreatedDate';
import { CellList } from '../components/CellList';
import { CellTitle } from '../components/CellTitle';
import { Grid } from '../components/Grid';
import { SortBar } from '../components/SortBar';

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
    const sortBar = new SortBar();
    /* const sortBar = document.createElement('sort-bar'); */
    gridContainer.appendChild(sortBar);

    //Inyectar Grid
    const gridMain = new Grid();
    gridContainer.appendChild(gridMain);

    const cardContainer = gridMain.getElementsByClassName('grid')[0] as HTMLElement;
    documents.forEach(({ title, version, contributors, attachments, createdAt }: Document) => {
      const cellName = new CellTitle(title, version);
      const cellContributors = new CellList(contributors.map(({ name }) => name));
      const cellAttachments = new CellList(attachments.map(({ name }) => name));
      const cellCreatedDate = new CellCreatedDate(createdAt);
      /* cellName.setAttribute('data-document-id', doc.id);
      cellContributors.setAttribute('data-document-id', doc.id);
      cellAttachments.setAttribute('data-document-id', doc.id); */
      cardContainer.appendChild(cellName);
      cardContainer.appendChild(cellContributors);
      cardContainer.appendChild(cellAttachments);
      cardContainer.appendChild(cellCreatedDate);
    })

    //Inyectar boton add 
    const addButton = document.createElement('add-button');
    /*  const addButton = new AddDocumentButton(); */
    gridContainer.appendChild(addButton);

    //Insertar en DOM:
    this.root.appendChild(gridContainer);
  }
}