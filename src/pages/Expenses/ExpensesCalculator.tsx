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

const labels = ['fun', 'not_fun'];

export function ExpensesCalculator() {
  const [totalAmount, updateTotalAmount] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [item, setItem] = useState<Expense>({
    expenseName: `Expense ${expenses.length + 1}`,
    dollarAmount: 0,
    category: 'fun',
    member: '',
    hover: false,
  });

  const defaultItem: Expense = {
    expenseName: `Expense ${expenses.length + 2}`,
    dollarAmount: 0,
    category: 'not fun',
    member: '',
    hover: false,
  };

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
      console.log('CALLED', expensesList);

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
    console.log(expenseItem);
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
    let dl = Number(item.dollarAmount);
    if (typeof dl === 'number') {
      if (dl !== 0 && !isNaN(dl) && item.member !== '') {
        await saveExpense();
        updateTotalAmount((prev: any) => {
          let item1: number = Number(prev);
          let item2: number = Number(item.dollarAmount);

          setItem(defaultItem);

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

  function selectCategory() {
    return (
      <TextField
        placeholder={'Categories'}
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

  return (
    <>
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
          placeholder={'Categories'}
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
        </TextField>

        {selectCategory()}
        <Button onClick={() => add()} style={styles.sideMargins}>
          ADD
        </Button>
        <Button
          style={hoverClearBtn ? {} : {}}
          onMouseEnter={toggleHoverClearBtn}
          onMouseLeave={toggleHoverClearBtn}
          onClick={() => {
            updateTotalAmount(0);
            setExpenses([]);
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

      <Paper style={{ margin: 50, display: 'flex', padding: 20 }}>
        List of Expenses:
        <Paper style={{ margin: 50, width: '35%', padding: 15 }}>
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
                  {
                    <IconButton
                      size={'small'}
                      onClick={async () => {
                        await deleteThis(expenses[index]);
                        setItem((prev: Expense) => {
                          let cpy = cloneDeep(defaultItem);
                          cpy.expenseName = `Expense ${expenses.length}`;
                          return cpy;
                        });
                      }}
                    >
                      <MdIcons.MdClear />
                    </IconButton>
                  }
                </div>
              );
            })}
        </Paper>
        <DoughnutGraph expenses={expenses} />
        <BarGraph members={members} />
      </Paper>
    </>
  );
}
