import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <button type="button" class="fixed inset-0 z-50 cursor-default bg-slate-950/40" aria-label="Close drawer" (click)="closed.emit()"></button>
      <aside class="fixed inset-y-0 right-0 z-50 w-full max-w-[var(--drawer-width)] overflow-y-auto bg-white shadow-modal dark:bg-slate-900" [style.--drawer-width]="width">
        <header class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h2 class="font-semibold">{{ title }}</h2>
          <button type="button" class="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100" (click)="closed.emit()">Close</button>
        </header>
        <div class="p-5">
          @if (content) {
            <ng-container *ngTemplateOutlet="content"></ng-container>
          } @else {
            <ng-content></ng-content>
          }
        </div>
      </aside>
    }
  `,
})
export class DrawerComponent {
  @Input() width: '320px' | '480px' | '640px' = '480px';
  @Input() title = 'Details';
  @Input() isOpen = false;
  @Input() content?: TemplateRef<unknown>;
  @Output() closed = new EventEmitter<void>();
}
