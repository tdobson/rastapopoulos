import React from 'react';
import { Table } from '@mantine/core';
import { BOM } from '../../types/bomCalculator';

interface BOMTableProps {
  bom: BOM;
}



function BOMTable({ bom }: BOMTableProps) {
  return (
    <Table>
      <thead>
      <tr>
          <th>Quantity</th>
          <th>Component</th>
          <th>Price</th>
          <th>Total</th>
          <th>Explanation</th>
      </tr>
      </thead>
        <tbody>
        {Object.entries(bom).map(([component, item]) => (
            <tr key={component}>
                <td>{item.quantity}</td>
                <td>{component}</td>
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
