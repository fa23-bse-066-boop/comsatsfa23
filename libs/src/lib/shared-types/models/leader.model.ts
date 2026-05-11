export interface Leader {
  id: string;
  name: string;
  email: string;
  phone: string;
  activeCommittees: string[];
  stats: {
    successRate: number;
    collectionsAmount: number;
    complaints: number;
  };
  joinedAt: string;
}
