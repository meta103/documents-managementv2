import type { Attachment, Contributor, Document } from "../../domain/Document";

export class CellList extends HTMLElement {
  private info: string[] = [];

  constructor(info: string[]) {
    super();
    this.info = info;
    this.render();
  }
  /* Lifecycle hook: cuando el elemento se enserte en el DOM */
  connectCallback() {
    this.render();
  }

  /* renderiza el shadow DOM con los estilos encapsulados */
  private render(): void {
    this.className = 'cell';
    this.innerHTML = this.getTemplate();
  }

  private getTemplate(): string {
    return `
      <ul class="contributors-list">${this.info.map((name: string) => `<li>${name}</li>`).join('')}</ul>
    `;
  }
}
customElements.define('document-card', CellList);