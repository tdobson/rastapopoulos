import React from 'react';
import { BOM } from '../../types/bomCalculator';

interface PrintableChecklistProps {
  bom: BOM;
}

function PrintableChecklist({ bom }: PrintableChecklistProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Component</th>
          <th>Quantity</th>
          <th>Check</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(bom).map(([component, item]) => (
          <tr key={component}>
            <td>{component}</td>
            <td>{item.quantity} {item.quantity > 1 ? 'pcs' : 'pc'}</td>
            <td style={{ width: '50px' }}></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PrintableChecklist;
