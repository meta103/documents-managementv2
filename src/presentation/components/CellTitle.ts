export class CellTitle extends HTMLElement {
  private docTitle: string = '';
  private version: string = '';

  constructor(title: string, version: string) {
    super();
    this.docTitle = title;
    this.version = version;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  private render(): void {
    this.className = 'cell is-col-span-2';
    this.innerHTML = this.getTemplate();
  }

  private getTemplate(): string {
    return `
      <h3 class="document-title">${this.docTitle}</h3>
      <p class="document-version">Versión: ${this.version}</p>
    `;
  }

}
if (!customElements.get('cell-title')) {
  customElements.define('cell-title', CellTitle);
}