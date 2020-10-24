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
          setNewCat(e.target.value);
        }}
      ></input>
      <button
        onClick={() => {
          if (newCat) setNewCategory(newCat);
          setTimeout(async () => {
            let newCats = await getCategories();
            console.log(newCats);
            props.setCategories(newCats);
          }, 5000);
        }}
      >
        submit
      </button>
    </div>
  );
}
