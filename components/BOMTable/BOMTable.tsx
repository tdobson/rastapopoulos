import React from 'react';
import { Table } from '@mantine/core';
import { BOM } from '../../types/bomCalculator';
import { HIDE_PRICING_INFO } from '../BOMCalculator/BOMCalculator';

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
          {HIDE_PRICING_INFO ? null : (
            <>
              <th>Price</th>
              <th>Total</th>
              <th>Explanation</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {Object.entries(bom).map(([component, item]) => (
          <tr key={component}>
            <td>{item.quantity}</td>
            <td>{component}</td>
            {HIDE_PRICING_INFO ? null : (
              <>
                <td>£{item.price.toFixed(2)}</td>
                <td>£{item.total.toFixed(2)}</td>
                <td>{item.explanation}</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default BOMTable;
