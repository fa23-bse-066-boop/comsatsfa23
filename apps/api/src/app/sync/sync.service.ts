import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { MOCK_COMMITTEES, MOCK_JOIN_REQUESTS, MOCK_PAYMENTS, MOCK_USERS } from '@dcms/shared-types';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private readonly dbPath = process.env['VERCEL'] ? path.join('/tmp', 'db.json') : path.join(process.cwd(), 'db.json');

  // Initialize with mock data if no db exists
  private defaultState = {
    committees: MOCK_COMMITTEES,
    users: MOCK_USERS,
    payments: MOCK_PAYMENTS,
    joinRequests: MOCK_JOIN_REQUESTS,
    bankSettings: {
      accountTitle: '',
      accountNumber: '',
      bankName: '',
    }
  };

  getState() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const data = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (e) {
      this.logger.error('Failed to read db.json', e);
    }
    // Return default state if file doesn't exist
    return this.defaultState;
  }

  saveState(state: any) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(state, null, 2), 'utf8');
      return { success: true };
    } catch (e) {
      this.logger.error('Failed to write db.json', e);
      return { success: false, error: 'Failed to save data' };
    }
  }
}
