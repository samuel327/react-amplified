import React, { useState } from 'react';
import { Button, Paper, TextField } from '@material-ui/core';

type Expense = {
  expenseName: string;
  dollarAmount: number;
};

export function ExpensesCalculator() {
  const [totalAmount, updateTotalAmount] = useState<number>(0);
  const [item, setItem] = useState<Expense>({
    expenseName: 'Default',
    dollarAmount: 0,
  });
  const [expenses, setExpenses] = useState<Expense[]>([
    { expenseName: 'Example', dollarAmount: 1000 },
  ]);
  return (
    <div>
      <TextField placeholder={'Expense Name'} />
      <TextField
        placeholder={'Dollar Amount'}
        value={item.dollarAmount}
        onChange={(e: any) => {
          let num = e.target.value;
          let cpy = JSON.parse(JSON.stringify(item));
          cpy.dollarAmount = num;
          setItem(cpy);
        }}
      />

      <Button
        onClick={() => {
          updateTotalAmount((prev: any) => {
            let item1: number = Number(prev);
            let item2: number = Number(item.dollarAmount);

            setItem({ expenseName: '', dollarAmount: 0 });
            return item1 + item2;
          });
          setExpenses(() => {
            return [
              ...expenses,
              ...[{ expenseName: 'Changed', dollarAmount: item.dollarAmount }],
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
