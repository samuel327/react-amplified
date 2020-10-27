import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import { getPolygonIOData } from '../../stockApis/polygon.io';
import { StockSelector } from './components/StockSelector';
import { Paper } from '@material-ui/core';
import StockNews from './components/StockNews';
import { RightDrawer } from './components/RightDrawer';

function mapper(objArray: any) {
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
    return newObj;
  });
  return newArrayOfObjects;
}

function StocksFunctional() {
  const [data, setFinancialData] = useState<any>();

  const [stock, setStock] = useState<string>('AAPL');
  const [today, setToday] = useState<string>('');
  useEffect(() => {
    let today = new Date();
    let todayAsString = today.toISOString().split('T')[0];
    setToday(todayAsString);
    const getData = async () => {
      let data = await getPolygonIOData(stock, todayAsString);
      if (data) {
        let data2 = mapper(data);
        if (data2) {
          setFinancialData(data2);
        }
      }
    };
    getData();
  }, [stock]);
  return (
    <>
      <StockSelector stock={stock} setStock={setStock} />

      <div>
        {stock} TICKER GRAPH 2020-01-01 thru {today}
      </div>
      <Paper style={{ margin: '5%', width: 750 }}>
        {data && <Chart type={'hybrid'} data={data} stock={stock} />}
      </Paper>
      <StockNews stock={stock} />
      <RightDrawer />
    </>
  );
}

export default StocksFunctional;
