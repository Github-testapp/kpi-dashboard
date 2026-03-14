export type TabKey = 'overview' | 'sales' | 'work' | 'billing';

export interface MonthlyRecord {
  id: string;
  month: string;
  revenue: number;
  profit: number;
  expense: number;
  customers: number;
  deals: number;
  closed: number;
  workHours: number;
  manDays: number;
}

export interface BillingRecord {
  id: string;
  client: string;
  amount: number;
  invoiceDate: string;
  dueDate: string;
  status: 'unpaid' | 'paid' | 'overdue';
}

export interface WorkRecord {
  id: string;
  month: string;
  project: string;
  hours: number;
  manDays: number;
}

export interface DashboardState {
  activeTab: TabKey;
  monthly: MonthlyRecord[];
  billing: BillingRecord[];
  work: WorkRecord[];
  sheetOpen: boolean;
  sheetType: 'monthly' | 'billing' | 'work' | null;

  setActiveTab: (tab: TabKey) => void;
  openSheet: (type: 'monthly' | 'billing' | 'work') => void;
  closeSheet: () => void;
  addMonthly: (r: MonthlyRecord) => void;
  updateMonthly: (r: MonthlyRecord) => void;
  deleteMonthly: (id: string) => void;
  addBilling: (r: BillingRecord) => void;
  updateBillingStatus: (id: string, status: BillingRecord['status']) => void;
  deleteBilling: (id: string) => void;
  addWork: (r: WorkRecord) => void;
  deleteWork: (id: string) => void;
}