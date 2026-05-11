export type NotificationCategory = 'Payment' | 'Committee' | 'System' | 'Trust';

export interface Notification {
  id: string;
  userId: string;
  category: NotificationCategory;
  title: string;
  body: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}
