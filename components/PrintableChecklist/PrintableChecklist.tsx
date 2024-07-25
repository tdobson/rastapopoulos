import React from 'react';
import { Box, Text, List } from '@mantine/core';
import { BOM } from '../../types/bomCalculator';

interface PrintableChecklistProps {
  bom: BOM;
}

function PrintableChecklist({ bom }: PrintableChecklistProps) {
  return (
    <Box className="printable-checklist">
      <Text size="xl">Pallet Checklist</Text>
      <List>
        {Object.entries(bom).map(([component, item]) => (
          <List.Item key={component}>
            {component}: {item.quantity} {item.quantity > 1 ? 'pcs' : 'pc'}
          </List.Item>
        ))}
      </List>
    </Box>
  );
}

export default PrintableChecklist;
