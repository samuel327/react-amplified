import React, { useEffect, useState } from 'react';
import { getTickers } from '../../../stockApis/polygon.io';

interface StockSelectorProps {
  stock: string;
  setStock: Function;
}

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
        Search Company:
        <input
          value={search}
          onChange={(e) => {
            let val = e.target.value;
            if (val !== '') {
              setSearch(val);
            }
          }}
        ></input>
        <button
          onClick={() => {
            if (search !== '' && search) {
              console.log(search);
              if (search) setSearch(search);
            }
          }}
        >
          Add
        </button>
      </div>
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
        {/* <option>AAPL</option>
        <option>TSLA</option>
        <option>AMZN</option>
        <option>AMD</option> */}
        {options.map((option: any) => {
          return <option>{option.ticker}</option>;
        })}
      </select>
    </div>
  );
}
