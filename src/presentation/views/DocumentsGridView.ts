import type { Document } from '../../domain/Document';
import { AddDocumentButton } from '../components/AddDocumentButton';
import { CellCreatedDate } from '../components/CellCreatedDate';
import { CellList } from '../components/CellList';
import { CellTitle } from '../components/CellTitle';
import { Grid } from '../components/Grid';
import { Header } from '../components/Header';

export class DocumentsGridView {
  private root: HTMLElement;
  private headerTemplate: string | null = null;
  private gridMainElement: HTMLElement | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  render(documents: Document[]): void {
    // Si no hay documentos, limpiar y salir
    if (documents.length === 0) {
      this.root.innerHTML = '<p>No hay documentos disponibles.</p>';
      return;
    }

    // Si la estructura principal ya existe, solo actualizamos las celdas
    const existingContainer = this.root.getElementsByClassName('documents-grid')[0] as HTMLElement | undefined;
    if (!existingContainer) {
      // Primera renderización: crear estructura completa
      this.root.innerHTML = '';
      const gridContainer = document.createElement('div');
      gridContainer.className = 'documents-grid';

      // Inyectar Header
      const header = new Header();
      gridContainer.appendChild(header);

      // Inyectar Grid
      const gridMain = new Grid();
      gridContainer.appendChild(gridMain);

      // Inyectar botón add
      const addButton = new AddDocumentButton();
      gridContainer.appendChild(addButton);

      // Insertar en DOM
      this.root.appendChild(gridContainer);

      // Guardar referencia al gridMain y su template de cabecera
      this.gridMainElement = gridMain as unknown as HTMLElement;
      const cardContainer = this.gridMainElement.getElementsByClassName('grid')[0] as HTMLElement;
      this.headerTemplate = cardContainer ? cardContainer.innerHTML : null;
    }

    // Delegar a updateDocuments para rellenar las filas
    this.updateDocuments(documents);
  }

  updateDocuments(documents: Document[]): void {
    const gridMainEl = (this.gridMainElement
      ? this.gridMainElement.getElementsByClassName('grid')[0]
      : this.root.getElementsByClassName('documents-grid')[0]?.getElementsByClassName('grid')[0]) as HTMLElement;
    const cardContainer = gridMainEl as HTMLElement;

    // Restaurar header template (cabeceras) y añadir las celdas
    if (this.headerTemplate !== null) {
      cardContainer.innerHTML = this.headerTemplate;
    } else {
      // Si por alguna razón no tenemos la plantilla, limpiamos completamente
      cardContainer.innerHTML = '';
    }

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
  }
}