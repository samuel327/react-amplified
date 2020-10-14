import React, { useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  MenuItem,
  Paper,
  TextField,
} from '@material-ui/core';
import { DoughnutBudget } from '../../components/charts/DoughnutBudget';
import * as MdIcons from 'react-icons/md';
import { styles } from '../styles/styles';
import cloneDeep from 'lodash/cloneDeep';
import { Expense, Member, PieChartItem } from './interfaces';
import { getMembers } from '../../rds_apis/apiCalls';
import { HorizontalBar } from 'react-chartjs-2';
import { API, graphqlOperation } from 'aws-amplify';
import { listExpenses } from '../../graphql/queries';
import { createExpense, createTodo } from '../../graphql/mutations';

const labels = ['fun', 'not_fun'];
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

  const [dataForGraph, setDataForGraph] = useState<any>([
    { label: 'fun', amount_spent: 0 },
    { label: 'not_fun', amount_spent: 0 },
  ]);

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const getData = async () => {
      let res = await getMembers();
      console.log(res);
      setMembers(res);
    };

    const getExpenses = async () => {
      try {
        const expensesData: any = await API.graphql(
          graphqlOperation(listExpenses)
        );
        let expensesList = expensesData.data.listExpenses.items;
        expensesList = expensesList.map((expense: any) => {
          return { ...expense, ...{ hover: false } };
        });
        console.log('EXPENSES: ', expensesList);
        totalAmtsForGraph(expensesList);
        setExpenses(expensesList);
      } catch (e) {
        console.log(e);
      }
    };

    getData();
    getExpenses();
  }, []);

  function totalAmtsForGraph(expensesArray: Expense[]) {
    const reducer = (accumulator: any, currentValue: any) => {
      return accumulator + currentValue;
    };
    let x = expensesArray
      .map((expense: Expense) => {
        if (expense.category === 'fun') {
          return expense.dollarAmount;
        }
      })
      .reduce(reducer);
    console.log('X', x);

    setDataForGraph((prevObject: PieChartItem) => {
      let cpy: PieChartItem[] = deepCopy(prevObject);
      cpy[0].amount_spent = Number(cpy[0].amount_spent) + Number(x);
      return cpy;
    });

    return;
  }

  async function saveExpense() {
    try {
      console.log(item);
      delete item.hover;
      let res = await API.graphql(
        graphqlOperation(createExpense, { input: item })
      );
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }

  async function add() {
    console.log(item.dollarAmount, typeof item.dollarAmount);
    let dl = Number(item.dollarAmount);
    if (typeof dl === 'number') {
      if (dl !== 0 && !isNaN(dl) && item.member !== '') {
        await saveExpense();
        updateTotalAmount((prev: any) => {
          let item1: number = Number(prev);
          let item2: number = Number(item.dollarAmount);

          setItem(defaultItem);

          if (item.category === 'fun') {
            setDataForGraph((prevObject: PieChartItem) => {
              let cpy: PieChartItem[] = deepCopy(prevObject);
              cpy[0].amount_spent =
                Number(cpy[0].amount_spent) + Number(item.dollarAmount);
              return cpy;
            });
          }
          if (item.category === 'not_fun') {
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
                category: item.category,
                member: item.member,
                hover: item.hover,
              },
            ],
          ];
        });
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

  const [hover, setHover] = useState(false);
  const toggleHover = () => setHover(!hover);

  const [hoverClearBtn, setHoverClearBtn] = useState(false);
  const toggleHoverClearBtn = () => setHoverClearBtn(!hoverClearBtn);

  const toggleHoverItem = (location: number) => {
    setExpenses((prev: Expense[]) => {
      let cpy: Expense[] = cloneDeep(prev);
      cpy[location].hover = !cpy[location].hover;
      return cpy;
    });
  };

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
            setDataForGraph(deepCopy(defaultPieChartState));
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
                  onMouseEnter={() => toggleHoverItem(index)}
                  onMouseLeave={() => toggleHoverItem(index)}
                  style={{
                    display: 'flex',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ marginRight: 12 }}>{expenseName}: </div>
                  <div>${dollarAmount}</div>
                  <div style={{ marginLeft: 10 }}>
                    {selectItemCategory(index)}
                  </div>

                  {hover && (
                    <IconButton
                      size={'small'}
                      onClick={() => {
                        console.log(expenses, expenses.length);
                        console.log('REMOVE: ' + index);
                        let dlrAmt = expenses[index].dollarAmount;
                        console.log(dlrAmt);
                        setExpenses((prev: Expense[]) => {
                          //remove object from an array
                          let cpy = cloneDeep(prev);
                          return cpy.filter(
                            (expense1: Expense) =>
                              expense1.expenseName !== expense.expenseName
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
                              Number(cpy[0].amount_spent) - Number(dlrAmt);
                            return cpy;
                          });
                        } else if (expenses[index].category === 'not_fun') {
                          console.log('delete not_fun item');
                          setDataForGraph((prevDataforGraph: any) => {
                            let cpy = deepCopy(prevDataforGraph);
                            cpy[1].amount_spent =
                              Number(cpy[1].amount_spent) - Number(dlrAmt);
                            return cpy;
                          });
                        }

                        setItem((prev: Expense) => {
                          let cpy = cloneDeep(prev);
                          cpy.expenseName = `Expense ${expenses.length}`;
                          return cpy;
                        });
                      }}
                    >
                      <MdIcons.MdClear />
                    </IconButton>
                  )}
                </div>
              );
            })}
        </Paper>
        <Paper style={{ margin: 50, width: 250, height: 130 }}>
          <DoughnutBudget
            labels={dataForGraph.map((item: any) => item.label)}
            dataSetLabel={'Amount Spent Per Category'}
            dollarAmounts={dataForGraph.map((item: any) => item.amount_spent)}
            itemColor={dataForGraph.map((item: any) => {
              if (item.label === 'fun') {
                return 'rgb(132, 195, 193)';
              } else {
                return 'rgb(46, 139, 87)';
              }
            })}
          />
        </Paper>
        <Paper>
          <HorizontalBar
            data={{
              labels: members.map((member: Member) => member.name),
              datasets: [
                {
                  label: 'Who Spends More',
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  borderColor: 'rgba(255,99,132,1)',
                  borderWidth: 1,
                  hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                  hoverBorderColor: 'rgba(255,99,132,1)',
                  data: members.map((member: Member) => member.amount_spent),
                },
              ],
            }}
            options={{
              scales: {
                xAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            }}
          />
        </Paper>
      </Paper>
    </>
  );
}
