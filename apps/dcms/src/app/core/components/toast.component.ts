import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-[100] space-y-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div [class]="toastClass(toast.type)"
             class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium min-w-64">
          <span>{{ icon(toast.type) }}</span>
          <span>{{ toast.message }}</span>
          <button (click)="toastService.remove(toast.id)" class="ml-auto opacity-70 hover:opacity-100">✕</button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  toastService = inject(ToastService);

  toastClass(type: string): string {
    const m: Record<string, string> = {
      success: 'bg-emerald-700 text-white',
      error: 'bg-red-700 text-white',
      info: 'bg-blue-700 text-white',
    };
    return m[type] || 'bg-slate-700 text-white';
  }

  icon(type: string): string {
    return type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  }
}
