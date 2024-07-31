import React from 'react';
import { Modal, Button, Table } from '@mantine/core';
import { BOM } from '../../types/bomCalculator';

interface PrintableChecklistProps {
  bom: BOM;
  opened: boolean;
  onClose: () => void;
}

function PrintableChecklist({ bom, opened, onClose }: PrintableChecklistProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Pallet Checklist"
      size="lg"
      padding="lg"
    >
      <Table>
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
      </Table>
      <Button onClick={() => window.print()} mt="md">Print</Button>
    </Modal>
  );
}

export default PrintableChecklist;
