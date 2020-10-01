import React, { useState } from 'react';
import { Button, Paper, TextField } from '@material-ui/core';
import { DoughnutBudget } from '../components/charts/DoughnutBudget';

type Fun = 'fun';
type NotFun = 'not fun';

type Expense = {
  expenseName: string;
  dollarAmount: number;
  category: Fun | NotFun | string;
};

export function ExpensesCalculator() {
  const [totalAmount, updateTotalAmount] = useState<number>(0);
  const [item, setItem] = useState<Expense>({
    expenseName: 'Default',
    dollarAmount: 0,
    category: 'fun',
  });
  const [expenses, setExpenses] = useState<Expense[]>([
    { expenseName: 'Example', dollarAmount: 1000, category: 'fun' },
    { expenseName: 'Example 2', dollarAmount: 500, category: 'not fun' },
    { expenseName: 'Example 3', dollarAmount: 700, category: 'fun' },
  ]);

  const [labels, setLabels] = useState<string[]>(['Fun', 'Not Fun']);
  return (
    <div>
      <TextField
        placeholder={'Expense Name'}
        value={item.expenseName}
        onChange={(e: any) => {
          let name = e.target.value;
          let cpy = JSON.parse(JSON.stringify(item));
          cpy.expenseName = name;
          setItem(cpy);
        }}
      />
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
      <TextField placeholder={'Categories'} />

      <Button
        onClick={() => {
          updateTotalAmount((prev: any) => {
            let item1: number = Number(prev);
            let item2: number = Number(item.dollarAmount);

            setItem({ expenseName: '', dollarAmount: 0, category: 'not fun' });
            return item1 + item2;
          });
          setExpenses(() => {
            return [
              ...expenses,
              ...[
                {
                  expenseName: item.expenseName,
                  dollarAmount: item.dollarAmount,
                  category: 'not fun',
                },
              ],
            ];
          });
        }}
      >
        ADD
      </Button>
      <Button
        onClick={() => {
          updateTotalAmount(0);
          setExpenses([]);
          setLabels([]);
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
        <DoughnutBudget
          labels={labels}
          dataSetLabel={'Amount Spent Per Category'}
          dollarAmounts={expenses.map(
            (expense: Expense) => expense.dollarAmount
          )}
          itemColor={expenses.map((item) => {
            if (item.dollarAmount < 1000) {
              return 'rgb(0, 255, 0)';
            } else {
              return 'rgb(255, 0, 0)';
            }
          })}
        />
      </Paper>
    </div>
  );
}
