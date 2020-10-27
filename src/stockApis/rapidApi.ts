const axios = require('axios');
export function getNews(name: string) {
  return axios({
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/list',
    headers: {
      'content-type': 'application/octet-stream',
      'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      'x-rapidapi-key': 'f100667d87msh350d5678b976552p156a76jsn3f1c27caa872',
      useQueryString: true,
    },
    params: {
      category: name,
      region: 'US',
    },
  })
    .then((response: any) => {
      let str = response.request.responseText;
      return JSON.parse(str);
    })
    .catch((error: any) => {
      console.log(error);
    });
}
