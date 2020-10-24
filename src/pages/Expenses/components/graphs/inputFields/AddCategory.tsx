import React, { useState } from 'react';
import {
  getCategories,
  setNewCategory,
} from '../../../../../rds_apis/apiCalls';

export function AddCategory(props: any) {
  const [newCat, setNewCat] = useState<string>();
  return (
    <div>
      Add Category
      <input
        value={newCat}
        onChange={(e) => {
          let val = e.target.value;
          if (val !== '') {
            setNewCat(val);
          }
        }}
      ></input>
      <button
        onClick={() => {
          if (newCat !== '' && newCat) {
            console.log(newCat);
            if (newCat) setNewCategory(newCat);
            setTimeout(async () => {
              let newCats = await getCategories();
              console.log(newCats);
              props.setCategories(newCats);
            }, 5000);
          }
        }}
      >
        Add
      </button>
    </div>
  );
}
