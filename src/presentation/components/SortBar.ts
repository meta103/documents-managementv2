import { EventBus } from '../../infrastructure/event-bus/EventBus';

/**
 * SortBar - Dropdown que emite a EventBus
 * 
 * Ventajas:
 * - Desacoplado del DOM
 * - Type-safe (EventBus maneja tipos)
 * - Fácil de testear
 */
export class SortBar extends HTMLElement {
  private selectedOption: 'name' | 'version' | 'createdAt' = 'createdAt';

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
    this.setupEventListener();
  }

  private render(): void {
    this.innerHTML = `
      <div class="level mb-5">
        <div class="field">
          <label class="label">Sort by:</label>
          <div class="control">
            <div class="select is-info is-rounded">
              <select id="sort-select">
                <option value="createdAt">📅 Created Date</option>
                <option value="name">🔠 Name (A-Z)</option>
                <option value="version">🗄️ Version</option>
              </select>
            </div>
          </div>
        </div>
      </div>  
    `;
  }

  private setupEventListener(): void {
    const select = this.querySelector('#sort-select') as HTMLSelectElement;
    // Escucha cambios del select
    select.addEventListener('change', (e) => {
      const sortBy = (e.target as HTMLSelectElement).value as
        | 'name'
        | 'version'
        | 'createdAt';
      this.selectedOption = (e.target as HTMLSelectElement).value as 'name' | 'version' | 'createdAt';
      // ⭐ Emite a EventBus, no CustomEvent
      EventBus.emit('SORT_CHANGED', { sortBy });
    });
  }

  //No se usa
  getCurrentSort(): 'name' | 'version' | 'createdAt' {
    return this.selectedOption;
  }
}

customElements.define('sort-bar', SortBar);