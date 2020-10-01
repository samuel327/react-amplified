import React, { SetStateAction, useState } from 'react';
import { Button, MenuItem, Paper, TextField } from '@material-ui/core';
import { DoughnutBudget } from '../components/charts/DoughnutBudget';

const labels = ['fun', 'not_fun'];

type Expense = {
  expenseName: string;
  dollarAmount: number;
  category: string;
};

const defaultPieChartState = [
  { label: 'fun', amount_spent: 0 },
  { label: 'not_fun', amount_spent: 0 },
];

export function ExpensesCalculator() {
  const [totalAmount, updateTotalAmount] = useState<number>(0);
  const [item, setItem] = useState<Expense>({
    expenseName: 'Default',
    dollarAmount: 0,
    category: 'fun',
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [funObject, setFunObject] = useState<any>({ fun: 0 });
  const [notFunObject, setNotFunObject] = useState<any>({ not_fun: 0 });
  const [dataForGraph, setDataForGraph] = useState<any>([
    { label: 'fun', amount_spent: 0 },
    { label: 'not_fun', amount_spent: 0 },
  ]);

  const [label, setLabel] = useState<string>('fun');
  const handleChangeLabel = (event: any) => {
    setLabel(event.target.value);
  };
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
      <TextField
        placeholder={'Categories'}
        select
        value={label}
        onChange={handleChangeLabel}
      >
        {labels.map((option) => {
          return <MenuItem value={option}>{option}</MenuItem>;
        })}
      </TextField>

      <Button
        onClick={() => {
          updateTotalAmount((prev: any) => {
            let item1: number = Number(prev);
            let item2: number = Number(item.dollarAmount);

            setItem({ expenseName: '', dollarAmount: 0, category: 'not fun' });

            if (label === 'fun') {
              let cpy = funObject;
              cpy.fun = Number(cpy.fun) + Number(item.dollarAmount);
              setFunObject(cpy);
              let cpy2 = dataForGraph;
              cpy2[0].amount_spent =
                Number(cpy2[0].amount_spent) + Number(cpy.fun);
              setDataForGraph(cpy2);
            }
            if (label === 'not_fun') {
              let cpy = notFunObject;
              cpy.fun = Number(cpy.not_fun) + Number(item.dollarAmount);
              console.log(cpy.fun);
              setNotFunObject(cpy);
              let cpy2 = dataForGraph;
              cpy2[1].amount_spent =
                Number(cpy2[1].amount_spent) + Number(cpy.fun);
              setDataForGraph(cpy2);
            }
            return item1 + item2;
          });
          setExpenses(() => {
            let fun: string = 'fun';
            return [
              ...expenses,
              ...[
                {
                  expenseName: item.expenseName,
                  dollarAmount: item.dollarAmount,
                  category: fun,
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
          setDataForGraph(defaultPieChartState);
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
          labels={dataForGraph.map((item: any) => item.label)}
          dataSetLabel={'Amount Spent Per Category'}
          dollarAmounts={dataForGraph.map((item: any) => item.amount_spent)}
          itemColor={dataForGraph.map((item: any) => {
            if (item.label === 'fun') {
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
