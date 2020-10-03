import React, { SetStateAction, useState } from 'react';
import { Button, MenuItem, Paper, TextField } from '@material-ui/core';
import { DoughnutBudget } from '../components/charts/DoughnutBudget';

const labels = ['fun', 'not_fun'];

type Expense = {
  expenseName: string;
  dollarAmount: number;
  category: string;
};

type PieChartItem = {
  label: string;
  amount_spent: number;
};

const styles = {
  static: {
    width: 50,
    height: 40,
    'background-color': 'black',
    color: 'yellow',
    'text-align': 'center',
    'vertical-align': 'center',
    'line-height': '40px',
    'border-radius': '25px',
  },

  onHover: {
    width: 50,
    height: 40,
    'background-color': 'yellow',
    color: 'black',
    'text-align': 'center',
    'justify-content': 'center',
    'vertical-align': 'center',
    cursor: 'pointer',
    padding: 'auto',
    'line-height': '40px',
    'border-radius': '25px',
  },
};

const defaultPieChartState: PieChartItem[] = [
  { label: 'fun', amount_spent: 0 },
  { label: 'not_fun', amount_spent: 0 },
];

function deepCopy(arg: object) {
  return JSON.parse(JSON.stringify(arg));
}
export function ExpensesCalculator() {
  const [totalAmount, updateTotalAmount] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [item, setItem] = useState<Expense>({
    expenseName: `Expense ${expenses.length + 1}`,
    dollarAmount: 0,
    category: 'fun',
  });
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

  function add() {
    updateTotalAmount((prev: any) => {
      let item1: number = Number(prev);
      let item2: number = Number(item.dollarAmount);

      setItem({
        expenseName: `Expense ${expenses.length + 2}`,
        dollarAmount: 0,
        category: 'not fun',
      });

      if (label === 'fun') {
        let cpy = funObject;
        cpy.fun = Number(cpy.fun) + Number(item.dollarAmount);
        setFunObject(cpy);
        let cpy2 = dataForGraph;
        cpy2[0].amount_spent = Number(cpy2[0].amount_spent) + Number(cpy.fun);
        setDataForGraph(cpy2);
      }
      if (label === 'not_fun') {
        let cpy = notFunObject;
        cpy.fun = Number(cpy.not_fun) + Number(item.dollarAmount);
        console.log(cpy.fun);
        setNotFunObject(cpy);
        let cpy2 = dataForGraph;
        cpy2[1].amount_spent = Number(cpy2[1].amount_spent) + Number(cpy.fun);
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
  }

  const [hover, setHover] = useState(false);
  function toggleHover() {
    setHover(!hover);
  }

  return (
    <>
      <div style={{ display: 'flex', margin: '5%' }}>
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

        <Button onClick={() => add()}>ADD</Button>
        <div
          style={hover ? styles.onHover : styles.static}
          onMouseEnter={toggleHover}
          onMouseLeave={toggleHover}
          onClick={() => {
            updateTotalAmount(0);
            setExpenses([]);
            setDataForGraph(deepCopy(defaultPieChartState));
          }}
        >
          Clear
        </div>
        <div style={{ marginTop: 10, marginLeft: 25 }}>{totalAmount}</div>
      </div>

      <Paper style={{ margin: 50 }}>
        List of Expenses
        <Paper style={{ margin: 50 }}>
          {expenses &&
            expenses.map((expense: Expense) => {
              const { expenseName, dollarAmount } = expense;
              return (
                <div style={{ display: 'flex' }}>
                  <div style={{ marginRight: 12 }}>{expenseName}: </div>
                  <div>${dollarAmount}</div>
                </div>
              );
            })}
        </Paper>
        <DoughnutBudget
          labels={dataForGraph.map((item: any) => item.label)}
          dataSetLabel={'Amount Spent Per Category'}
          dollarAmounts={dataForGraph.map((item: any) => item.amount_spent)}
          itemColor={dataForGraph.map((item: any) => {
            if (item.label === 'fun') {
              return 'rgb(255, 255, 0)';
            } else {
              return 'rgb(0, 0, 0)';
            }
          })}
        />
      </Paper>
    </>
  );
}
