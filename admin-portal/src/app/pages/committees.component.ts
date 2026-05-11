import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminDataService } from '../core/admin-data.service';
import { Committee, CommitteeStatus, CommitteeType } from '@dcms/shared-types';

@Component({
  selector: 'app-committees',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="space-y-5">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">Committees</h1>
          <p class="text-slate-500">Create, edit, and manage committees.</p>
        </div>
        <button (click)="openCreate()"
          class="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition">
          + Create Committee
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Name</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Amount</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Members</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Duration</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th class="p-4 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (c of data.committees(); track c.id) {
              <tr class="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                <td class="p-4">
                  <p class="font-medium">{{ c.name }}</p>
                  <p class="text-xs text-slate-500">{{ c.type }}</p>
                </td>
                <td class="p-4">PKR {{ c.monthlyAmount | number }}</td>
                <td class="p-4">{{ c.currentMembers }}/{{ c.totalMembers }}</td>
                <td class="p-4 text-slate-500">{{ c.duration }} months</td>
                <td class="p-4">
                  <span [class]="statusClass(c.status)" class="rounded-full px-2 py-0.5 text-xs font-medium">{{ c.status }}</span>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <a [routerLink]="['/committees', c.id]" class="text-sm font-medium text-brand-600 hover:text-brand-700">View</a>
                    <button (click)="openEdit(c)" class="text-sm font-medium text-brand-600 hover:text-brand-700">Edit</button>
                    <button (click)="confirmDelete(c)" class="text-sm font-medium text-red-500 hover:text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            }
            @if (data.committees().length === 0) {
              <tr><td colspan="6" class="p-10 text-center text-slate-400">No committees yet. Create one!</td></tr>
            }
          </tbody>
        </table>
      </div>
    </section>

    <!-- Create / Edit Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div class="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-modal dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
            <h2 class="text-lg font-bold">{{ editingId() ? 'Edit Committee' : 'Create Committee' }}</h2>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
          </div>
          <div class="space-y-4 p-6">
            <div>
              <label class="mb-1 block text-sm font-medium">Committee Name *</label>
              <input [(ngModel)]="form.name" type="text" placeholder="e.g. Karachi Business Circle"
                class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-sm font-medium">Monthly Amount (PKR) *</label>
                <input [(ngModel)]="form.monthlyAmount" type="number" placeholder="10000"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium">Total Members *</label>
                <input [(ngModel)]="form.totalMembers" type="number" placeholder="10"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-sm font-medium">Duration (months) *</label>
                <input [(ngModel)]="form.duration" type="number" placeholder="12"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium">Start Date *</label>
                <input [(ngModel)]="form.startDate" type="date"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-sm font-medium">Type</label>
                <select [(ngModel)]="form.type"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                  <option value="Fixed">Fixed</option>
                  <option value="Lottery">Lottery</option>
                  <option value="Bid">Bid</option>
                </select>
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium">Status</label>
                <select [(ngModel)]="form.status"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
            @if (formError()) {
              <p class="text-sm text-red-500">{{ formError() }}</p>
            }
          </div>
          <div class="flex gap-3 border-t border-slate-200 p-6 dark:border-slate-800">
            <button (click)="closeModal()" class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition">Cancel</button>
            <button (click)="save()" class="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition">
              {{ editingId() ? 'Save Changes' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Delete Confirm -->
    @if (deleteTarget()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div class="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-modal dark:border-slate-700 dark:bg-slate-900">
          <h2 class="text-lg font-bold">Delete Committee</h2>
          <p class="mt-2 text-slate-500">Delete <strong class="text-slate-900 dark:text-white">{{ deleteTarget()!.name }}</strong>? This cannot be undone.</p>
          <div class="mt-6 flex gap-3">
            <button (click)="deleteTarget.set(null)" class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 transition">Cancel</button>
            <button (click)="doDelete()" class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition">Delete</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class CommitteesComponent {
  readonly data = inject(AdminDataService);

  showModal = signal(false);
  editingId = signal<string | null>(null);
  deleteTarget = signal<Committee | null>(null);
  formError = signal<string | null>(null);

  form = this.emptyForm();

  private emptyForm() {
    return { name: '', monthlyAmount: null as number | null, totalMembers: null as number | null, duration: null as number | null, startDate: '', type: CommitteeType.Fixed as CommitteeType, status: CommitteeStatus.Draft as CommitteeStatus };
  }

  openCreate() {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.formError.set(null);
    this.showModal.set(true);
  }

  openEdit(c: Committee) {
    this.editingId.set(c.id);
    this.form = { name: c.name, monthlyAmount: c.monthlyAmount, totalMembers: c.totalMembers, duration: c.duration, startDate: c.startDate.split('T')[0], type: c.type, status: c.status };
    this.formError.set(null);
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  save() {
    if (!this.form.name?.trim()) { this.formError.set('Name is required'); return; }
    if (!this.form.monthlyAmount || this.form.monthlyAmount <= 0) { this.formError.set('Monthly amount must be > 0'); return; }
    if (!this.form.totalMembers || this.form.totalMembers <= 0) { this.formError.set('Total members must be > 0'); return; }
    if (!this.form.duration || this.form.duration <= 0) { this.formError.set('Duration must be > 0'); return; }
    if (!this.form.startDate) { this.formError.set('Start date is required'); return; }

    const payload: Partial<Committee> = {
      name: this.form.name,
      monthlyAmount: this.form.monthlyAmount!,
      totalMembers: this.form.totalMembers!,
      duration: this.form.duration!,
      startDate: new Date(this.form.startDate).toISOString(),
      type: this.form.type,
      status: this.form.status,
    };

    if (this.editingId()) {
      this.data.updateCommittee(this.editingId()!, payload);
    } else {
      this.data.createCommittee(payload);
    }
    this.closeModal();
  }

  confirmDelete(c: Committee) { this.deleteTarget.set(c); }

  doDelete() {
    if (this.deleteTarget()) {
      this.data.deleteCommittee(this.deleteTarget()!.id);
      this.deleteTarget.set(null);
    }
  }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      Paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      Closed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return m[status] || 'bg-slate-100 text-slate-600';
  }
}
