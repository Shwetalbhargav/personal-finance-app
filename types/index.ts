export interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  savings?: number; 
}

export interface Budget {
  _id: string;
  category: string;
  month: string;
  
  totalBudget?: number; 
}
