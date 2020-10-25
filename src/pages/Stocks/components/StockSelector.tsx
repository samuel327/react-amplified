import React, { useEffect, useState } from 'react';
import { getTickers } from '../../../stockApis/polygon.io';

interface StockSelectorProps {
  stock: string;
  setStock: Function;
}

export function StockSelector(props: StockSelectorProps) {
  const [options, setOptions] = useState<any>([]);
  useEffect(() => {
    getTickers(1)
      .then((res: any) => {
        console.log(res);
        setOptions(res);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }, []);
  return (
    <div>
      <label htmlFor="stockSelector"> Choose stock:</label>
      <select
        id="stockSelector"
        value={props.stock}
        onChange={(e: any) => {
          console.log(e);
          let stock = e.target.value;
          props.setStock(stock);
        }}
      >
        <option>AAPL</option>
        <option>TSLA</option>
        <option>AMZN</option>
        <option>AMD</option>
        {options.map((option: any) => {
          return <option>{option.ticker}</option>;
        })}
      </select>
    </div>
  );
}
