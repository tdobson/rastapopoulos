import React from 'react';
import { Table } from '@mantine/core';
import { BOM } from '../../types/bomCalculator';
import { HIDE_PRICING_INFO } from '../BOMCalculator/BOMCalculator';

const HIDE_ALL_PRICING_INFO = true;

interface BOMTableProps {
  bom: BOM;
}

function BOMTable({ bom }: BOMTableProps) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Quantity</Table.Th>
          <Table.Th>Component</Table.Th>
          {HIDE_ALL_PRICING_INFO ? null : (
            <>
              <Table.Th>Price</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Explanation</Table.Th>
            </>
          )}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {Object.entries(bom).map(([component, item]) => (
          <Table.Tr key={component}>
            <Table.Td>{item.quantity}</Table.Td>
            <Table.Td>{component}</Table.Td>
            {HIDE_ALL_PRICING_INFO ? null : (
              <>
                <Table.Td>£{item.price.toFixed(2)}</Table.Td>
                <Table.Td>£{item.total.toFixed(2)}</Table.Td>
                <Table.Td>{item.explanation}</Table.Td>
              </>
            )}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

export default BOMTable;
