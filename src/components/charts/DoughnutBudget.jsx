import React from 'react';
import Chart from 'chart.js';

export class DoughnutBudget extends React.Component {
  constructor(props) {
    super(props);

    this.state = { chart: null };
  }
  chartRef = React.createRef();
  componentDidMount() {
    const myChartRef = this.chartRef.current.getContext('2d');

    var myChar = new Chart(myChartRef, {
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
    this.setState({ chart: myChar });
  }

  componentDidUpdate() {
    console.log('UPDATED');
    console.log(this.props.dollarAmounts);
    this.state.chart.data.datasets[0].data = this.props.dollarAmounts;
    this.state.chart.update();
  }

  render() {
    return (
      <div>
        <canvas id="myChart" ref={this.chartRef} />
      </div>
    );
  }
}
