"use client";

// components/BOMCalculator/BOMCalculator.tsx
import React, { useState } from 'react';
import { Grid, Switch, Select, Text } from '@mantine/core';
import { CellTypesCount, PanelPrices, ComponentPrices, BOM } from '../../types/bomCalculator';

const gridSize = 25;

type GridType = number[][];

// Function to determine the type of a cell based on its neighbors
function determineCellType(grid: GridType, row: number, col: number): string {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], /*[0, 0],*/ [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    const isPanel = (r: number, c: number) => {
        return r >= 0 && r < gridSize && c >= 0 && c < gridSize && grid[r][c] === 1;
    };

    let neighborPanels = directions.map(([dx, dy]) => {
        let r = row + dx, c = col + dy;
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
        Error: 0
    };

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cellType = determineCellType(grid, row, col);
            cellTypesCount[cellType as keyof CellTypesCount]++;
        }
    }

    return cellTypesCount;
}

// Store the data tables from the pricing sheet as JSON objects
const panelPrices: PanelPrices = {
    "DMEGC 405w": 112,
    "LONGi 405w": 121.5,
};

const componentPrices: ComponentPrices = {
    "GSE Half Portrait Frames": 19.52,
    "Lateral Flashing": 13.35,
    "GSE Screws Black": 0.26,
    "GSE End Clamp": 1.11,
    "GSE Mid Clamp": 1.28,
    "EPDM Pads": 0.05,
    "Compressed Seal Roll": 9.15,
    "Pre Assembled DC Lead": 9.03,
    "DC Live Sticker": 0.24,
    "Cable Ties": 0.03,
    "Battens": 0.24,
    "Galvanised Nails": 0.01,
    "Copper Nails": 0.02,
    "Lead": 0.0228,
};

// Function to calculate the bill of materials based on the cell types count
function calculateBOM(cellTypesCount: CellTypesCount): BOM {
    const bom: BOM = {
        "GSE Half Portrait Frames": cellTypesCount.SinglePanel * 2 +
            cellTypesCount.TopSinglePanel * 2 +
            cellTypesCount.BottomSinglePanel * 2,
        "Lateral Flashing": (cellTypesCount.SinglePanel * 2 +
            cellTypesCount.TopSinglePanel * 2 +
            cellTypesCount.BottomSinglePanel * 2 +
            cellTypesCount.EndPanel) * 2,
        "GSE Screws Black": (cellTypesCount.SinglePanel * 3 +
                cellTypesCount.TopSinglePanel * 3 +
                cellTypesCount.BottomSinglePanel * 3 +
                cellTypesCount.EndPanel * 3) +
            cellTypesCount.EndPanel + cellTypesCount.MidPanel,
        "GSE End Clamp": cellTypesCount.SinglePanel * 4 +
            cellTypesCount.TopSinglePanel * 4 +
            cellTypesCount.BottomSinglePanel * 4 +
            cellTypesCount.EndPanel * 2,
        "GSE Mid Clamp": cellTypesCount.MidPanel * 2 +
            cellTypesCount.MiddleMidPanel * 2 +
            cellTypesCount.TopMidPanel * 2 +
            cellTypesCount.BottomMidPanel * 2,
        "EPDM Pads": cellTypesCount.EndPanel + cellTypesCount.MidPanel,
        "Compressed Seal Roll": Math.ceil((cellTypesCount.SinglePanel +
            cellTypesCount.TopSinglePanel +
            cellTypesCount.BottomSinglePanel +
            cellTypesCount.EndPanel +
            cellTypesCount.MidPanel +
            cellTypesCount.MiddleMidPanel +
            cellTypesCount.TopMidPanel +
            cellTypesCount.BottomMidPanel) / 10),
        "Pre Assembled DC Lead": Math.ceil((cellTypesCount.SinglePanel +
            cellTypesCount.TopSinglePanel +
            cellTypesCount.BottomSinglePanel +
            cellTypesCount.EndPanel +
            cellTypesCount.MidPanel +
            cellTypesCount.MiddleMidPanel +
            cellTypesCount.TopMidPanel +
            cellTypesCount.BottomMidPanel) / 10) * 2,
        "DC Live Sticker": Math.ceil((cellTypesCount.SinglePanel +
            cellTypesCount.TopSinglePanel +
            cellTypesCount.BottomSinglePanel +
            cellTypesCount.EndPanel +
            cellTypesCount.MidPanel +
            cellTypesCount.MiddleMidPanel +
            cellTypesCount.TopMidPanel +
            cellTypesCount.BottomMidPanel) / 10),
        "Cable Ties": Math.ceil((cellTypesCount.SinglePanel +
            cellTypesCount.TopSinglePanel +
            cellTypesCount.BottomSinglePanel +
            cellTypesCount.EndPanel +
            cellTypesCount.MidPanel +
            cellTypesCount.MiddleMidPanel +
            cellTypesCount.TopMidPanel +
            cellTypesCount.BottomMidPanel) / 10) * 5,
        "Lead": cellTypesCount.SinglePanel +
            cellTypesCount.BottomSinglePanel +
            cellTypesCount.CenterSinglePanel +
            cellTypesCount.CenterBottomPanel +
            cellTypesCount.BottomMidPanel +
            cellTypesCount.BottomEndPanel
    };

    return bom;
}

// Function to calculate the total cost of the bill of materials
function calculateTotalCost(bom: BOM, panelType: string): number {
    let totalCost = 0;

    for (const component in bom) {
        totalCost += bom[component] * componentPrices[component];
    }

    const panelCount = Object.values(bom).reduce((a, b) => a + b, 0);
    const panelCost = panelPrices[panelType] * panelCount;
    totalCost += panelCost;

    return totalCost;
}

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
    const [panelType, setPanelType] = useState<string>("DMEGC 405w");

    const bom = calculateBOM(cellTypesCount);
    const totalCost = calculateTotalCost(bom, panelType);

    const handleCellClick = (row: number, col: number) => {
        const newGrid = [...grid];
        newGrid[row][col] = newGrid[row][col] === 0 ? 1 : 0;
        setGrid(newGrid);
        setCellTypesCount(countCellTypes(newGrid));
    };

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: '2px' }}>
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            style={{
                                backgroundColor: cell === 1 ? 'blue' : 'white',
                                width: '20px',
                                height: '20px',
                                border: '1px solid black',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        />
                    ))
                )}
            </div>
            <Select
                label="Panel Type"
                value={panelType}
                onChange={(value) => setPanelType(value || "DMEGC 405w")}
                data={Object.keys(panelPrices)}
            />
            <Text>Cell Types Count:</Text>
            <pre>{JSON.stringify(cellTypesCount, null, 2)}</pre>
            <Text>Bill of Materials:</Text>
            <pre>{JSON.stringify(bom, null, 2)}</pre>
            <Text>Total Cost: {totalCost.toFixed(2)}</Text>
        </div>
    );
}

export default BOMCalculator;
