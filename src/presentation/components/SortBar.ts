import type { SortBy } from "../../domain/Document";
import { EventBus } from "../../infrastructure/event-bus/EventBus";

// Componente SortBar minimal para test
export class SortBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log('[SortBar] connectedCallback called');
    // Solo renderiza si está vacío
    if (!this.innerHTML || this.innerHTML.trim() === '') {
      this.innerHTML = `<div class="level mb-5">
            <div class="field">
              <label class="label">Sort by:</label>
              <div class="control">
                <div class="select is-primary is-rounded">
                  <select id="sort-select">
                    <option value="createdAt">📅 Created Date</option>
                    <option value="name">🔠 Name (A-Z)</option>
                    <option value="version">🗄️ Version</option>
                  </select>
                </div>
              </div>
            </div>
          </div>`;
    }
    const select = this.querySelector('#sort-select');
    if (select) {
      select.addEventListener('change', (e) => {
        const sortBy = (e.target as HTMLSelectElement).value as SortBy;
        EventBus.emit('SORT_CHANGED', { sortBy });
      });
    } else {
      console.warn('[SortBar] #sort-select not found after render');
    }
  }
}

customElements.define('sort-bar', SortBar);

