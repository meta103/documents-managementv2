// Event Bus: Patrón centralizado para eventos de la aplicación

/**
 * EventBus - Patrón Observer/Pub-Sub centralizado
 * 
 * DDD/Event-Driven Architecture:
 * - Desacopla completamente componentes
 * - Un único punto de verdad para eventos
 * - Fácil de testear y mantener
 * - Escalable: agregar nuevos eventos sin romper nada
 * 
 * Mejor que listeners globales porque:
 * - Type-safe
 * - Listeners nombrados (fácil debuguear)
 * - Fácil unsubscribirse
 * - Patrón profesional usado en Redux, Vuex, MobX
 */

export type EventType =
  | 'SORT_CHANGED'
  | 'SHOW_MODAL'
  | 'DOCUMENTS_LOADED'
  | 'DOCUMENT_CREATED'
  | 'NOTIFICATION_SHOWN';

export interface EventPayload {
  SORT_CHANGED: { sortBy: 'name' | 'version' | 'createdAt' };
  SHOW_MODAL: { show: true };
  DOCUMENTS_LOADED: { count: number };
  DOCUMENT_CREATED: { documentId: string };
  NOTIFICATION_SHOWN: { message: string };
}

type EventListener<T extends EventType> = (payload: EventPayload[T]) => void;

/**
 * EventBus - Singleton
 */
class EventBusInstance {
  private listeners: Map<EventType, Set<EventListener<any>>> = new Map();

  /**
   * Registra un listener para un evento
   */
  on<T extends EventType>(
    eventType: T,
    listener: EventListener<T>
  ): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    const listenersSet = this.listeners.get(eventType)!;
    listenersSet.add(listener);

    // Retorna función para unsubscribirse
    return () => {
      listenersSet.delete(listener);
    };
  }

  /**
   * Listener de una sola ejecución
   */
  once<T extends EventType>(
    eventType: T,
    listener: EventListener<T>
  ): () => void {
    const unsubscribe = this.on(eventType, (payload) => {
      listener(payload);
      unsubscribe();
    });
    return unsubscribe;
  }

  /**
   * Emite un evento
   */
  emit<T extends EventType>(
    eventType: T,
    payload: EventPayload[T]
  ): void {
    console.log(`📢 [EventBus] ${eventType}:`, payload);

    const listenersSet = this.listeners.get(eventType);
    if (listenersSet) {
      listenersSet.forEach(listener => {
        try {
          listener(payload);
        } catch (error) {
          console.error(`❌ Error in ${eventType} listener:`, error);
        }
      });
    }
  }

  /**
   * Limpia todos los listeners (útil para tests)
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * Obtiene número de listeners para debugging
   */
  getListenerCount(eventType: EventType): number {
    return this.listeners.get(eventType)?.size || 0;
  }
}

// Singleton
export const EventBus = new EventBusInstance();
