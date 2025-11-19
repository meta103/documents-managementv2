import type { SortByEnum } from "../../domain/Document";

export type EventType =
  | 'SORT_CHANGED'
  | 'SHOW_MODAL'

export interface EventPayload {
  SORT_CHANGED: { sortBy: SortByEnum };
  SHOW_MODAL: { show: true };
}

type EventListener<T extends EventType> = (payload: EventPayload[T]) => void;
class EventBusInstance {
  private listeners: Map<EventType, Set<EventListener<any>>> = new Map();

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

  emit<T extends EventType>(
    eventType: T,
    payload: EventPayload[T]
  ): void {
    const listenersSet = this.listeners.get(eventType);
    if (listenersSet) {
      listenersSet.forEach(listener => {
        try {
          listener(payload);
        } catch (error) {
          console.error(`Error in ${eventType} listener:`, error);
        }
      });
    }
  }


  //Limpia los listener (usar en tests)
  clear(): void {
    this.listeners.clear();
  }
}

export const EventBus = new EventBusInstance();