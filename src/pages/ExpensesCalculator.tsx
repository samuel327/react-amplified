import React from 'react';
import { Button, TextField } from '@material-ui/core';

export function ExpensesCalculator() {
  return (
    <div>
      <TextField placeholder={'Expense Name'} />
      <TextField placeholder={'Dollar Amount'} />

      <Button>ADD</Button>
    </div>
  );
}
