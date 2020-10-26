import React, { useEffect, useState } from 'react';
import { getTickerNews } from '../../../stockApis/polygon.io';

interface StockNewsProps {
  stock: string;
}

function StockNews(props: StockNewsProps) {
  const [news, setNews] = useState<any>({});

  useEffect(() => {
    getTickerNews(props.stock)
      .then((res: any) => {
        console.log(res);
        setNews(res[0]);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }, [props.stock]);
  return (
    <div>
      {props.stock} NEWS:
      {news.timestamp && <div>{news.timestamp.split('T')[0]}</div>}
      <div>{news.summary}</div>
    </div>
  );
}

export default StockNews;
