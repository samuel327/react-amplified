import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTickerNews } from '../../../stockApis/polygon.io';
import { getNews } from '../../../stockApis/rapidApi';

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

function readableDate(time: any) {
  let appendedWithZeros = time + '000';
  console.log(appendedWithZeros);
  let date = new Date(Number(appendedWithZeros));
  console.log(date);
  return date.toISOString().split('T')[0];
}
function StockNews(props: StockNewsProps) {
  const [news, setNews] = useState<News>();
  const [new2, setNews2] = useState<any>();

  useEffect(() => {
    getNews(props.stock).then((res: any) => {
      console.log(res.items.result[0]);
      setNews2(res.items.result[0]);
    });
  }, [props.stock]);
  if (new2) {
    return (
      <>
        <Card
          style={{
            width: 400,
            marginLeft: '5%',
            marginRight: 'auto',
            marginBottom: '5%',
          }}
        >
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                <> {new2.title}</>
              </Typography>
              <>{readableDate(new2.published_at)}</>
              <Typography variant="body2" color="textSecondary" component="p">
                <>{new2.summary}</>
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <a href={new2.link}>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </a>
          </CardActions>
        </Card>
      </>
    );
  } else {
    return <></>;
  }
}

export default StockNews;
