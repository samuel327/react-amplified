import React, { useState } from 'react';
import { Button, Paper, TextField } from '@material-ui/core';

type Expense = {
  expenseName: string;
  dollarAmount: number;
};

export function ExpensesCalculator() {
  const [totalAmount, updateTotalAmount] = useState<number>(0);
  const [itemExpense, setItemExpense] = useState<any>();
  const [expenses, setExpenses] = useState<Expense[]>([
    { expenseName: 'Example', dollarAmount: 1000 },
  ]);
  return (
    <div>
      <TextField placeholder={'Expense Name'} />
      <TextField
        placeholder={'Dollar Amount'}
        value={itemExpense}
        onChange={(e: any) => setItemExpense(e.target.value)}
      />

      <Button
        onClick={() => {
          updateTotalAmount((prev: any) => {
            let item: number = Number(prev);
            let item2: number = Number(itemExpense);

            setItemExpense('');
            return item + item2;
          });
          setExpenses(() => {
            return [
              ...expenses,
              ...[{ expenseName: 'Changed', dollarAmount: itemExpense }],
            ];
          });
        }}
      >
        ADD
      </Button>
      <Button
        onClick={() => {
          updateTotalAmount(0);
        }}
      >
        Clear
      </Button>
      {totalAmount}
      <Paper>
        List of Expenses
        {expenses &&
          expenses.map((expense: Expense) => {
            const { expenseName, dollarAmount } = expense;
            return (
              <div>
                {expenseName}______{dollarAmount}
              </div>
            );
          })}
      </Paper>
    </div>
  );
}
