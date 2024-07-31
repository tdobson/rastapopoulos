import React from 'react';
import { BOM } from '../../types/bomCalculator';

interface PrintableChecklistProps {
  bom: BOM;
}

function PrintableChecklist({ bom }: PrintableChecklistProps) {
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Pallet Checklist</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Component</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Quantity</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Check</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(bom).map(([component, item]) => (
            <tr key={component}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{component}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.quantity} {item.quantity > 1 ? 'pcs' : 'pc'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', width: '50px' }}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PrintableChecklist;
