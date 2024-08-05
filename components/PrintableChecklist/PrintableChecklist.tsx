import React, { useState } from 'react';
import { Modal, Button, Table, Checkbox, Text, Group } from '@mantine/core';
import { BOM } from '../../types/bomCalculator';

// Helper function to determine if an item should be included in the checklist
const shouldIncludeInChecklist = (component: string) => {
  const excludedItems = []; // All items are now included in the checklist
  return !excludedItems.includes(component);
};

interface PrintableChecklistProps {
    bom: BOM;
    opened: boolean;
    onClose: () => void;
    projectNumber: string;
    plotNumber: string;
}

function PrintableChecklist({ bom, opened, onClose, projectNumber, plotNumber }: PrintableChecklistProps) {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    // Define the order of components
    const componentOrder = [
        'Solar Panels',
        'GSE Half Portrait Frames',
        'GSE End Clamp',
        'GSE Mid Clamp',
        'GSE Screws Black',
        'GSE Screws Silver',
        'Lateral Flashing',
        'Lateral Flashing Hooks',
        'Lateral Flashing Nails Galv 20mm',
        'Flexalu Top Flashing',
        'Uberflex Carpet Flashing',
        'Tile Kicker Bars',
        'Kicker Bar Hooks',
        'Compressed Seal Roll',
        'Panel Wedge',
        'Battens',
        'Wire Clout Nails 65mm',
        'Lead',
        'Lead 600mm',
        'Copper Nails',
        'Pre Assembled DC Lead',
        'DC Live Sticker',
        'Arc Box',
        'Arc Box Bracket',
        'Cable Ties',
        'Roofer Guide Sheet'
    ];

    // Filter and sort BOM entries
    const filteredBom = componentOrder
        .filter(component => bom[component] && bom[component].quantity > 0 && shouldIncludeInChecklist(component))
        .map(component => ({ component, item: bom[component] }));

    const rows = filteredBom.map(({ component, item }) => (
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

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Pallet Checklist</title>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid black; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                        </style>
                    </head>
                    <body>
                        <h1>Pallet Checklist</h1>
                        ${projectNumber ? `<p><strong>Project Number:</strong> ${projectNumber}</p>` : ''}
                        ${plotNumber ? `<p><strong>Plot Number:</strong> ${plotNumber}</p>` : ''}
                        <table>
                            <thead>
                                <tr>
                                    <th>Component</th>
                                    <th>Quantity</th>
                                    <th>Check</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filteredBom.map(({ component, item }) => `
                                    <tr>
                                        <td>${component}</td>
                                        <td>${item.quantity}</td>
                                        <td>☐</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Pallet Checklist"
            size="lg"
            padding="lg"
        >
            {(projectNumber || plotNumber) && (
                <Group mb="md">
                    {projectNumber && <Text size="lg" fw={700}>Project Number: {projectNumber}</Text>}
                    {plotNumber && <Text size="lg" fw={700}>Plot Number: {plotNumber}</Text>}
                </Group>
            )}
            <Button onClick={handlePrint} mt="md">Print</Button>
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
        </Modal>
    );
}

export default PrintableChecklist;
