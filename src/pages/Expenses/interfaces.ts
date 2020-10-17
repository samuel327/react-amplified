export interface Expense {
  expenseName: string;
  dollarAmount: number | string;
  category: string;
  subCategory: string;
  member: string;
  hover?: boolean;
}

export interface Member {
  ID: number;
  name: string;
  amount_spent: number;
}

export interface PieChartItem {
  label: string;
  amount_spent: number;
}
