import type { Document } from "../../domain/Document";

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
    this.className = 'section';
    this.innerHTML = `
      <div class="fixed-grid has-5-cols">
        <div class="grid">
          <div class="cell is-col-span-2"><strong>Name</strong></div>
          <div class="cell"><strong>Contributors</strong></div>
          <div class="cell"><strong>Attachments</strong></div>
          <div class="cell"><strong>Created</strong></div>
        </div>
      </div>
    `;

  }
}

customElements.define('app-grid', Grid);