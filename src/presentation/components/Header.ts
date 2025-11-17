export class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
  }

  private render(): void {
    this.innerHTML = `
      <div class="section">
        <h1 class="title"> 📂 Documents challenge | by Marcos Tagliabue </h1> 
      </div>
    `;
  }

}

customElements.define('header-app', Header);