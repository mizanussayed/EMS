export interface GeneratedReport {
  name: string;
  category: string;
  date: string;
  type: string;
}

export interface ReportCategory {
  title: string;
  count: number;
  color: string;
}