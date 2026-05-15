import type { LucideIcon } from 'lucide-react';

export interface GeneratedReport {
  name: string;
  category: string;
  date: string;
  type: string;
}

export interface ReportCategory {
  title: string;
  icon: LucideIcon;
  count: number;
  color: string;
}