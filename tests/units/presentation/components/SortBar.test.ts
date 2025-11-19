import { SortBar } from "../../../../src/presentation/components/SortBar";


describe('SortBar', () => {
  beforeAll(() => {
    if (!customElements.get('sort-bar')) {
      customElements.define('sort-bar', SortBar);
    }
  });

  it('renders a button and fires event on click', async () => {
    const el = document.createElement('sort-bar');
    document.body.appendChild(el);
    // wait for connectedCallback to run
    await Promise.resolve();
    const sortBar = document.querySelector('sort-bar') as SortBar;
    expect(sortBar).not.toBeNull();
    const button = sortBar.querySelector('#sort-test');
    expect(button).not.toBeNull();

    let eventFired = false;
    sortBar.addEventListener('sort-test-clicked', () => {
      eventFired = true;
    });
    button!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(eventFired).toBe(true);
  });
});
