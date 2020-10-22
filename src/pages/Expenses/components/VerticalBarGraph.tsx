import { Paper } from '@material-ui/core';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Expense } from '../interfaces';

interface VerticalBarGraphProps {
  elevation: number;
  expenses: Expense[];
}

export function VerticalBarGraph(props: VerticalBarGraphProps) {
  const { expenses } = props;
  //console.log(JSON.stringify(expenses, null, 2));

  const data = {
    labels: expenses.map((item: Expense) => item.expenseName),
    datasets: [
      {
        label: 'Categories',
        data: expenses.map((item: Expense) => item.dollarAmount),
        backgroundColor: ['rgba(255,99, 200,0.8)', 'rgba(255,99,132,0.8)'],
      },
    ],
  };

  //data.datasets[0].data = arrExpenses;
  //console.log(data);
  return (
    <Paper elevation={props.elevation}>
      <Bar
        data={data}
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
  );
}
