import { Paper } from '@material-ui/core';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Expense, PieChartItem } from '../interfaces';

const defaultPieChartState: PieChartItem[] = [
  { label: 'fun', amount_spent: 0 },
  { label: 'not fun', amount_spent: 0 },
];

function DoughnutGraph(props: any) {
  const { expenses } = props;
  const [graphData, setGraphData] = useState<PieChartItem[]>(
    cloneDeep(defaultPieChartState)
  );

  useEffect(() => {
    if (expenses && expenses.length > 0) {
      totalAmtsForGraph(expenses);
    } else if (expenses.length === 0) {
      setGraphData(cloneDeep(defaultPieChartState));
    }
  }, [expenses]);

  function totalAmtsForGraph(expensesArray: Expense[]) {
    const reducer = (accumulator: any, currentValue: any) => {
      return accumulator + currentValue;
    };

    let x: any = expensesArray.map((expense: Expense) => {
      if (expense.category === 'fun') {
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
      setGraphData((prevObject: PieChartItem[]) => {
        let cpy: PieChartItem[] = cloneDeep(prevObject);
        cpy[0].amount_spent = Number(xx);
        console.log(cpy);
        return cpy;
      });
    }

    let y: any = expensesArray.map((expense: Expense) => {
      if (expense.category === 'not fun') {
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
      setGraphData((prevObject: PieChartItem[]) => {
        let cpy: PieChartItem[] = cloneDeep(prevObject);
        cpy[1].amount_spent = Number(yy);
        console.log(cpy);
        return cpy;
      });
    }
    return;
  }

  const data = {
    labels: graphData.map((item: any) => item.label),
    datasets: [
      {
        data: graphData.map((item: any) => item.amount_spent),
        backgroundColor: ['rgba(255,99,132,0.2)', 'rgba(255,99,132,0.8)'],
      },
    ],
  };

  return (
    <Paper elevation={props.elevation}>
      <Pie data={data} />
    </Paper>
  );
}

export default DoughnutGraph;
