import React from 'react';
import { Table } from '@mantine/core';
import { BOM } from '../../types/bomCalculator';

interface BOMTableProps {
  bom: BOM;
}

const leadMeterageTable = {
  1: 2100,
  2: 3400,
  3: 4475,
  4: 6000,
  5: 7275,
  6: 8900,
  default: 1375
};

function BOMTable({ bom }: BOMTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Component</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
          <th>Explanation</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(bom).map(([component, item]) => (
          <tr key={component}>
            <td>{component}</td>
            <td>{item.quantity}</td>
            <td>£{item.price.toFixed(2)}</td>
            <td>£{item.total.toFixed(2)}</td>
            <td>{item.explanation}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default BOMTable;
