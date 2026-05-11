import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <nav class="flex items-center justify-between gap-3 text-sm">
      <p class="text-slate-500">Page {{ page }} of {{ totalPages }}</p>
      <div class="flex gap-2">
        <button type="button" class="rounded-md border border-slate-200 px-3 py-2 disabled:opacity-40" [disabled]="page <= 1" (click)="pageChanged.emit(page - 1)">Previous</button>
        <button type="button" class="rounded-md border border-slate-200 px-3 py-2 disabled:opacity-40" [disabled]="page >= totalPages" (click)="pageChanged.emit(page + 1)">Next</button>
      </div>
    </nav>
  `,
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() pageSize = 12;
  @Input() total = 0;
  @Output() pageChanged = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }
}
