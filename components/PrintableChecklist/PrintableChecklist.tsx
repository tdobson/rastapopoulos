import React, { useState } from 'react';
import { Modal, Button, Table, Checkbox } from '@mantine/core';
import { BOM } from '../../types/bomCalculator';

interface PrintableChecklistProps {
    bom: BOM;
    opened: boolean;
    onClose: () => void;
}

function PrintableChecklist({ bom, opened, onClose }: PrintableChecklistProps) {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    // Filter BOM entries to include only those with a quantity greater than zero
    const filteredBom = Object.entries(bom).filter(([, item]) => item.quantity > 0);

    const rows = filteredBom.map(([component, item]) => (
        <Table.Tr key={component}>
            <Table.Td>{component}</Table.Td>
            <Table.Td style={{ fontSize: '1.2em' }}>{item.quantity}</Table.Td>
            <Table.Td>
                <Checkbox
                    aria-label={`Select ${component}`}
                    checked={selectedRows.includes(component)}
                    onChange={(event) =>
                        setSelectedRows(
                            event.currentTarget.checked
                                ? [...selectedRows, component]
                                : selectedRows.filter((selectedComponent) => selectedComponent !== component)
                        )
                    }
                />
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Pallet Checklist"
            size="lg"
            padding="lg"
        >
            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Component</Table.Th>
                        <Table.Th>Quantity</Table.Th>
                        <Table.Th>Check</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            <Button onClick={() => window.print()} mt="md">Print</Button>
        </Modal>
    );
}

export default PrintableChecklist;
