import type { Document } from '../../domain/Document';
import { AddDocumentButton } from '../components/AddDocumentButton';
import { CellCreatedDate } from '../components/CellCreatedDate';
import { CellList } from '../components/CellList';
import { CellTitle } from '../components/CellTitle';
import { Grid } from '../components/Grid';
import { Header } from '../components/Header';
import { SortBar } from '../components/SortBar';

export class DocumentsGridView {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  render(documents: Document[]): void {

    this.root.innerHTML = '';

    if (documents.length === 0) {
      this.root.innerHTML = '<p>No hay documentos disponibles.</p>';
      return;
    }

    //Grid: 
    const gridContainer = document.createElement('div');
    gridContainer.className = 'documents-grid';

    //Inyectar Header 
    const header = new Header();
    gridContainer.appendChild(header);

    //Inyectar Sort 
    /* const sort = new SortBar();
    gridContainer.appendChild(sort); */

    //Inyectar Grid
    const gridMain = new Grid();
    gridContainer.appendChild(gridMain);

    const cardContainer = gridMain.getElementsByClassName('grid')[0] as HTMLElement;
    documents.forEach(({ title, version, contributors, attachments, createdAt }: Document) => {
      const cellName = new CellTitle(title, version);
      const cellContributors = new CellList(contributors.map(({ name }) => name));
      const cellAttachments = new CellList(attachments.map(({ name }) => name));
      const cellCreatedDate = new CellCreatedDate(createdAt);
      cardContainer.appendChild(cellName);
      cardContainer.appendChild(cellContributors);
      cardContainer.appendChild(cellAttachments);
      cardContainer.appendChild(cellCreatedDate);
    })

    //Inyectar boton add 
    const addButton = new AddDocumentButton();
    gridContainer.appendChild(addButton);

    //Insertar en DOM:
    this.root.appendChild(gridContainer);
  }
}