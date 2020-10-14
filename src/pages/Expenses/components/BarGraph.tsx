import { Paper } from '@material-ui/core';
import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import { Member } from '../interfaces';

function BarGraph(props: any) {
  const { members } = props;
  return (
    <div>
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
    </div>
  );
}

export default BarGraph;
