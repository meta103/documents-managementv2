export class SortBar extends HTMLElement {
  private currentSortBy: 'name' | 'version' | 'createdDate' = 'name';
  private currentSortOrder: 'asc' | 'desc' = 'asc';

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    this.className = 'section';
    this.innerHTML = `
      <div class="container">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <h1 class="title">Documents</h1>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div class="buttons">
                <button 
                  id="sort-by-name" 
                  class="button is-info is-outlined is-active"
                  data-sort="name"
                  title="Sort by document name">
                  📝 Name
                </button>
                <button 
                  id="sort-by-version" 
                  class="button is-info is-outlined"
                  data-sort="version"
                  title="Sort by version number">
                  📌 Version
                </button>
                <button 
                  id="sort-by-date" 
                  class="button is-info is-outlined"
                  data-sort="createdDate"
                  title="Sort by creation date">
                  📅 Date
                </button>
                <button 
                  id="toggle-order" 
                  class="button is-warning is-outlined"
                  title="Toggle sort order">
                  ⬆️⬇️ Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.updateButtonStates();
  }

  private attachEventListeners(): void {
    const sortButtons = this.querySelectorAll('[data-sort]') as NodeListOf<HTMLElement>;
    sortButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const target = event.currentTarget as HTMLElement;
        const sortBy = target.getAttribute('data-sort') as 'name' | 'version' | 'createdDate';
        this.handleSortChange(sortBy);
      });
    });

    const toggleBtn = this.querySelector('#toggle-order');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.handleOrderToggle();
      });
    }
  }

  private handleSortChange(sortBy: 'name' | 'version' | 'createdDate'): void {
    // Si es el mismo sort, invierte orden
    console.log(sortBy);

    if (this.currentSortBy === sortBy) {
      this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortBy = sortBy;
      this.currentSortOrder = 'asc';
    }

    this.updateButtonStates();
    this.emitSortChange();
  }

  /**
   * Maneja toggle de orden
   */
  private handleOrderToggle(): void {
    console.log(this.currentSortOrder);

    this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    this.updateButtonStates();
    this.emitSortChange();
  }

  /**
   * Actualiza estilos de botones
   */
  private updateButtonStates(): void {
    const buttons = this.querySelectorAll('[data-sort]');
    buttons.forEach(button => {
      const sortBy = button.getAttribute('data-sort');
      if (sortBy === this.currentSortBy) {
        button.classList.add('is-active');
        const label = button.textContent?.split(' ')[0];
        const order = this.currentSortOrder === 'asc' ? '↑' : '↓';
        button.textContent = `${label} ${order}`;
      } else {
        button.classList.remove('is-active');
      }
    });
  }

  /**
   * Emite evento personalizado
   */
  private emitSortChange(): void {
    const event = new CustomEvent('sortchange', {
      detail: {
        sortBy: this.currentSortBy,
        order: this.currentSortOrder,
      },
      bubbles: true,
      composed: true,
    });
    console.log(event);

    this.dispatchEvent(event);
  }

  /**
   * Getters públicos
   */
  getSortBy(): 'name' | 'version' | 'createdDate' {
    return this.currentSortBy;
  }

  getOrder(): 'asc' | 'desc' {
    return this.currentSortOrder;
  }

  /**
   * Setter para cambiar sort programáticamente
   */
  setSortState(
    sortBy: 'name' | 'version' | 'createdDate',
    order: 'asc' | 'desc'
  ): void {
    this.currentSortBy = sortBy;
    this.currentSortOrder = order;
    this.updateButtonStates();
  }


}
customElements.define('app-sort-bar', SortBar);