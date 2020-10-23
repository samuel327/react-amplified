import React, { useState } from 'react';

export function AddCategory() {
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
      <button onClick={(e) => console.log(newCat)}>submit</button>
    </div>
  );
}
