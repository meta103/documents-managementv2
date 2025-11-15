export class CellTitle extends HTMLElement {
  private docTitle: string = '';
  private version: string = '';

  constructor(title: string, version: string) {
    super();
    this.docTitle = title;
    this.version = version;
    this.render();
  }
  /* Lifecycle hook: cuando el elemento se enserte en el DOM */
  connectedCallback() {
    this.render();
  }

  /* renderiza el shadow DOM con los estilos encapsulados */
  private render(): void {
    this.className = 'cell is-col-span-2';
    this.innerHTML = this.getTemplate();

    /* const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = this.getTemplate();
    //TODO: agregar estilos
    shadow.appendChild(this.getStyles()); */
  }

  private getTemplate(): string {
    return `
      <h3 class="document-title">${this.docTitle}</h3>
      <p class="document-version">Versión: ${this.version}</p>
    `;
  }

}
customElements.define('cell-title', CellTitle);