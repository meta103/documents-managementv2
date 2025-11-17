export class Grid extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  /* Lifecycle hook: cuando el elemento se enserte en el DOM */
  connectCallback() {
    this.render();
  }

  private render(): void {
    this.innerHTML = `
      <div class='section'>
        <sort-bar></sort-bar>
        <div class="fixed-grid has-5-cols">
          <div class="grid is-row-gap-3 is-column-gap-0">
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

customElements.define('app-grid', Grid);