export class CellCreatedDate extends HTMLElement {
  private relativeDate: string = '';

  constructor(createdAt: string,) {
    super();
    this.relativeDate = this.formatToRelative(new Date(createdAt));
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  private render(): void {
    this.className = 'cell';
    this.innerHTML = this.getTemplate();
  }

  private formatToRelative(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];

    for (const interval of intervals) {
      const value = Math.floor(seconds / interval.seconds);
      if (value >= 1) {
        return `${value} ${interval.label}${value !== 1 ? 's' : ''} ago`;
      }
    }
    return "just now";
  }

  private getTemplate(): string {
    return `
      <p>${this.relativeDate}</p>
    `;
  }

}
customElements.define('cell-created-at', CellCreatedDate);