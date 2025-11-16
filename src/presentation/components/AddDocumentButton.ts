import { EventBus } from "../../infrastructure/event-bus/EventBus";

export class AddDocumentButton extends HTMLElement {

  constructor() {
    super();
  }
  /* Lifecycle hook: cuando el elemento se enserte en el DOM */
  connectedCallback() {
    console.log('AQUI ENTRA?');

    this.render();
    this.setupEventListener();
  }

  private render(): void {
    this.innerHTML = `
      <div class="section">
        <button id="add-document-btn" class="button is-primary is-large">
          <span class="icon"><i class="fas fa-plus"></i></span>
          <span>Add Document</span>
        </button>
      </div>
    `;
  }

  private setupEventListener(): void {
    const button = this.querySelector('#add-document-btn') as HTMLButtonElement;

    if (!button) {
      console.error('⚠️ Button not found');
      return;
    }
    // Escucha cambios del select
    button.addEventListener('click', (e) => {

      console.log(e);

      // ⭐ Emite a EventBus, no CustomEvent
      EventBus.emit('SHOW_MODAL', { show: true });
    });
  }
}
customElements.define('add-button', AddDocumentButton);