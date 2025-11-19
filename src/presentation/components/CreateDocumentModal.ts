export interface FormData {
  title: string;
  version: string;
  contributors: string[];
  attachments: string[];
}

export function CreateDocumentModal(
  onSubmit: (data: FormData) => Promise<void>,
  onCancel: () => void
): HTMLElement {
  const modal = document.createElement('div');
  modal.className = 'modal is-active';
  modal.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create New Document</p>
        <button class="delete"></button>
      </header>
      <section class="modal-card-body">
        <form id="create-doc-form">
          <div class="field">
            <label class="label">Document Title *</label>
            <div class="control">
              <input class="input" type="text" id="title" placeholder="e.g. Employment contract for Marcos">
            </div>
          </div>

          <div class="field">
            <label class="label">Version *</label>
            <div class="control">
              <input class="input" type="number" id="version" step="0.1" min="0" placeholder="e.g. 1.0.0">
            </div>
          </div>

          <div class="field">
            <label class="label">Contributors *</label>
            <div id="contributors-container">
              <div class="field has-addons">
                <div class="control is-expanded">
                  <input class="input contributor-input" type="text" placeholder="Contributor name">
                </div>
                <div class="control">
                  <button class="button is-danger is-outlined remove-contributor" type="button" style="display:none;">Remove</button>
                </div>
              </div>
            </div>
            <button class="button is-primary is-outlined is-fullwidth mt-2" id="add-contributor" type="button">+ Add Contributor</button>
          </div>

          <div class="field">
            <label class="label">Attachments *</label>
            <div id="attachments-container">
              <div class="field has-addons">
                <div class="control is-expanded">
                  <input class="input attachment-input" type="text" placeholder="Attachment name">
                </div>
                <div class="control">
                  <button class="button is-danger is-outlined remove-attachment" type="button" style="display:none;">Remove</button>
                </div>
              </div>
            </div>
            <button class="button is-primary is-outlined is-fullwidth mt-2" id="add-attachment" type="button">+ Add Attachment</button>
          </div>

          <div class="notification is-danger" id="form-error" style="display:none;">
            <button class="delete"></button>
            <span id="form-error-text"></span>
          </div>
        </form>
      </section>
      <footer class="modal-card-foot is-flex is-justify-content-end">
        <button class="button is-rounded" id="cancel-btn">Cancel</button>
        <button class="button is-primary is-outlined is-rounded" id="submit-btn">Create Document</button>
      </footer>
    </div>
  `;

  setupModalListeners(modal, onSubmit, onCancel);
  return modal;
}

function setupModalListeners(
  modal: HTMLElement,
  onSubmit: (data: FormData) => Promise<void>,
  onCancel: () => void
): void {
  const closeBtn = modal.querySelector('.modal-card-head .delete') as HTMLElement;
  closeBtn?.addEventListener('click', () => {
    onCancel();
    modal.remove();
  });

  const cancelBtn = modal.querySelector('#cancel-btn') as HTMLElement;
  cancelBtn?.addEventListener('click', () => {
    onCancel();
    modal.remove();
  });

  const addContributorBtn = modal.querySelector('#add-contributor') as HTMLElement;
  addContributorBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    addContributorField(modal);
  });

  const contributorsContainer = modal.querySelector('#contributors-container') as HTMLElement;
  contributorsContainer?.addEventListener('click', (e) => {
    const removeBtn = (e.target as HTMLElement).closest('.remove-contributor');
    if (removeBtn) {
      (e.target as HTMLElement).closest('.field.has-addons')?.remove();
      updateRemoveButtonVisibility(contributorsContainer, '.remove-contributor');
    }
  });

  const addAttachmentBtn = modal.querySelector('#add-attachment') as HTMLElement;
  addAttachmentBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    addAttachmentField(modal);
  });

  const attachmentsContainer = modal.querySelector('#attachments-container') as HTMLElement;
  attachmentsContainer?.addEventListener('click', (e) => {
    const removeBtn = (e.target as HTMLElement).closest('.remove-attachment');
    if (removeBtn) {
      (e.target as HTMLElement).closest('.field.has-addons')?.remove();
      updateRemoveButtonVisibility(attachmentsContainer, '.remove-attachment');
    }
  });

  const submitBtn = modal.querySelector('#submit-btn') as HTMLElement;
  submitBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    await handleSubmit(modal, onSubmit);
  });


  const errorClose = modal.querySelector('#form-error .delete') as HTMLElement;
  errorClose?.addEventListener('click', () => {
    const errorDiv = modal.querySelector('#form-error') as HTMLElement;
    errorDiv.style.display = 'none';
  });

}

function addContributorField(modal: HTMLElement): void {
  const container = modal.querySelector('#contributors-container') as HTMLElement;
  const field = document.createElement('div');
  field.className = 'field has-addons mt-2';
  field.innerHTML = `
    <div class="control is-expanded">
      <input class="input contributor-input" type="text" placeholder="Contributor name">
    </div>
    <div class="control">
      <button class="button is-danger is-outlined remove-contributor" type="button">Remove</button>
    </div>
  `;
  container?.appendChild(field);
  updateRemoveButtonVisibility(container, '.remove-contributor');
}

function addAttachmentField(modal: HTMLElement): void {
  const container = modal.querySelector('#attachments-container') as HTMLElement;
  const field = document.createElement('div');
  field.className = 'field has-addons mt-2';
  field.innerHTML = `
    <div class="control is-expanded">
      <input class="input attachment-input" type="text" placeholder="Attachment name">
    </div>
    <div class="control">
      <button class="button is-danger is-outlined remove-attachment" type="button">Remove</button>
    </div>
  `;
  container?.appendChild(field);
  updateRemoveButtonVisibility(container, '.remove-attachment');
}

function updateRemoveButtonVisibility(container: HTMLElement | null, selector: string): void {
  const buttons = container?.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  const shouldShow = (buttons?.length || 0) > 1;
  buttons?.forEach(btn => {
    btn.style.display = shouldShow ? 'block' : 'none';
  });
}

async function handleSubmit(
  modal: HTMLElement,
  onSubmit: (data: FormData) => Promise<void>
): Promise<void> {
  try {
    const title = (modal.querySelector('#title') as HTMLInputElement)?.value;
    const version = (modal.querySelector('#version') as HTMLInputElement)?.value;

    const contributors = Array.from(
      modal.querySelectorAll('.contributor-input') as NodeListOf<HTMLInputElement>
    )
      .map(input => input.value)
      .filter(val => val.trim() !== '');

    const attachments = Array.from(
      modal.querySelectorAll('.attachment-input') as NodeListOf<HTMLInputElement>
    )
      .map(input => input.value)
      .filter(val => val.trim() !== '');

    await onSubmit({
      title: title.trim(),
      version: version.trim(),
      contributors,
      attachments,
    });

    modal.remove();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create document';
    showError(modal, message);
  }
}

function showError(modal: HTMLElement, message: string): void {
  const errorDiv = modal.querySelector('#form-error') as HTMLElement;
  const errorText = modal.querySelector('#form-error-text') as HTMLElement;

  if (errorText) {
    errorText.textContent = message;
  }
  errorDiv.style.display = 'block';

  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}