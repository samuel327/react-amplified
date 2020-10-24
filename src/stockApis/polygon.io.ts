const axios = require('axios');
export const getForexPrevClose = () => {
  return axios
    .get(
      'https://api.polygon.io/v2/aggs/ticker/TSLA/prev?apiKey=0pZSRnSVRBxxsVLEBK_NCKmqUmnYcphI'
    )
    .then((res: any) => {
      console.log(res);
      return res.data;
    })
    .catch((e: any) => {
      console.log(e);
    });
};
