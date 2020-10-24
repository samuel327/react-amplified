import { Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getAggregatedData } from '../../../../rds_apis/apiCalls';

export function AggregatedExpenses(props: any) {
  const [aggExpenses, setAggExpenses] = useState<any>([
    { type: 'default', Total: 1 },
  ]);
  async function getData() {
    let data = await getAggregatedData();
    if (data) {
      setAggExpenses(data);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 2000);
  }, [props.expenses, props.categories]);

  const data = {
    labels: aggExpenses.map((item: any) => item.type),
    datasets: [
      {
        label: 'Categories',
        data: aggExpenses.map((item: any) => item.Total),
        backgroundColor: getColors(),
      },
    ],
  };

  function getColors() {
    let colors = aggExpenses.map((exp: any) => {
      return 'rgba(255,99, 200,0.8)';
    });
    return colors;
  }

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
