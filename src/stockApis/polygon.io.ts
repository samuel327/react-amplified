const axios = require('axios');
//apiKey=0pZSRnSVRBxxsVLEBK_NCKmqUmnYcphI
export const getPolygonIOData = (company: string, today: string) => {
  return axios
    .get(
      `https://api.polygon.io/v2/aggs/ticker/${company}/range/1/day/2020-01-01/${today}?sort=asc&apiKey=0pZSRnSVRBxxsVLEBK_NCKmqUmnYcphI`
    )
    .then((res: any) => {
      //console.log(JSON.stringify(res.data.results, null, 2));
      return res.data.results;
    })
    .catch((e: any) => {
      console.log(e);
    });
};

// Aggregates ( Bars )

// GET/v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{from}/{to}
