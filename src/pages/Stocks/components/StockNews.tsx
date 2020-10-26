import React, { useEffect, useState } from 'react';
import { getTickerNews } from '../../../stockApis/polygon.io';

interface StockNewsProps {
  stock: string;
}

function StockNews(props: StockNewsProps) {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    getTickerNews(props.stock)
      .then((res: any) => {
        console.log(res);
        setSummary(res[0].summary);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }, [props.stock]);
  return (
    <div>
      {props.stock} NEWS:
      <div>{summary}</div>
    </div>
  );
}

export default StockNews;
