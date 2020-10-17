import React, { useEffect } from 'react';
import { polygonClient, restClient, websocketClient } from 'polygon.io';
import { getForexPrevClose } from '../../stockApis/polygon.io';

const rest = restClient('0pZSRnSVRBxxsVLEBK_NCKmqUmnYcphI');

export function Stocks() {
  useEffect(() => {
    async function getData() {
      let res = await getForexPrevClose();
      console.log(res);
    }
    getData();
  }, []);
  return <div>Stocks.</div>;
}
