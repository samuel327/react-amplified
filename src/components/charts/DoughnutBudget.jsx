import React from 'react';
import Chart from 'chart.js';

export class DoughnutBudget extends React.Component {
  chartRef = React.createRef();

  componentDidMount() {
    const myChartRef = this.chartRef.current.getContext('2d');

    new Chart(myChartRef, {
      type: 'doughnut',
      data: {
        //Bring in data
        labels: this.props.labels,
        datasets: [
          {
            label: this.props.dataSetLabel,
            data: this.props.dollarAmounts,
            backgroundColor: this.props.itemColor,
          },
        ],
      },
      options: {
        //Customize chart options
      },
    });
  }
  render() {
    return (
      <div>
        <canvas id="myChart" ref={this.chartRef} />
      </div>
    );
  }
}
