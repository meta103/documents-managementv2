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
  private selectElement: HTMLSelectElement | null = null;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
    this.setupEventListener();
  }

  private render(): void {
    this.innerHTML = `
      <div class="section">
        <div class="container">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <h1 class="title">Documents</h1>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <div class="field">
                  <label class="label">Sort by:</label>
                  <div class="control">
                    <div class="select is-info is-rounded">
                      <select id="sort-select">
                        <option value="name">📝 Name (A-Z)</option>
                        <option value="version">📌 Version</option>
                        <option value="createdDate">📅 Created Date</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private setupEventListener(): void {
    console.log('eventListener');
    const select = this.querySelector('#sort-select') as HTMLSelectElement;

    if (!select) {
      console.error('⚠️ Sort select not found');
      return;
    }
    // Escucha cambios del select
    select.addEventListener('change', (e) => {
      const sortBy = (e.target as HTMLSelectElement).value as
        | 'name'
        | 'version'
        | 'createdDate';

      // ⭐ Emite a EventBus, no CustomEvent
      EventBus.emit('SORT_CHANGED', { sortBy });
    });
  }

  getCurrentSort(): 'name' | 'version' | 'createdDate' {
    return (this.selectElement?.value || 'name') as 'name' | 'version' | 'createdDate';
  }
}

customElements.define('app-sort-bar', SortBar);