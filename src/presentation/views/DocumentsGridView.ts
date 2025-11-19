import type { Document } from '../../domain/Document';
import { AddDocumentButton } from '../components/AddDocumentButton';
import { CellCreatedDate } from '../components/CellCreatedDate';
import { CellList } from '../components/CellList';
import { CellTitle } from '../components/CellTitle';
import { Grid } from '../components/Grid';
import { Header } from '../components/Header';
import '../components/SortBar';

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

    //Inyectar Grid
    const gridMain = new Grid();
    gridContainer.appendChild(gridMain);

    // Detectar cuando el grid está listo e inyectar celdas
    const observer = new MutationObserver(() => {
      const cardContainer = gridMain.querySelector('#grid') as HTMLElement;
      if (cardContainer) {
        documents.forEach(({ title, version, contributors, attachments, createdAt }: Document) => {
          const cellName = new CellTitle(title, version);
          const cellContributors = new CellList(contributors.map(({ name }) => name));
          const cellAttachments = new CellList(attachments.map(({ name }) => name));
          const cellCreatedDate = new CellCreatedDate(createdAt);
          cardContainer.appendChild(cellName);
          cardContainer.appendChild(cellContributors);
          cardContainer.appendChild(cellAttachments);
          cardContainer.appendChild(cellCreatedDate);
        });
        observer.disconnect();
      }
    });

    observer.observe(gridMain, { childList: true, subtree: true });

    //Inyectar botón add
    const addButton = new AddDocumentButton();
    gridContainer.appendChild(addButton);

    //Insertar en DOM:
    this.root.appendChild(gridContainer);
  }
}