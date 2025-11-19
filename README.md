# Document Manager - Frontend Challenge

> **Document managemente system built with TypeScript, Domain-Driven Design, and modern architectural patterns.**


## Run the project (dev)
This project runs a Vite frontend and a small Go server that provides the documents API and a websocket for real-time notifications.

Prerequisites
- Node 18+ and npm
- Go (golang) installed and available in your PATH (required to run the server)

Start both services (frontend + backend) in development:

```bash
npm run dev
```

Notes:
- The `dev` script runs both `vite` and `go run server.go` in parallel using `concurrently`.

## Run tests

This project uses Jest for unit and integration tests.

To run all tests:

```bash
npm test
```

Or, to run tests with coverage:

```bash
npm run test:coverage
```

To run a specific test file:

```bash
npx jest path/to/testfile.test.ts
```

Test files are located in the `tests/` folder:

- `tests/units/` — unit tests for services and controllers
- `tests/integration/` — integration tests
- `tests/e2e/` — end-to-end tests

If you encounter issues with ESM or TypeScript, ensure you have the correct Node version and that dependencies are installed:

```bash
npm install
```

For troubleshooting Jest config, see `jest.config.js` and `tests/setup.ts`.

## Challenge requirements

This project fulfills all requirements of the frontend challenge: 
- ✅ **Display Documents as a grid** from REST API
- ✅ **Display Notifications** in real time via websocket
- ✅ **Create new documents** and persist using localStorage
- ✅ **Sort documents** by name, version and creation date

and some additional features:
- ✅ **Dates in relative format** e.g. 1 day ago
- ✅ **Styles** UI with Bulma CSS

## Architecture
### **Domain-Driven Design (DDD)**
```
src
├── application
│  ├── commands
│  │  └── CreateDocumentCommand.ts
│  └── services
│     └── DocumentService.ts
├── domain
│  └── Document.ts
├── infrastructure
│  ├── event-bus
│  │  └── EventBus.ts
│  ├── mappers
│  │  └── DocumentMapper.ts
│  ├── repositories
│  │  ├── DocumentRepository.ts
│  │  └── IDocumentRepository.ts
│  └── services
│     ├── ApiService.ts
│     └── WebSocketService.ts
├── presentation
│  ├── components
│  │  ├── AddDocumentButton.ts
│  │  ├── CellCreatedDate.ts
│  │  ├── CellList.ts
│  │  ├── CellTitle.ts
│  │  ├── CreateDocumentModal.ts
│  │  ├── Grid.ts
│  │  ├── Header.ts
│  │  ├── Notification.ts
│  │  └── SortBar.ts
│  ├── controllers
│  │  ├── DocumentController.ts
│  │  └── NotificationController.ts
│  └── views
│     ├── DocumentsGridView.ts
│     └── NotificationView.ts
├── styles
│  └── main.css
├── app.ts
└── main.ts
```

### **Design Patterns Used**
|
| Pattern | Where (files) | Purpose / Notes |
|---------|---------------|-----------------|
| Repository | `src/infrastructure/repositories/DocumentRepository.ts`, `IDocumentRepository.ts` | Encapsulates data access and persistence (currently localStorage). Makes it easy to swap storage implementations (API, IndexedDB, etc.) without changing business logic. |
| Observer / Event Bus | `src/infrastructure/event-bus/EventBus.ts` | Decouples components and controllers through events (publish/subscribe). Used for SORT_CHANGED and SHOW_MODAL. Implemented as a lightweight singleton for global dispatch. |
| Command | `src/application/commands/CreateDocumentCommand.ts` | Encapsulates a write operation (create document) including validation and repository interaction. Improves testability and intent-revealing API. |
| Factory / UI factory | `src/presentation/components/CreateDocumentModal.ts` | Factory centralize complex object/component creation (modal UI). Keeps construction details out of controllers. |
| Controller (MVC-like) | `src/presentation/controllers/*.ts` and `src/presentation/views/*.ts` | Controllers orchestrate app flows (DocumentController) while Views handle DOM rendering (DocumentsGridView, NotificationView). Keeps presentation logic separated from business rules. |
| CQRS (separation) | `src/application/services/DocumentService.ts` + Commands | Commands (write) and service queries (read/sort) are conceptually separated. This clarifies intent and allows optimizations later. |
| Dependency Injection (manual) | `src/app.ts` | Dependencies are constructed in one place and passed to controllers/services. Facilitates testing by allowing mocks to be injected. |


---

## Technical Stack
- **Typescript** - Type safety and modern JS features
- **Vite** - For fast build and dev server
- **Bulma CSS** - CSS tool to improve styles
- **Jest** - For testing 
- **Others** - Used conventional commits and GitFlow

## Future Enhancements
- [ ] Sort to work desc too
- [ ] Implement loadings
- [ ] Search functionality

## Author
**Marcos Tagliabue**
