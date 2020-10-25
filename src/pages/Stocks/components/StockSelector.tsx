import React from 'react';

interface StockSelectorProps {
  stock: string;
  setStock: Function;
}

export function StockSelector(props: StockSelectorProps) {
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
        <option>AMD</option>
      </select>
    </div>
  );
}
