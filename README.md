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

### **Design Patterns Used**

| Pattern | Implementation | Purpose |
|---------|----------------|---------|
| **Repository** | `DocumentRepository` | Abstracts data persistence (localStorage) |
| **Observer** | `EventBus` + `subscribe()` | Reactive UI updates |
| **Command** | `CreateDocumentCommand` | Encapsulates document creation logic |
| **Factory** | `createCreateDocumentModal()` | Constructs complex modal UI |
| **Singleton** | `EventBus` | Single source of truth for events |
| **MVC** | Controllers + Views | Separation of concerns |
| **CQRS** | Commands + Queries | Clear intent in operations |

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
