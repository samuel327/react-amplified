export interface Expense  {
    expenseName: string;
    dollarAmount: number | string;
    category: string;
    hover: boolean; 
  };
  
export interface PieChartItem  {
    label: string;
    amount_spent: number;
  };