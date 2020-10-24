import React from 'react';
import PropTypes from 'prop-types';

import { scaleTime } from 'd3-scale';
import { utcDay, utcMonth } from 'd3-time';

import { ChartCanvas, Chart } from 'react-stockcharts';
import { CandlestickSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { last, timeIntervalBarWidth } from 'react-stockcharts/lib/utils';

class CandleStickChart extends React.Component {
  render() {
    const { type, width, data, ratio } = this.props;
    // const xAccessor = (d) => {
    //   console.log(d.date);
    //   return d.date;
    // };
    const xAccessor = (d) => {
      if (d) {
        const milliseconds = d.t;
        const dateObject = new Date(milliseconds);
        let date = dateObject;
        return date;
      }
    };
    const xExtents = [xAccessor(last(data)), xAccessor(data[10])];
    if (data) {
      return (
        <ChartCanvas
          height={400}
          ratio={ratio}
          width={width}
          margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
          type={type}
          seriesName="AAPL"
          data={data}
          xAccessor={xAccessor}
          xScale={scaleTime()}
          xExtents={xExtents}
        >
          <Chart
            id={1}
            yExtents={(d) => {
              //console.log(d, [d.h, d.l]);
              return [d.h, d.l];
              //return [d.high, d.low];
            }}
          >
            <XAxis axisAt="bottom" orient="bottom" ticks={10} />
            <YAxis axisAt="left" orient="left" ticks={10} />
            <CandlestickSeries width={timeIntervalBarWidth(utcDay)} />
          </Chart>
        </ChartCanvas>
      );
    }
  }
}

CandleStickChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
};

CandleStickChart.defaultProps = {
  type: 'svg',
};
CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;
