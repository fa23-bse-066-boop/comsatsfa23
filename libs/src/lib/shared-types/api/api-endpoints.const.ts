export const API_BASE = '/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    REFRESH: `${API_BASE}/auth/refresh`,
    OTP: `${API_BASE}/auth/otp/verify`,
    LOGOUT: `${API_BASE}/auth/logout`,
  },
  USER: {
    PROFILE: `${API_BASE}/users/me`,
    WALLET: `${API_BASE}/users/me/wallet`,
    TRANSACTIONS: `${API_BASE}/users/me/transactions`,
    TRUST_SCORE: `${API_BASE}/users/me/trust-score`,
    NOTIFICATIONS: `${API_BASE}/users/me/notifications`,
    KYC: `${API_BASE}/users/me/kyc`,
  },
  COMMITTEES: {
    LIST: `${API_BASE}/committees`,
    DETAIL: (id: string) => `${API_BASE}/committees/${id}`,
    JOIN: (id: string) => `${API_BASE}/committees/${id}/join`,
    MY: `${API_BASE}/committees/my`,
  },
  PAYMENTS: {
    LIST: `${API_BASE}/payments`,
    CREATE: `${API_BASE}/payments`,
    DETAIL: (id: string) => `${API_BASE}/payments/${id}`,
  },
  TICKETS: {
    LIST: `${API_BASE}/tickets`,
    CREATE: `${API_BASE}/tickets`,
    DETAIL: (id: string) => `${API_BASE}/tickets/${id}`,
    REPLY: (id: string) => `${API_BASE}/tickets/${id}/messages`,
  },
  ADMIN: {
    USERS: {
      LIST: `${API_BASE}/admin/users`,
      DETAIL: (id: string) => `${API_BASE}/admin/users/${id}`,
      SUSPEND: (id: string) => `${API_BASE}/admin/users/${id}/suspend`,
      BAN: (id: string) => `${API_BASE}/admin/users/${id}/ban`,
      KYC_APPROVE: (id: string) => `${API_BASE}/admin/users/${id}/kyc/approve`,
    },
    COMMITTEES: {
      LIST: `${API_BASE}/admin/committees`,
      CREATE: `${API_BASE}/admin/committees`,
      UPDATE: (id: string) => `${API_BASE}/admin/committees/${id}`,
      PAUSE: (id: string) => `${API_BASE}/admin/committees/${id}/pause`,
      CLOSE: (id: string) => `${API_BASE}/admin/committees/${id}/close`,
    },
    PAYMENTS: {
      LIST: `${API_BASE}/admin/payments`,
      APPROVE: (id: string) => `${API_BASE}/admin/payments/${id}/approve`,
      REJECT: (id: string) => `${API_BASE}/admin/payments/${id}/reject`,
    },
    PAYOUTS: {
      LIST: `${API_BASE}/admin/payouts`,
      RELEASE: (id: string) => `${API_BASE}/admin/payouts/${id}/release`,
      HOLD: (id: string) => `${API_BASE}/admin/payouts/${id}/hold`,
    },
    JOIN_REQUESTS: {
      LIST: `${API_BASE}/admin/join-requests`,
      APPROVE: (id: string) => `${API_BASE}/admin/join-requests/${id}/approve`,
      REJECT: (id: string) => `${API_BASE}/admin/join-requests/${id}/reject`,
    },
    REPORTS: {
      DAILY_COLLECTIONS: `${API_BASE}/admin/reports/daily-collections`,
      MONTHLY_REVENUE: `${API_BASE}/admin/reports/monthly-revenue`,
      USER_GROWTH: `${API_BASE}/admin/reports/user-growth`,
      OUTSTANDING_DUES: `${API_BASE}/admin/reports/outstanding-dues`,
      FRAUD_ALERTS: `${API_BASE}/admin/reports/fraud-alerts`,
    },
    AUDIT_LOGS: `${API_BASE}/admin/audit-logs`,
    LEADERS: `${API_BASE}/admin/leaders`,
    DASHBOARD: `${API_BASE}/admin/dashboard`,
  },
} as const;
