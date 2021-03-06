import { axios_base } from '../axios_base';
const axios = require('axios');

export const getMembers = () => {
  return axios
    .get('https://vevtwy1ksj.execute-api.us-east-2.amazonaws.com/dev/members')
    .then((res: any) => {
      //console.log(res);
      return res.data;
    })
    .catch((e: any) => {
      console.log(e);
    });
};

export function getCategories() {
  return axios
    .get(
      'https://vevtwy1ksj.execute-api.us-east-2.amazonaws.com/dev/categories'
    )
    .then((res: any) => {
      //console.log(res);
      return res.data;
    })
    .catch((e: any) => {
      console.log(e);
    });
}

export function setNewCategory(category: string) {
  const data = JSON.stringify({
    tag: 'addCategory',
    newCategory: category,
  });
  console.log(data);
  return axios_base
    .post('/categories', data)
    .then((res: any) => {
      console.log(res);
      return res.data;
    })
    .catch((e: any) => {
      console.log(e);
    });
}

export function removeCategory(category: string) {
  const data = JSON.stringify({
    tag: 'removeCategory',
    category: category,
  });
  console.log(data);
  return axios_base
    .post('/categories', data)
    .then((res: any) => {
      console.log(res);
      return res.data;
    })
    .catch((e: any) => {
      console.log(e);
    });
}

export function getAggregatedData() {
  return axios_base
    .get('/aggregatedexpenses')
    .then((res: any) => {
      console.log(res);
      return res.data;
    })
    .catch((e: any) => {
      console.log(e);
    });
}

export function resetExpenses() {
  return axios_base
    .get('/aggregatedexpenses')
    .then((res: any) => {
      console.log(res);
      return res.data;
    })
    .catch((e: any) => {
      console.log(e);
    });
}
