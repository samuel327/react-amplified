import React, { useState } from 'react';
import { setNewCategory } from '../../../../../rds_apis/apiCalls';
import { Category } from '../../../interfaces';

export function RemoveCategory({ categories }: { categories: Category[] }) {
  return (
    <div>
      Remove Category
      <form>
        <label htmlFor="categories">Choose a category:</label>
        <select id="category" name="category">
          {categories.map((category: Category) => {
            return <option value={category.type}>{category.type}</option>;
          })}
        </select>
        <input type="submit" />
      </form>
    </div>
  );
}
