// import React, { useEffect } from 'react';
// import { polygonClient, restClient, websocketClient } from 'polygon.io';
// import { getForexPrevClose } from '../../stockApis/polygon.io';

// //const rest = restClient('0pZSRnSVRBxxsVLEBK_NCKmqUmnYcphI');

// async function getData() {
//   let res = await getForexPrevClose();
//   console.log(res);
// }

// export function Stocks() {
//   useEffect(() => {
//     getData();
//   }, []);

//   return <div>Stocks.</div>;
// }

import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { getData } from './utils';
import { getPolygonIOData } from '../../stockApis/polygon.io';

import { TypeChooser } from 'react-stockcharts/lib/helper';

class ChartComponent extends React.Component {
  componentDidMount() {
    getPolygonIOData().then((data) => {
      console.log(data);
      this.setState({ data });
    });
    // getData().then((data) => {
    //   //console.log(data);
    //   this.setState({ data });
    // });
  }
  render() {
    if (this.state == null) {
      return <div>Loading...</div>;
    }
    return (
      <TypeChooser>
        {(type) => <Chart type={type} data={this.state.data} />}
      </TypeChooser>
    );
  }
}

export default ChartComponent;
