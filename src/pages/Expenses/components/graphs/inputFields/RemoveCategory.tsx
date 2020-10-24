import React, { useState } from 'react';
import {
  getCategories,
  removeCategory,
  setNewCategory,
} from '../../../../../rds_apis/apiCalls';
import { Category } from '../../../interfaces';

export function RemoveCategory(props: any) {
  const [categoryToRemove, setCategoryToRemove] = useState<string>();

  return (
    <div>
      Remove Category
      <label htmlFor="categories">Choose a category:</label>
      <select
        id="category"
        name="category"
        value={categoryToRemove}
        onChange={(e: any) => {
          setCategoryToRemove(e.target.value);
        }}
      >
        {props.categories.map((category: Category) => {
          return <option>{category.type}</option>;
        })}
      </select>
      <button
        onClick={async () => {
          console.log(categoryToRemove);
          if (categoryToRemove) await removeCategory(categoryToRemove);
          setTimeout(async () => {
            let newCats = await getCategories();
            console.log(newCats);
            props.setCategories(newCats);
          }, 5000);
        }}
      >
        remove
      </button>
    </div>
  );
}
