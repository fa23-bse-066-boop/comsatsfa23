import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { AdminLayoutComponent } from '../../core/components/admin-layout.component';
import { Committee, CommitteeStatus, CommitteeType } from '@dcms/shared-types';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-committees',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="p-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-white">Committees</h1>
          <button (click)="openCreate()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
            + Create Committee
          </button>
        </div>

        <!-- Table -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table class="w-full">
            <thead class="bg-slate-800">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Amount</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Members</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Duration</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (c of data.committees(); track c.id) {
                <tr class="border-t border-slate-800 hover:bg-slate-800/40">
                  <td class="px-5 py-4">
                    <p class="text-sm font-medium text-white">{{ c.name }}</p>
                    <p class="text-xs text-slate-400">{{ c.type }}</p>
                  </td>
                  <td class="px-5 py-4 text-sm text-white">PKR {{ c.monthlyAmount | number }}</td>
                  <td class="px-5 py-4 text-sm text-white">{{ c.currentMembers }}/{{ c.totalMembers }}</td>
                  <td class="px-5 py-4 text-sm text-slate-400">{{ c.duration }} months</td>
                  <td class="px-5 py-4">
                    <span [class]="statusClass(c.status)" class="text-xs px-2 py-1 rounded-full font-medium">{{ c.status }}</span>
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <button (click)="openEdit(c)" class="text-blue-400 hover:text-blue-300 text-sm font-medium">Edit</button>
                      <button (click)="confirmDelete(c)" class="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              }
              @if (data.committees().length === 0) {
                <tr><td colspan="6" class="px-5 py-10 text-center text-slate-500">No committees yet. Create one!</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div class="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg">
            <div class="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 class="text-lg font-bold text-white">{{ editingId() ? 'Edit Committee' : 'Create Committee' }}</h2>
              <button (click)="closeModal()" class="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Committee Name *</label>
                <input [(ngModel)]="form.name" type="text" placeholder="e.g. Karachi Business Circle"
                  class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1">Monthly Amount (PKR) *</label>
                  <input [(ngModel)]="form.monthlyAmount" type="number" placeholder="10000"
                    class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1">Total Members *</label>
                  <input [(ngModel)]="form.totalMembers" type="number" placeholder="10"
                    class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1">Duration (months) *</label>
                  <input [(ngModel)]="form.duration" type="number" placeholder="12"
                    class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1">Start Date *</label>
                  <input [(ngModel)]="form.startDate" type="date"
                    class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1">Type</label>
                  <select [(ngModel)]="form.type" class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    <option value="Fixed">Fixed</option>
                    <option value="Lottery">Lottery</option>
                    <option value="Bid">Bid</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select [(ngModel)]="form.status" class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              @if (formError()) {
                <p class="text-red-400 text-sm">{{ formError() }}</p>
              }
            </div>
            <div class="flex gap-3 p-6 border-t border-slate-800">
              <button (click)="closeModal()" class="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition">Cancel</button>
              <button (click)="saveCommittee()" class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                {{ editingId() ? 'Save Changes' : 'Create' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Delete Confirm Modal -->
      @if (deleteTarget()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div class="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-sm p-6">
            <h2 class="text-lg font-bold text-white mb-2">Delete Committee</h2>
            <p class="text-slate-400 mb-6">Are you sure you want to delete <span class="text-white font-medium">{{ deleteTarget()!.name }}</span>? This cannot be undone.</p>
            <div class="flex gap-3">
              <button (click)="deleteTarget.set(null)" class="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition">Cancel</button>
              <button (click)="doDelete()" class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition">Delete</button>
            </div>
          </div>
        </div>
      }
    </app-admin-layout>
  `,
})
export class CommitteesComponent {
  data = inject(DataService);
  private toast = inject(ToastService);

  showModal = signal(false);
  editingId = signal<string | null>(null);
  deleteTarget = signal<Committee | null>(null);
  formError = signal<string | null>(null);

  form = {
    name: '',
    monthlyAmount: null as number | null,
    totalMembers: null as number | null,
    duration: null as number | null,
    startDate: '',
    type: 'Fixed' as CommitteeType,
    status: 'Draft' as CommitteeStatus,
  };

  openCreate() {
    this.editingId.set(null);
    this.form = { name: '', monthlyAmount: null, totalMembers: null, duration: null, startDate: '', type: CommitteeType.Fixed, status: CommitteeStatus.Draft };
    this.formError.set(null);
    this.showModal.set(true);
  }

  openEdit(c: Committee) {
    this.editingId.set(c.id);
    this.form = {
      name: c.name,
      monthlyAmount: c.monthlyAmount,
      totalMembers: c.totalMembers,
      duration: c.duration,
      startDate: c.startDate.split('T')[0],
      type: c.type,
      status: c.status,
    };
    this.formError.set(null);
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  saveCommittee() {
    if (!this.form.name?.trim()) { this.formError.set('Committee name is required'); return; }
    if (!this.form.monthlyAmount || this.form.monthlyAmount <= 0) { this.formError.set('Monthly amount must be greater than 0'); return; }
    if (!this.form.totalMembers || this.form.totalMembers <= 0) { this.formError.set('Total members must be greater than 0'); return; }
    if (!this.form.duration || this.form.duration <= 0) { this.formError.set('Duration must be greater than 0'); return; }
    if (!this.form.startDate) { this.formError.set('Start date is required'); return; }

    if (this.editingId()) {
      this.data.updateCommittee(this.editingId()!, {
        name: this.form.name,
        monthlyAmount: this.form.monthlyAmount!,
        totalMembers: this.form.totalMembers!,
        duration: this.form.duration!,
        startDate: new Date(this.form.startDate).toISOString(),
        type: this.form.type,
        status: this.form.status,
      });
      this.toast.show('Committee updated successfully', 'success');
    } else {
      this.data.createCommittee({
        name: this.form.name,
        monthlyAmount: this.form.monthlyAmount!,
        totalMembers: this.form.totalMembers!,
        duration: this.form.duration!,
        startDate: new Date(this.form.startDate).toISOString(),
        type: this.form.type,
        status: this.form.status,
      });
      this.toast.show('Committee created successfully', 'success');
    }
    this.closeModal();
  }

  confirmDelete(c: Committee) { this.deleteTarget.set(c); }

  doDelete() {
    if (this.deleteTarget()) {
      this.data.deleteCommittee(this.deleteTarget()!.id);
      this.toast.show('Committee deleted', 'error');
      this.deleteTarget.set(null);
    }
  }

  statusClass(status: string): string {
    const m: Record<string, string> = {
      Active: 'bg-emerald-900/30 text-emerald-400',
      Paused: 'bg-amber-900/30 text-amber-400',
      Closed: 'bg-red-900/30 text-red-400',
      Draft: 'bg-slate-700 text-slate-400',
      Completed: 'bg-blue-900/30 text-blue-400',
    };
    return m[status] || 'bg-slate-700 text-slate-400';
  }
}
