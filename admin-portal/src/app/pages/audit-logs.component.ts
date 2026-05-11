import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../core/admin-data.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-5">
      <h1 class="text-3xl font-bold">Audit Logs</h1>
      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50"><tr><th class="p-3">Time</th><th class="p-3">Admin</th><th class="p-3">Action</th><th class="p-3">Target</th><th class="p-3">IP</th></tr></thead>
          <tbody>
            @for (log of data.auditLogs(); track log.id) {
              <tr class="border-t border-slate-100"><td class="p-3">{{ log.timestamp | date: 'short' }}</td><td class="p-3">{{ log.adminId }}</td><td class="p-3">{{ log.action }}</td><td class="p-3">{{ log.targetType }} / {{ log.targetId }}</td><td class="p-3">{{ log.ipAddress }}</td></tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class AuditLogsComponent {
  readonly data = inject(AdminDataService);
}
