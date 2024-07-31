import React, { useState } from 'react';
import { BOM } from '../../types/bomCalculator';
import './PrintableChecklist.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface PrintableChecklistProps {
  bom: BOM;
  onClose: () => void;
}

function PrintableChecklist({ bom, onClose }: PrintableChecklistProps) {
  return (
    <div className="print-modal">
      <div className="print-modal-content">
        <button className="close-icon" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="printable-checklist">
          <h1>Pallet Checklist</h1>
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
                  <td className="check-column"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PrintableChecklist;
