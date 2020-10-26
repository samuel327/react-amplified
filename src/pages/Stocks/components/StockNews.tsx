import React, { useEffect, useState } from 'react';
import { getTickerNews } from '../../../stockApis/polygon.io';

interface StockNewsProps {
  stock: string;
}

interface News {
  symbols: string[];
  title: string;
  url: string;
  source: string;
  summary: string;
  image: string;
  timestamp: string;
  keywords: string[];
}

function StockNews(props: StockNewsProps) {
  const [news, setNews] = useState<News>();

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
  if (news) {
    return (
      <div>
        {<div>{news.timestamp.split('T')[0]}</div>}
        {news.title}

        <div>{news.summary}</div>
        <a href={news.url}>{news.url}</a>
      </div>
    );
  } else {
    return <></>;
  }
}

export default StockNews;
