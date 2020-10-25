import React from 'react';
import PropTypes from 'prop-types';

import { scaleTime } from 'd3-scale';
import { utcDay } from 'd3-time';

import { ChartCanvas, Chart } from 'react-stockcharts';
import { CandlestickSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { last, timeIntervalBarWidth } from 'react-stockcharts/lib/utils';

class CandleStickChart extends React.Component {
  render() {
    const { type, width, data, ratio } = this.props;
    const xAccessor = (d) => {
      return d.date;
    };

    const xExtents = [xAccessor(last(data)), xAccessor(data[10])];

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
            return [d.high, d.low];
          }}
        >
          <XAxis axisAt="bottom" orient="bottom" ticks={20} />
          <YAxis axisAt="left" orient="left" ticks={15} />
          <CandlestickSeries width={timeIntervalBarWidth(utcDay)} />
        </Chart>
      </ChartCanvas>
    );
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
