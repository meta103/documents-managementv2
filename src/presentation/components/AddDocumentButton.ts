import { EventBus } from "../../infrastructure/event-bus/EventBus";

export class AddDocumentButton extends HTMLElement {

  constructor() {
    super();
  }

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

    button.addEventListener('click', () => {
      EventBus.emit('SHOW_MODAL', { show: true });
    });
  }
}
if (!customElements.get('add-button')) {
  customElements.define('add-button', AddDocumentButton);
}