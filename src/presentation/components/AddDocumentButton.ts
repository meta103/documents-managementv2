import { EventBus } from "../../infrastructure/event-bus/EventBus";

export class AddDocumentButton extends HTMLElement {

  constructor() {
    super();
  }
  /* Lifecycle hook: cuando el elemento se enserte en el DOM */
  connectedCallback() {
    this.render();
    this.setupEventListener();
  }

  private render(): void {
    this.innerHTML = `
      <div class="section is-flex is-justify-content-center">
        <button id="add-document-btn" class="button is-primary is-outlined is-large is-rounded">
          <span>➕ Add Document</span>
        </button>
      </div>
    `;
  }

  private setupEventListener(): void {
    const button = this.querySelector('#add-document-btn') as HTMLButtonElement;

    // Escucha cambios del select
    button.addEventListener('click', () => {
      // ⭐ Emite a EventBus, no CustomEvent
      EventBus.emit('SHOW_MODAL', { show: true });
    });
  }
}
customElements.define('add-button', AddDocumentButton);