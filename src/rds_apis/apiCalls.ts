const axios = require('axios');
export const getMembers = () => {
  return axios
    .get('https://vevtwy1ksj.execute-api.us-east-2.amazonaws.com/dev/members')
    .then((res: any) => {
      console.log(res);
      return res.data;
    })
    .catch((e: any) => {
      console.log(e);
    });
};
