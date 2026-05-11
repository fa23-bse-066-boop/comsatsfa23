import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
        <section class="w-full max-w-lg rounded-lg bg-white shadow-modal dark:bg-slate-900">
          <header class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <h2 class="text-base font-semibold">{{ title }}</h2>
            <button type="button" class="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100" (click)="closed.emit()">Close</button>
          </header>
          <div class="p-5">
            @if (content) {
              <ng-container *ngTemplateOutlet="content"></ng-container>
            } @else {
              <ng-content></ng-content>
            }
          </div>
        </section>
      </div>
    }
  `,
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Details';
  @Input() content?: TemplateRef<unknown>;
  @Output() closed = new EventEmitter<void>();
}
