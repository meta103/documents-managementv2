import { SortBar } from "../../../../src/presentation/components/SortBar";

describe('SortBar', () => {
  beforeAll(() => {
    if (!customElements.get('sort-bar')) {
      customElements.define('sort-bar', SortBar);
    }
  });

  it('should render correctly', () => {
    const sortBar = new SortBar();
    document.body.appendChild(sortBar);
    sortBar.connectedCallback();

    const select = sortBar.querySelector('#sort-select');
    expect(select).not.toBeNull();
    expect(select?.innerHTML).toContain('Created Date');
    expect(select?.innerHTML).toContain('Name (A-Z)');
    expect(select?.innerHTML).toContain('Version');

    document.body.removeChild(sortBar);
  });

  it('should emit SORT_CHANGED event on selection change', () => {
    const sortBar = new SortBar();
    document.body.appendChild(sortBar);
    sortBar.connectedCallback();

    const mockCallback = jest.fn();
    const eventBus = require('../../../../src/infrastructure/event-bus/EventBus');
    eventBus.EventBus.on('SORT_CHANGED', mockCallback);

    const select = sortBar.querySelector('#sort-select') as HTMLSelectElement;
    select.value = 'name';
    const event = new Event('change');
    select.dispatchEvent(event);

    expect(mockCallback).toHaveBeenCalledWith({ sortBy: 'name' });
  });
});
