import React, { SetStateAction, useState } from 'react';
import {
  Button,
  IconButton,
  MenuItem,
  Paper,
  TextField,
} from '@material-ui/core';
import { DoughnutBudget } from '../components/charts/DoughnutBudget';
import * as MdIcons from 'react-icons/md';
import { styles } from './styles/styles';

const labels = ['fun', 'not_fun'];

type Expense = {
  expenseName: string;
  dollarAmount: number | string;
  category: string;
};

type PieChartItem = {
  label: string;
  amount_spent: number;
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
        setDataForGraph((prevObject: PieChartItem) => {
          let cpy: PieChartItem[] = deepCopy(prevObject);
          cpy[0].amount_spent =
            Number(cpy[0].amount_spent) + Number(item.dollarAmount);
          return cpy;
        });
      }
      if (label === 'not_fun') {
        setDataForGraph((prevObject: PieChartItem) => {
          let cpy: PieChartItem[] = deepCopy(prevObject);
          cpy[1].amount_spent =
            Number(cpy[1].amount_spent) + Number(item.dollarAmount);
          return cpy;
        });
      }
      return item1 + item2;
    });
    setExpenses(() => {
      return [
        ...expenses,
        ...[
          {
            expenseName: item.expenseName,
            dollarAmount: item.dollarAmount,
            category: label,
          },
        ],
      ];
    });
  }

  const [hover, setHover] = useState(false);
  function toggleHover() {
    setHover(!hover);
  }

  function selectCategory() {
    return (
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
    );
  }

  function selectItemCategory(index: number) {
    return (
      <TextField
        placeholder={'Categories'}
        select
        value={expenses[index].category}
        onChange={(e) => {
          console.log(e.target.value);
          setExpenses((prev: any) => {
            let cpy = deepCopy(expenses);
            cpy[index].category = e.target.value;
            return cpy;
          });
          setDataForGraph((prev: any) => {
            let cpy = deepCopy(prev);
            if (e.target.value === 'not_fun') {
              cpy[0].amount_spent =
                Number(cpy[0].amount_spent) -
                Number(expenses[index].dollarAmount);
              cpy[1].amount_spent =
                Number(cpy[1].amount_spent) +
                Number(expenses[index].dollarAmount);
              console.log(cpy);
              return cpy;
            } else if (e.target.value === 'fun') {
              cpy[1].amount_spent =
                Number(cpy[1].amount_spent) -
                Number(expenses[index].dollarAmount);
              cpy[0].amount_spent =
                Number(cpy[0].amount_spent) +
                Number(expenses[index].dollarAmount);
              console.log(cpy);
              return cpy;
            }
          });
        }}
      >
        {labels.map((option) => {
          return <MenuItem value={option}>{option}</MenuItem>;
        })}
      </TextField>
    );
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
          onClick={() => {
            setItem({
              expenseName: `Expense ${expenses.length + 1}`,
              dollarAmount: '',
              category: '',
            });
          }}
          onChange={(e: any) => {
            let num = e.target.value;
            let cpy = JSON.parse(JSON.stringify(item));
            cpy.dollarAmount = num;
            cpy.category = label;
            setItem(cpy);
          }}
        />

        {selectCategory()}
        <Button onClick={() => add()}>ADD</Button>
        <div
          style={hover ? styles.onHover : styles.static}
          onMouseEnter={toggleHover}
          onMouseLeave={toggleHover}
          onClick={() => {
            updateTotalAmount(0);
            setExpenses([]);
            setDataForGraph(deepCopy(defaultPieChartState));
            setItem({
              expenseName: `Expense 1`,
              dollarAmount: 0,
              category: '',
            });
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
            expenses.map((expense: Expense, index: number) => {
              const { expenseName, dollarAmount, category } = expense;
              return (
                <div
                  style={{
                    display: 'flex',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ marginRight: 12 }}>{expenseName}: </div>
                  <div>${dollarAmount}</div>
                  {selectItemCategory(index)}
                  <div>{'___________ ' + index}</div>
                  <IconButton
                    size={'small'}
                    onClick={() => {
                      console.log(expenses, expenses.length);
                      console.log('REMOVE: ' + index);
                      setExpenses((prev: Expense[]) => {
                        //remove object from an array
                        return prev.filter(
                          (expense1: Expense) =>
                            expense1.expenseName != expense.expenseName
                        );
                      });
                      updateTotalAmount((prevTotal: number) => {
                        return prevTotal - Number(expense.dollarAmount);
                      });
                      console.log(dataForGraph);
                      if (expenses[index].category === 'fun') {
                        console.log('delete fun item');
                        setDataForGraph((prevDataforGraph: any) => {
                          let cpy = deepCopy(prevDataforGraph);
                          cpy[0].amount_spent =
                            Number(cpy[0].amount_spent) -
                            Number(expenses[index].dollarAmount);
                          return cpy;
                        });
                      } else if (expenses[index].category === 'not_fun') {
                        console.log('delete not_fun item');
                        setDataForGraph((prevDataforGraph: any) => {
                          let cpy = deepCopy(prevDataforGraph);
                          cpy[1].amount_spent =
                            Number(cpy[1].amount_spent) -
                            Number(expenses[index].dollarAmount);
                          return cpy;
                        });
                      }
                    }}
                  >
                    <MdIcons.MdClear />
                  </IconButton>
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
