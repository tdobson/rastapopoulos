'use client';

// components/BOMCalculator/BOMCalculator.tsx
import React, { useState, useRef, useCallback } from 'react';
// eslint-disable-next-line import/order
import { Grid, Select, Text, Button, Group, Collapse, Box, Space, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CellTypesCount, PanelPrices, ComponentPrices, BOM } from '../../types/bomCalculator';
import './BOMCalculator.css';

const gridSize = 25;

type GridType = number[][];

// Function to determine the type of a cell based on its neighbors
function determineCellType(grid: GridType, row: number, col: number): string {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], /*[0, 0],*/ [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    const isPanel = (r: number, c: number): boolean =>
        r >= 0 && r < gridSize && c >= 0 && c < gridSize && grid[r][c] === 1;

    const neighborPanels = directions.map(([dx, dy]) => {
        const r = row + dx;
        const c = col + dy;
        return isPanel(r, c);
    });

    if (grid[row][col] !== 1) return 'EmptyCell';

    const top = neighborPanels.slice(0, 3);
    const mid = neighborPanels.slice(3, 5);
    const bot = neighborPanels.slice(5);

    if (top.every(Boolean) && mid.every(Boolean) && bot.every(Boolean)) return 'CenterMidPanel';
    if (top.every(Boolean) && mid.every(Boolean) && bot.some(Boolean)) return 'CenterTopPanel';
    if (top.some(Boolean) && mid.every(Boolean) && bot.every(Boolean)) return 'CenterBottomPanel';
    if (top.some(Boolean) && !mid.every(Boolean) && bot.some(Boolean)) return 'MidPanel';
    if (!top.some(Boolean) && !bot.some(Boolean) && mid.some(Boolean)) return 'MiddleMidPanel';
    if (!top.some(Boolean) && mid.some(Boolean) && bot.some(Boolean)) return 'BottomMidPanel';
    if (top.some(Boolean) && mid.some(Boolean) && !bot.some(Boolean)) return 'TopMidPanel';
    if ((top.some(Boolean) || bot.some(Boolean)) && !mid.every(Boolean)) return 'EndPanel';
    if (!top.some(Boolean) && !mid.every(Boolean) && !bot.some(Boolean)) return 'SinglePanel';
    if (top.filter(Boolean).length === 1 && !mid.every(Boolean) && !bot.some(Boolean)) return 'TopSinglePanel';
    if (!top.some(Boolean) && !mid.every(Boolean) && bot.filter(Boolean).length === 1) return 'BottomSinglePanel';
    if (!top.some(Boolean) && !bot.some(Boolean) && mid.filter(Boolean).length === 1) return 'CenterSinglePanel';

    return 'Error';
}

// Function to count all cell types in the grid
function countCellTypes(grid: GridType): CellTypesCount {
    const cellTypesCount: CellTypesCount = {
        SinglePanel: 0,
        MidPanel: 0,
        EndPanel: 0,
        MiddleMidPanel: 0,
        MiddleEndPanel: 0,
        TopMidPanel: 0,
        TopEndPanel: 0,
        TopSinglePanel: 0,
        BottomMidPanel: 0,
        BottomEndPanel: 0,
        BottomSinglePanel: 0,
        CenterSinglePanel: 0,
        CenterBottomPanel: 0,
        CenterMidPanel: 0,
        CenterTopPanel: 0,
        EmptyCell: 0,
        Error: 0,
    };

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col += 1) {
            const cellType = determineCellType(grid, row, col);
            cellTypesCount[cellType as keyof CellTypesCount] += 1;
        }
    }

    return cellTypesCount;
}

// Store the data tables from the pricing sheet as JSON objects
const panelPrices: PanelPrices = {
    'DMEGC 405w': 112,
    'LONGi 405w': 121.5,
};

const componentPrices: ComponentPrices = {
    'GSE Half Portrait Frames': 19.52,
    'Lateral Flashing': 13.35,
    'GSE Screws Black': 0.26,
    'GSE End Clamp': 1.11,
    'GSE Mid Clamp': 1.28,
    'EPDM Pads': 0.05,
    'Compressed Seal Roll': 9.15,
    'Pre Assembled DC Lead': 9.03,
    'DC Live Sticker': 0.24,
    'Cable Ties': 0.03,
    Battens: 0.24,
    'Galvanised Nails': 0.01,
    'Copper Nails': 0.02,
    Lead: 0.0228,
};

function calculateBOM(cellTypesCount: CellTypesCount, panelType: string): BOM {
    const bom: BOM = {
        'GSE Half Portrait Frames': {
            quantity: cellTypesCount.SinglePanel * 2 + cellTypesCount.TopSinglePanel * 2 + cellTypesCount.BottomSinglePanel * 2,
            price: componentPrices['GSE Half Portrait Frames'],
            total: 0,
            explanation: `(${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel) * 2`,
        },
        'Lateral Flashing': {
            quantity: (cellTypesCount.SinglePanel * 2 + cellTypesCount.TopSinglePanel * 2 + cellTypesCount.BottomSinglePanel * 2 + cellTypesCount.EndPanel) * 2,
            price: componentPrices['Lateral Flashing'],
            total: 0,
            explanation: `(${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel + ${cellTypesCount.EndPanel} EndPanel) * 2 * 2`,
        },
        'GSE Screws Black': {
            quantity: (cellTypesCount.SinglePanel * 3 + cellTypesCount.TopSinglePanel * 3 + cellTypesCount.BottomSinglePanel * 3 + cellTypesCount.EndPanel * 3) + cellTypesCount.EndPanel + cellTypesCount.MidPanel,
            price: componentPrices['GSE Screws Black'],
            total: 0,
            explanation: `(${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel + ${cellTypesCount.EndPanel} EndPanel) * 3 + ${cellTypesCount.EndPanel} EndPanel + ${cellTypesCount.MidPanel} MidPanel`,
        },
        'GSE End Clamp': {
            quantity: cellTypesCount.SinglePanel * 4 + cellTypesCount.TopSinglePanel * 4 + cellTypesCount.BottomSinglePanel * 4 + cellTypesCount.EndPanel * 2,
            price: componentPrices['GSE End Clamp'],
            total: 0,
            explanation: `(${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel) * 4 + ${cellTypesCount.EndPanel} EndPanel * 2`,
        },
        'GSE Mid Clamp': {
            quantity: cellTypesCount.MidPanel * 2 + cellTypesCount.MiddleMidPanel * 2 + cellTypesCount.TopMidPanel * 2 + cellTypesCount.BottomMidPanel * 2,
            price: componentPrices['GSE Mid Clamp'],
            total: 0,
            explanation: `(${cellTypesCount.MidPanel} MidPanel + ${cellTypesCount.MiddleMidPanel} MiddleMidPanel + ${cellTypesCount.TopMidPanel} TopMidPanel + ${cellTypesCount.BottomMidPanel} BottomMidPanel) * 2`,
        },
        'EPDM Pads': {
            quantity: cellTypesCount.EndPanel + cellTypesCount.MidPanel,
            price: componentPrices['EPDM Pads'],
            total: 0,
            explanation: `${cellTypesCount.EndPanel} EndPanel + ${cellTypesCount.MidPanel} MidPanel`,
        },
        'Compressed Seal Roll': {
            quantity: Math.ceil((cellTypesCount.SinglePanel + cellTypesCount.TopSinglePanel + cellTypesCount.BottomSinglePanel + cellTypesCount.EndPanel + cellTypesCount.MidPanel + cellTypesCount.MiddleMidPanel + cellTypesCount.TopMidPanel + cellTypesCount.BottomMidPanel) / 10),
            price: componentPrices['Compressed Seal Roll'],
            total: 0,
            explanation: `Ceiling of (${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel + ${cellTypesCount.EndPanel} EndPanel + ${cellTypesCount.MidPanel} MidPanel + ${cellTypesCount.MiddleMidPanel} MiddleMidPanel + ${cellTypesCount.TopMidPanel} TopMidPanel + ${cellTypesCount.BottomMidPanel} BottomMidPanel) / 10`,
        },
        'Pre Assembled DC Lead': {
            quantity: Math.ceil((cellTypesCount.SinglePanel + cellTypesCount.TopSinglePanel + cellTypesCount.BottomSinglePanel + cellTypesCount.EndPanel + cellTypesCount.MidPanel + cellTypesCount.MiddleMidPanel + cellTypesCount.TopMidPanel + cellTypesCount.BottomMidPanel) / 10) * 2,
            price: componentPrices['Pre Assembled DC Lead'],
            total: 0,
            explanation: `Ceiling of (${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel + ${cellTypesCount.EndPanel} EndPanel + ${cellTypesCount.MidPanel} MidPanel + ${cellTypesCount.MiddleMidPanel} MiddleMidPanel + ${cellTypesCount.TopMidPanel} TopMidPanel + ${cellTypesCount.BottomMidPanel} BottomMidPanel) / 10 *2`,
        },
        'DC Live Sticker': {
            quantity: Math.ceil((cellTypesCount.SinglePanel + cellTypesCount.TopSinglePanel + cellTypesCount.BottomSinglePanel + cellTypesCount.EndPanel + cellTypesCount.MidPanel + cellTypesCount.MiddleMidPanel + cellTypesCount.TopMidPanel + cellTypesCount.BottomMidPanel) / 10),
            price: componentPrices['DC Live Sticker'],
            total: 0,
            explanation: `Ceiling of (${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel + ${cellTypesCount.EndPanel} EndPanel + ${cellTypesCount.MidPanel} MidPanel + ${cellTypesCount.MiddleMidPanel} MiddleMidPanel + ${cellTypesCount.TopMidPanel} TopMidPanel + ${cellTypesCount.BottomMidPanel} BottomMidPanel) / 10`,
        },
        'Cable Ties': {
            quantity: Math.ceil((cellTypesCount.SinglePanel + cellTypesCount.TopSinglePanel + cellTypesCount.BottomSinglePanel + cellTypesCount.EndPanel + cellTypesCount.MidPanel + cellTypesCount.MiddleMidPanel + cellTypesCount.TopMidPanel + cellTypesCount.BottomMidPanel) / 10) * 5,
            price: componentPrices['Cable Ties'],
            total: 0,
            explanation: `Ceiling of (${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel + ${cellTypesCount.EndPanel} EndPanel + ${cellTypesCount.MidPanel} MidPanel + ${cellTypesCount.MiddleMidPanel} MiddleMidPanel + ${cellTypesCount.TopMidPanel} TopMidPanel + ${cellTypesCount.BottomMidPanel} BottomMidPanel) / 10 * 5`,
        },
        Lead: {
            quantity: cellTypesCount.SinglePanel + cellTypesCount.BottomSinglePanel + cellTypesCount.CenterSinglePanel + cellTypesCount.CenterBottomPanel + cellTypesCount.BottomMidPanel + cellTypesCount.BottomEndPanel,
            price: componentPrices.Lead,
            total: 0,
            explanation: `${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel + ${cellTypesCount.CenterSinglePanel} CenterSinglePanel + ${cellTypesCount.CenterBottomPanel} CenterBottomPanel + ${cellTypesCount.BottomMidPanel} BottomMidPanel + ${cellTypesCount.BottomEndPanel} BottomEndPanel`,
        },
    };

    // Calculate totals and format explanations
    for (const [, item] of Object.entries(bom)) {
        item.total = item.quantity * item.price;
        item.explanation = `${item.quantity} x £${item.price.toFixed(2)} = £${item.total.toFixed(2)} (${item.explanation})`;
    }

    // Add panel cost
    const panelCount = Object.values(cellTypesCount).reduce((sum, count) => sum + count, 0) - cellTypesCount.EmptyCell - cellTypesCount.Error;
    bom['Solar Panels'] = {
        quantity: panelCount,
        price: panelPrices[panelType],
        total: panelCount * panelPrices[panelType],
        explanation: `${panelCount} x £${panelPrices[panelType].toFixed(2)} = £${(panelCount * panelPrices[panelType]).toFixed(2)}`,
    };

    return bom;
}

// Function to calculate the total cost of the bill of materials
// Removed unused function calculateTotalCost

function BOMCalculator() {
    const [grid, setGrid] = useState<GridType>(Array.from({ length: gridSize }, () => Array(gridSize).fill(0)));
    const [cellTypesCount, setCellTypesCount] = useState<CellTypesCount>({
        SinglePanel: 0,
        MidPanel: 0,
        EndPanel: 0,
        MiddleMidPanel: 0,
        MiddleEndPanel: 0,
        TopMidPanel: 0,
        TopEndPanel: 0,
        TopSinglePanel: 0,
        BottomMidPanel: 0,
        BottomEndPanel: 0,
        BottomSinglePanel: 0,
        CenterSinglePanel: 0,
        CenterBottomPanel: 0,
        CenterMidPanel: 0,
        CenterTopPanel: 0,
        EmptyCell: gridSize * gridSize,
        Error: 0
    });
    const [panelType, setPanelType] = useState<string>('DMEGC 405w');
    const isDraggingRef = useRef(false);

    const bom = calculateBOM(cellTypesCount, panelType);
    const totalCost = Object.values(bom).reduce((sum, item) => sum + item.total, 0);

    const handleCellClick = (row: number, col: number) => {
        const newGrid = [...grid];
        newGrid[row][col] = newGrid[row][col] === 0 ? 1 : 0;
        setGrid(newGrid);
        setCellTypesCount(countCellTypes(newGrid));
    };

    const handleMouseDown = (row: number, col: number) => {
        isDraggingRef.current = true;
        handleCellClick(row, col);
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (isDraggingRef.current) {
            handleCellClick(row, col);
        }
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
    };

    const clearGrid = useCallback(() => {
        const emptyGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
        setGrid(emptyGrid);
        setCellTypesCount(countCellTypes(emptyGrid));
    }, []);

    const [opened, { toggle }] = useDisclosure(false);
    return (
        <div>
            <Flex mb="md" gap="md">

                <Select
                    label="Panel Type"
                    value={panelType}
                    onChange={(value) => setPanelType(value || 'DMEGC 405w')}
                    data={Object.keys(panelPrices)}
                />
            </Flex>
            <div
                className="grid-container"
                onMouseLeave={handleMouseUp}
                onMouseUp={handleMouseUp}
                role="grid"
            >
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`grid-cell ${cell === 1 ? 'active' : ''}`}
                            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleMouseDown(rowIndex, colIndex);
                                }
                            }}
                        />
                    ))
                )}
            </div>
            <Text size="xl">Total Cost: £{totalCost.toFixed(2)}</Text>
            <Space h="md" />
            <Button onClick={clearGrid}>Reset Grid</Button>
            <Space h="md" />
            <Text size="xl">Bill of Materials:</Text>
            {Object.entries(bom).map(([component, item]) => (
                <div key={component}>
                    <Text size="md">{component}:</Text>
                    <Text ml="md" size="sm">{item.explanation}</Text>
                </div>
            ))}
            <Space h="md" />
            <Box mx="auto">
                <Group justify="left" mb={5}>
                    <Button onClick={toggle}>Cell Types Count</Button>
                </Group>

                <Collapse in={opened}>
                    <Grid>
                        {Object.entries(cellTypesCount).map(([type, count]) => (
                            <Grid.Col key={type} span={6}>
                                <Text>{type}: {count}</Text>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Collapse>
            </Box>
        </div>
    );
}

export default BOMCalculator;
