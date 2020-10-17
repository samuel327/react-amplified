import React, { useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  MenuItem,
  Paper,
  TextField,
} from '@material-ui/core';
import * as MdIcons from 'react-icons/md';
import { styles } from '../styles/styles';
import cloneDeep from 'lodash/cloneDeep';
import { Expense, Member, PieChartItem } from './interfaces';
import { getMembers } from '../../rds_apis/apiCalls';
import { API, graphqlOperation } from 'aws-amplify';
import { listExpenses } from '../../graphql/queries';
import { createExpense, deleteExpense } from '../../graphql/mutations';
import BarGraph from './components/BarGraph';
import DoughnutGraph from './components/DoughnutGraph';

const labels = ['fun', 'not fun'];

function selectCategory(setItem: Function, item: Expense) {
  return (
    <TextField
      style={{ width: 100 }}
      select
      value={item.category}
      onChange={(e) => {
        setItem((prev: Expense) => {
          let cpy = cloneDeep(prev);
          cpy.category = e.target.value;
          return cpy;
        });
      }}
    >
      {labels.map((option) => {
        return <MenuItem value={option}>{option}</MenuItem>;
      })}
    </TextField>
  );
}

const defaultItem = (expenses: Expense[]) => {
  let item: Expense = {
    expenseName: `Expense ${expenses.length + 1}`,
    dollarAmount: 0,
    category: '',
    member: '',
    hover: false,
  };

  return item;
};

export function ExpensesCalculator() {
  const [totalAmount, updateTotalAmount] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [item, setItem] = useState<Expense>(defaultItem(expenses));
  const [members, setMembers] = useState<Member[]>([]);
  const [hover, setHover] = useState(false);
  const toggleHover = () => setHover(!hover);
  const [hoverClearBtn, setHoverClearBtn] = useState(false);
  const toggleHoverClearBtn = () => setHoverClearBtn(!hoverClearBtn);

  useEffect(() => {
    const getData = async () => {
      let res = await getMembers();
      setMembers(res);
    };
    getData();
    getExpenses();
  }, []);

  const getExpenses = async () => {
    try {
      const expensesData: any = await API.graphql(
        graphqlOperation(listExpenses)
      );
      let expensesList = expensesData.data.listExpenses.items;
      expensesList = expensesList.map((expense: any) => {
        return { ...expense, ...{ hover: false } };
      });
      setExpenses(expensesList);
      totalAmtsForGraph(expensesList);
    } catch (e) {
      setExpenses([]);
      updateTotalAmount(0);
      console.log(e);
    }
  };

  function totalAmtsForGraph(expensesArray: Expense[]) {
    const reducer = (accumulator: any, currentValue: any) => {
      return accumulator + currentValue;
    };
    let total: number = expensesArray
      .map((expense: Expense) => Number(expense.dollarAmount))
      .reduce(reducer);
    console.log(total);
    updateTotalAmount(total);
    return;
  }

  async function saveExpense() {
    try {
      delete item.hover;
      await API.graphql(graphqlOperation(createExpense, { input: item }));
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteThis(expenseItem: any) {
    try {
      await API.graphql(
        graphqlOperation(deleteExpense, {
          input: { id: expenseItem.id },
        })
      );
    } catch (e) {
      console.log(e);
    }
    await getExpenses();
  }

  async function add() {
    console.log(item);
    let dl = Number(item.dollarAmount);
    if (typeof dl === 'number') {
      if (
        dl !== 0 &&
        !isNaN(dl) &&
        item.member !== '' &&
        item.category !== ''
      ) {
        await saveExpense();
        updateTotalAmount((prev: any) => {
          let item1: number = Number(prev);
          let item2: number = Number(item.dollarAmount);

          setItem(defaultItem(expenses));

          return item1 + item2;
        });
        await getExpenses();
      }

      setMembers((prev: Member[]) => {
        let cpy = cloneDeep(prev);
        cpy.map((member: Member) => {
          if (member.name === item.member) {
            member.amount_spent = Number(item.dollarAmount);
          }
        });
        return cpy;
      });
    }
  }

  return (
    <div style={{ backgroundColor: 'rgba(102, 255, 178, .1)' }}>
      <div
        style={hover ? styles.hoverInputFields : styles.inputFields}
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
      >
        <TextField
          placeholder={'Expense Name'}
          value={item.expenseName}
          onChange={(e: any) => {
            let name = e.target.value;
            let cpy = cloneDeep(item);
            cpy.expenseName = name;
            setItem(cpy);
          }}
          style={styles.sideMargins}
        />

        <TextField
          placeholder={'Dollar Amount'}
          value={item.dollarAmount}
          onClick={() => {
            setItem((prev: Expense) => {
              let cpy = cloneDeep(prev);
              cpy.dollarAmount = '';
              return cpy;
            });
          }}
          style={styles.sideMargins}
          onChange={(e: any) => {
            let num = e.target.value;
            let cpy = cloneDeep(item);
            cpy.dollarAmount = num;
            setItem(cpy);
          }}
        />
        <TextField
          style={styles.sideMargins}
          select
          value={item.member}
          onChange={(e: any) => {
            setItem((prev: any) => {
              let cpy = cloneDeep(prev);
              cpy.member = e.target.value;
              return cpy;
            });
          }}
        >
          {members.map((member: Member) => {
            return <MenuItem value={member.name}>{member.name}</MenuItem>;
          })}
          <MenuItem value={'joint'}>Joint</MenuItem>
        </TextField>

        {selectCategory(setItem, item)}
        <Button onClick={() => add()} style={styles.sideMargins}>
          ADD
        </Button>
        <Button
          style={hoverClearBtn ? {} : {}}
          onMouseEnter={toggleHoverClearBtn}
          onMouseLeave={toggleHoverClearBtn}
          onClick={() => {
            updateTotalAmount(0);
            Promise.all(
              expenses.map((expense: Expense) => {
                deleteThis(expense);
              })
            )
              .then((res) => console.log(res))
              .catch((e) => console.log(e))
              .finally(() => console.log('FINISHED DELETING EXPENSES!'));
            setItem({
              expenseName: `Expense 1`,
              dollarAmount: 0,
              category: '',
              member: '',
              hover: false,
            });
          }}
        >
          CLEAR
        </Button>
        <div style={{ marginTop: 10, marginLeft: 25 }}>${totalAmount}</div>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 'wrap',
          height: '500px',

          padding: 20,
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <div>List of Expenses:</div>
        <Paper style={{ margin: 50, width: '25%', padding: 15, height: 280 }}>
          {expenses &&
            expenses.map((expense: Expense, index: number) => {
              const { expenseName, dollarAmount, hover } = expense;
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
                  <div style={{ marginLeft: 10 }}></div>
                  {expenses[index].category}
                  <IconButton
                    size={'small'}
                    onClick={async () => {
                      await deleteThis(expenses[index]);
                      setItem((prev: Expense) => {
                        let cpy = cloneDeep(defaultItem(expenses));
                        cpy.expenseName = `Expense ${expenses.length}`;
                        return cpy;
                      });
                    }}
                  >
                    <MdIcons.MdClear />
                  </IconButton>
                </div>
              );
            })}
        </Paper>
        <div style={{ margin: 50 }}>
          <div style={{ width: 250, height: 130, margin: 15 }}>
            <DoughnutGraph expenses={expenses} />
          </div>
          <div style={{ width: 250, height: 130, margin: 15 }}>
            <BarGraph members={members} expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}
