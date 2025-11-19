export class CellList extends HTMLElement {
  private info: string[] = [];

  constructor(info: string[]) {
    super();
    this.info = info;
    this.render();
  }

  connectCallback() {
    this.render();
  }

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
if (!customElements.get('document-card')) {
  customElements.define('document-card', CellList);
}