export class Grid extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  private render(): void {
    this.innerHTML = `
      <div class='section'>
        <sort-bar></sort-bar>
        <div class="fixed-grid has-5-cols">
          <div id="grid" class="grid is-row-gap-3 is-column-gap-0">
            <div class="cell is-col-span-2 has-background-primary-dark py-3 px-4"><strong>Name</strong></div>
            <div class="cell has-background-primary-dark py-3 px-4"><strong>Contributors</strong></div>
            <div class="cell has-background-primary-dark py-3 px-4"><strong>Attachments</strong></div>
            <div class="cell has-background-primary-dark py-3 px-4"><strong>Created</strong></div>
          </div>
        </div>
      </div>
    `;

  }
}

if (!customElements.get('app-grid')) {
  customElements.define('app-grid', Grid);
}