import React, { useEffect, useState } from 'react';
import { getTickers } from '../../../stockApis/polygon.io';

interface StockSelectorProps {
  stock: string;
  setStock: Function;
}

const update = (val: string, set: Function) => set(val);

export function StockSelector(props: StockSelectorProps) {
  const [options, setOptions] = useState<any>([]);
  const [search, setSearch] = useState<string>('');
  useEffect(() => {
    getTickers(1, search)
      .then((res: any) => {
        console.log(res);
        setOptions(res);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }, [search]);
  return (
    <div>
      <div>
        1) Search Company:
        <input
          value={search}
          onChange={(e) => {
            let val = e.target.value;
            update(val, setSearch);
          }}
        ></input>
      </div>
      <label htmlFor="stockSelector">
        {' '}
        2) Choose stock [this list gets updated]:
      </label>
      <select
        id="stockSelector"
        value={props.stock}
        onChange={(e: any) => {
          console.log(e);
          let stock = e.target.value;
          props.setStock(stock);
        }}
        onClick={(e: any) => {
          console.log(e);
          let stock = e.target.value;
          props.setStock(stock);
        }}
      >
        {/* <option>AAPL</option>
        <option>TSLA</option>
        <option>AMZN</option>
        <option>AMD</option> */}
        <option></option>
        {options.map((option: any) => {
          return <option>{option.ticker}</option>;
        })}
      </select>
    </div>
  );
}
