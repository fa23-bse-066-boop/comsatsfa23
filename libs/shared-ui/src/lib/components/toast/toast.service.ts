import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  title: string;
  variant: ToastVariant;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly messages = signal<ToastMessage[]>([]);

  show(title: string, variant: ToastVariant = 'info'): void {
    const id = `toast_${Date.now()}`;
    this.messages.update((messages) => [...messages, { id, title, variant }]);
    window.setTimeout(() => this.dismiss(id), 3000);
  }

  dismiss(id: string): void {
    this.messages.update((messages) => messages.filter((message) => message.id !== id));
  }
}
