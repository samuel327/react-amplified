import { Paper } from '@material-ui/core';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import { Expense, Member, PieChartItem } from '../interfaces';

const defaultMemberState: Member[] = [
  {
    ID: 0,
    name: '',
    amount_spent: 0,
  },
  {
    ID: 0,
    name: '',
    amount_spent: 0,
  },
];

function BarGraph(props: any) {
  const { members, expenses } = props;

  const [members1, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (expenses && expenses.length > 0) {
      totalAmtsForGraph(expenses);
    } else if (expenses.length === 0) {
      setMembers(cloneDeep(defaultMemberState));
    }
  }, [expenses]);

  function totalAmtsForGraph(expensesArray: Expense[]) {
    const reducer = (accumulator: any, currentValue: any) => {
      return accumulator + currentValue;
    };

    let x: any = expensesArray.map((expense: Expense) => {
      if (expense.member === 'Samuel') {
        console.log(expense.dollarAmount);
        if (Number(expense.dollarAmount)) {
          return Number(expense.dollarAmount);
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });

    let xx = x.reduce(reducer);

    if (Number(xx) >= 0) {
      console.log(expensesArray, members1);
      setMembers((prevObject: Member[]) => {
        let cpy: Member[] = cloneDeep(prevObject);
        cpy[0].amount_spent = Number(xx);
        cpy[0].name = 'Samuel';
        console.log(cpy);
        return cpy;
      });
    }

    let y: any = expensesArray.map((expense: Expense) => {
      if (expense.member === 'Elizabeth') {
        console.log(expense.dollarAmount);
        if (Number(expense.dollarAmount)) {
          return Number(expense.dollarAmount);
        } else {
          return 0;
        }
      } else return 0;
    });

    let yy = y.reduce(reducer);

    if (Number(yy) >= 0) {
      setMembers((prevObject: Member[]) => {
        let cpy: Member[] = cloneDeep(prevObject);
        cpy[1].amount_spent = Number(yy);
        cpy[1].name = 'Elizabeth';
        console.log(cpy);
        return cpy;
      });
    }
    return;
  }
  return (
    <div>
      <Paper style={{ width: 250, height: 130 }}>
        <HorizontalBar
          data={{
            labels: members1.map((member: Member) => member.name),
            datasets: [
              {
                label: 'Who Spends More',
                backgroundColor: [
                  'rgba(255,99,132,0.2)',
                  'rgba(255,99,132,0.8)',
                ],
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: members1.map((member: Member) => member.amount_spent),
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
    </div>
  );
}

export default BarGraph;
