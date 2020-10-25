import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import { getPolygonIOData } from '../../stockApis/polygon.io';
import { TypeChooser } from 'react-stockcharts/lib/helper';

interface OHLCKeys {
  date: any;
  open: any;
  high: any;
  low: any;
  close: any;
  volume: any;
}

function mapper(objArray: any) {
  let keys = Object.keys(objArray[0]);
  console.log(keys);
  let newObj: OHLCKeys = {
    date: '',
    open: '',
    high: '',
    low: '',
    close: '',
    volume: '',
  };

  let newArrayOfObjects = objArray.map((obj: any) => {
    const milliseconds = JSON.parse(JSON.stringify(obj.t));
    const dateObject = new Date(milliseconds);
    let date = dateObject;
    let newObj = {
      date: date,
      open: obj.o,
      high: obj.h,
      low: obj.l,
      close: obj.c,
      volume: obj.v,
    };
    console.log(newObj);
    return newObj;
  });
  console.log(newArrayOfObjects);
  return newArrayOfObjects;
}

function StocksFunctional() {
  const [data, setFinancialData] = useState<any>();

  useEffect(() => {
    const getData = async () => {
      let data = await getPolygonIOData();
      if (data) {
        let data2 = mapper(data);
        console.log(data2);
        if (data2) {
          setFinancialData(data2);
        }
      }
    };
    getData();
  }, []);
  return (
    <>
      <div>APPLE TICKER GRAPH 2018-01-01 thru 2020-10-22</div>
      {data && (
        <TypeChooser>
          {(type: any) => <Chart type={type} data={data} />}
        </TypeChooser>
      )}
    </>
  );
}

export default StocksFunctional;
