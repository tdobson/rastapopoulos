'use client';

// components/BOMCalculator/BOMCalculator.tsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Select, Text, Button, Group, Collapse, Box, Stack, NumberInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CellTypesCount, PanelPrices, ComponentPrices, BOM, BOMItem } from '../../types/bomCalculator';
import './BOMCalculator.css';
import BOMTable from '../BOMTable/BOMTable';
import PrintableChecklist from '../PrintableChecklist/PrintableChecklist';
import BOMRules from '../BOMRules/BOMRules';

const gridSize = 25;

type GridType = number[][];

const panelPrices: PanelPrices = {
  'DMEGC 405w': 112.00,
  'LONGi 405w': 121.50,
};

// Updated component prices
const componentPrices: ComponentPrices = {
  'GSE Half Portrait Frames': 19.52,
  'Lateral Flashing': 13.35,
  'GSE Screws Black': 0.26,
  'GSE Screws Silver': 0.30, // Example price, adjust as needed
  'GSE End Clamp': 1.11,
  'GSE Mid Clamp': 1.28,
  'Compressed Seal Roll': 9.15,
  'Pre Assembled DC Lead': 9.03,
  'DC Live Sticker': 0.24,
  'Cable Ties': 0.03,
  'Battens': 0.24,
  'Galvanised Nails': 0.01,
  'Copper Nails': 0.02,
  'Lead': 34.20, // per 1500mm length
  'Lead 600mm': 22.80, // Example price, adjust as needed
  'Tile Kicker Bars': 5.00, // Example price, adjust as needed
  'Kicker Bar Hooks': 1.50, // Example price, adjust as needed
  'Flexalu Top Flashing': 15.00, // Example price, adjust as needed
  'Arc Box': 20.00, // Example price, adjust as needed
  'Arc Box Bracket': 5.00, // Example price, adjust as needed
  'Roofer Guide Sheet': 1.00, // Example price, adjust as needed
  'Lateral Flashing Hooks': 0.50, // Example price, adjust as needed
  'Lateral Flashing Nails Galv 20mm': 0.02, // Example price, adjust as needed
  'Uberflex Carpet Flashing': 10.00, // Example price, adjust as needed
};

// Batten table
const battenTable: { [key: number]: { [key: number]: number } } = {
  1: { 1: 9, 2: 15, 3: 21, 4: 27 },
  2: { 1: 18, 2: 30, 3: 42, 4: 54 },
  3: { 1: 18, 2: 30, 3: 42, 4: 54 },
  4: { 1: 27, 2: 45, 3: 63, 4: 81 },
  5: { 1: 27, 2: 45, 3: 63, 4: 81 },
  6: { 1: 36, 2: 60, 3: 84, 4: 108 },
  7: { 1: 36, 2: 60, 3: 84, 4: 108 },
  8: { 1: 45, 2: 75, 3: 105, 4: 135 },
  9: { 1: 54, 2: 90, 3: 126, 4: 162 },
  10: { 1: 54, 2: 90, 3: 126, 4: 162 },
  11: { 1: 63, 2: 105, 3: 147, 4: 189 },
  12: { 1: 63, 2: 105, 3: 147, 4: 189 },
  13: { 1: 72, 2: 120, 3: 168, 4: 216 },
  14: { 1: 72, 2: 120, 3: 168, 4: 216 },
  15: { 1: 72, 2: 120, 3: 168, 4: 216 },
  16: { 1: 81, 2: 135, 3: 189, 4: 243 },
  17: { 1: 90, 2: 150, 3: 210, 4: 270 },
  18: { 1: 90, 2: 150, 3: 210, 4: 270 },
  19: { 1: 99, 2: 165, 3: 231, 4: 297 },
  20: { 1: 99, 2: 165, 3: 231, 4: 297 },
};

// Updated utility functions
function isCorner(grid: GridType, row: number, col: number): string | null {
  const isPanel = (r: number, c: number): boolean =>
      r >= 0 && r < gridSize && c >= 0 && c < gridSize && grid[r][c] === 1;

  const above = isPanel(row - 1, col);
  const below = isPanel(row + 1, col);
  const left = isPanel(row, col - 1);
  const right = isPanel(row, col + 1);
  const topLeft = isPanel(row - 1, col - 1);
  const topRight = isPanel(row - 1, col + 1);
  const bottomLeft = isPanel(row + 1, col - 1);
  const bottomRight = isPanel(row + 1, col + 1);

  if (!isPanel(row, col)) return null;

  if (above && right && !topRight) return 'BottomLeftCorner';
  if (above && left && !topLeft) return 'BottomRightCorner';
  if (below && right && !bottomRight) return 'TopLeftCorner';
  if (below && left && !bottomLeft) return 'TopRightCorner';

  return null;
}

function getTotalRows(grid: GridType): number {
  for (let row = grid.length - 1; row >= 0; row--) {
    if (grid[row].some(cell => cell === 1)) {
      return row + 1;
    }
  }
  return 0;
}

function isBottomRow(grid: GridType, row: number): boolean {
  const totalRows = getTotalRows(grid);
  return row === totalRows - 1;
}

function calculateLeadQuantity(panelCount: number): number {
  if (panelCount <= 0) return 0;
  if (panelCount === 1) return 2;
  if (panelCount === 2) return 3;
  if (panelCount === 3) return 3;
  if (panelCount === 4) return 4;
  if (panelCount === 5) return 5;
  if (panelCount === 6) return 6;
  return 6 + Math.ceil((panelCount - 6) * 1375 / 1500);
}

function getBottomRowPanelCount(grid: GridType): number {
  const totalRows = getTotalRows(grid);
  if (totalRows === 0) return 0;
  const bottomRow = grid[totalRows - 1];
  return bottomRow.filter(cell => cell === 1).length;
}

function getTotalPanelCount(cellTypesCount: CellTypesCount): number {
  return Object.values(cellTypesCount).reduce((sum, count) => sum + count, 0) - cellTypesCount.EmptyCell - cellTypesCount.Error;
}

function getGridDimensions(grid: GridType): { rows: number; columns: number } {
  let maxRow = 0;
  let maxCol = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 1) {
        maxRow = Math.max(maxRow, row);
        maxCol = Math.max(maxCol, col);
      }
    }
  }

  return { rows: maxRow + 1, columns: maxCol + 1 };
}

function calculateBattenQuantity(rows: number, columns: number): number {
  const safeRows = Math.min(rows, 20);
  const safeColumns = Math.min(columns, 4);

  if (safeRows <= 20 && safeColumns <= 4) {
    return battenTable[safeRows][safeColumns];
  }

  let baseQuantity = battenTable[20][4];

  if (rows > 20) {
    baseQuantity += (rows - 20) * 9;
  }

  if (columns > 4) {
    baseQuantity += (columns - 4) * 27;
  }

  return baseQuantity;
}

function getTopRowPanelCount(cellTypesCount: CellTypesCount): number {
  return cellTypesCount.TopSinglePanel + cellTypesCount.TopMidPanel + cellTypesCount.TopEndPanel;
}

// Updated calculateBOM function
function calculateBOM(cellTypesCount: CellTypesCount, grid: GridType, panelType: string, numberOfStrings: number): BOM {
  const { rows, columns } = getGridDimensions(grid);
  const battenQuantity = calculateBattenQuantity(rows, columns);
  const totalPanelCount = getTotalPanelCount(cellTypesCount);
  const bottomRowPanelCount = getBottomRowPanelCount(grid);
  const topRowPanelCount = getTopRowPanelCount(cellTypesCount);

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
      quantity: cellTypesCount.SinglePanel * 3 + cellTypesCount.TopSinglePanel * 3 + cellTypesCount.BottomSinglePanel * 3 + cellTypesCount.EndPanel * 3 + cellTypesCount.EndPanel + cellTypesCount.MidPanel,
      price: componentPrices['GSE Screws Black'],
      total: 0,
      explanation: `(${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel + ${cellTypesCount.EndPanel} EndPanel) * 3 + ${cellTypesCount.EndPanel} EndPanel + ${cellTypesCount.MidPanel} MidPanel`,
    },
    'GSE Screws Silver': {
      quantity: totalPanelCount * 3,
      price: componentPrices['GSE Screws Silver'],
      total: 0,
      explanation: `${totalPanelCount} total panels * 3`,
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
    'Compressed Seal Roll': {
      quantity: Math.ceil(totalPanelCount / 10),
      price: componentPrices['Compressed Seal Roll'],
      total: 0,
      explanation: `Ceiling of ${totalPanelCount} total panels / 10`,
    },
    'Pre Assembled DC Lead': {
      quantity: numberOfStrings * 2,
      price: componentPrices['Pre Assembled DC Lead'],
      total: 0,
      explanation: `${numberOfStrings} strings * 2`,
    },
    'DC Live Sticker': {
      quantity: numberOfStrings,
      price: componentPrices['DC Live Sticker'],
      total: 0,
      explanation: `1 sticker per string, ${numberOfStrings} strings`,
    },
    'Cable Ties': {
      quantity: Math.ceil(totalPanelCount / 10) * 5,
      price: componentPrices['Cable Ties'],
      total: 0,
      explanation: `Ceiling of ${totalPanelCount} total panels / 10 * 5`,
    },
    'Battens': {
      quantity: battenQuantity,
      price: componentPrices['Battens'],
      total: 0,
      explanation: `${battenQuantity} battens for ${rows} rows and ${columns} columns`,
    },
    'Copper Nails': {
      quantity: calculateLeadQuantity(totalPanelCount) * 3,
      price: componentPrices['Copper Nails'],
      total: 0,
      explanation: `3 nails per piece of lead for ${totalPanelCount} total panels`,
    },
    'Lead': {
      quantity: calculateLeadQuantity(totalPanelCount),
      price: componentPrices['Lead'],
      total: 0,
      explanation: `Lead quantity for ${totalPanelCount} total panels`,
    },
    'Tile Kicker Bars': {
      quantity: topRowPanelCount,
      price: componentPrices['Tile Kicker Bars'],
      total: 0,
      explanation: `${topRowPanelCount} top row panels`,
    },
    'Kicker Bar Hooks': {
      quantity: topRowPanelCount * 2,
      price: componentPrices['Kicker Bar Hooks'],
      total: 0,
      explanation: `${topRowPanelCount} top row panels * 2`,
    },
    'Flexalu Top Flashing': {
      quantity: Math.ceil(topRowPanelCount / 4),
      price: componentPrices['Flexalu Top Flashing'],
      total: 0,
      explanation: `Ceiling of ${topRowPanelCount} top row panels / 4`,
    },
    'Arc Box': {
      quantity: numberOfStrings,
      price: componentPrices['Arc Box'],
      total: 0,
      explanation: `1 Arc Box per string, ${numberOfStrings} strings`,
    },
    'Arc Box Bracket': {
      quantity: numberOfStrings,
      price: componentPrices['Arc Box Bracket'],
      total: 0,
      explanation: `1 Arc Box Bracket per string, ${numberOfStrings} strings`,
    },
    'Roofer Guide Sheet': {
      quantity: 1,
      price: componentPrices['Roofer Guide Sheet'],
      total: 0,
      explanation: `1 per plot`,
    },
    'Lateral Flashing Hooks': {
      quantity: cellTypesCount.EndPanel * 2 + cellTypesCount.SinglePanel * 4 + cellTypesCount.TopSinglePanel * 4 + cellTypesCount.BottomSinglePanel * 4,
      price: componentPrices['Lateral Flashing Hooks'],
      total: 0,
      explanation: `(${cellTypesCount.EndPanel} EndPanel * 2) + (${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel) * 4`,
    },
    'Lateral Flashing Nails Galv 20mm': {
      quantity: cellTypesCount.EndPanel * 2 + cellTypesCount.SinglePanel * 4 + cellTypesCount.TopSinglePanel * 4 + cellTypesCount.BottomSinglePanel * 4,
      price: componentPrices['Lateral Flashing Nails Galv 20mm'],
      total: 0,
      explanation: `(${cellTypesCount.EndPanel} EndPanel * 2) + (${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel) * 4`,
    },
    'Uberflex Carpet Flashing': {
      quantity: cellTypesCount.BottomLeftCorner + cellTypesCount.BottomRightCorner,
      price: componentPrices['Uberflex Carpet Flashing'],
      total: 0,
      explanation: `${cellTypesCount.BottomLeftCorner} BottomLeftCorner + ${cellTypesCount.BottomRightCorner} BottomRightCorner`,
    },
    'Solar Panels': {
      quantity: totalPanelCount,
      price: panelPrices[panelType],
      total: 0,
      explanation: `${totalPanelCount} total panels`,
    },
  };

  // Calculate totals and format explanations
  for (const [, item] of Object.entries(bom)) {
    item.total = item.quantity * item.price;
    item.explanation = `${item.quantity} x £${item.price.toFixed(2)} = £${item.total.toFixed(2)} (${item.explanation})`;
  }

  return bom;
}

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
    BottomLeftCorner: 0,
    BottomRightCorner: 0,
    TopLeftCorner: 0,
    TopRightCorner: 0,
    EmptyCell: 0,
    Error: 0,
  };

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cellType = determineCellType(grid, row, col);
      cellTypesCount[cellType as keyof CellTypesCount]++;
    }
  }

  return cellTypesCount;
}

function determineCellType(grid: GridType, row: number, col: number): string {
  if (grid[row][col] === 0) return 'EmptyCell';

  const cornerType = isCorner(grid, row, col);
  if (cornerType) return cornerType;

  const isPanel = (r: number, c: number): boolean =>
      r >= 0 && r < gridSize && c >= 0 && c < gridSize && grid[r][c] === 1;

  const above = isPanel(row - 1, col);
  const below = isPanel(row + 1, col);
  const left = isPanel(row, col - 1);
  const right = isPanel(row, col + 1);

  if (!above && !below && !left && !right) return 'SinglePanel';
  if (!above && below && !left && !right) return 'TopSinglePanel';
  if (above && !below && !left && !right) return 'BottomSinglePanel';
  if (above && below && !left && !right) return 'CenterSinglePanel';

  if (!above && !below && left && right) return 'MidPanel';
  if (above && below && left && right) return 'MiddleMidPanel';
  if (!above && below && left && right) return 'TopMidPanel';
  if (above && !below && left && right) return 'BottomMidPanel';

  if (!above && !below && ((left && !right) || (!left && right))) return 'EndPanel';
  if (above && below && ((left && !right) || (!left && right))) return 'MiddleEndPanel';
  if (!above && below && ((left && !right) || (!left && right))) return 'TopEndPanel';
  if (above && !below && ((left && !right) || (!left && right))) return 'BottomEndPanel';

  return 'Error';
}

// BOMCalculator component
function BOMCalculator() {
  const [grid, setGrid] = useState<GridType>(
      Array.from({ length: gridSize }, () => Array(gridSize).fill(0))
  );
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
    BottomLeftCorner: 0,
    BottomRightCorner: 0,
    TopLeftCorner: 0,
    TopRightCorner: 0,
    EmptyCell: gridSize * gridSize,
    Error: 0,
  });
  const [panelType, setPanelType] = useState<string>('DMEGC 405w');
  const [numberOfStrings, setNumberOfStrings] = useState<number | ''>(1);
  const isDraggingRef = useRef(false);

  const bom = calculateBOM(cellTypesCount, grid, panelType, typeof numberOfStrings === 'number' ? numberOfStrings : 1);
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

  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      ReactDOM.render(
        <PrintableChecklist bom={bom} />,
        printWindow.document.body,
        () => {
          printWindow.print();
        }
      );
    }
  }, [bom]);

  return (
      <Stack gap="md">
        <Select
            label="Panel Type"
            value={panelType}
            onChange={(value) => setPanelType(value || 'DMEGC 405w')}
            data={Object.keys(panelPrices)}
        />
        <NumberInput
          label="Number of Strings"
          value={numberOfStrings}
          onChange={(value) => setNumberOfStrings(value !== '' ? Number(value) : '')}
          min={1}
          max={10}
        />
        <Box>
          <Button onClick={toggle} mb="md">
            Toggle BOM Calculation Rules
          </Button>
          <Collapse in={opened}>
            <BOMRules />
          </Collapse>
        </Box>
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
        <Button onClick={clearGrid} mb="md">Reset Grid</Button>
        <Box>
          <Button onClick={toggle} mb="md">
            Toggle Cell Types Count
          </Button>
          <Collapse in={opened}>
            <Grid>
              {Object.entries(cellTypesCount).map(([type, count]) => (
                  <Grid.Col key={type} span={6}>
                    <Text>
                      {type}: {count}
                    </Text>
                  </Grid.Col>
              ))}
            </Grid>
          </Collapse>
        </Box>
        <Text size="xl">Bill of Materials:</Text>
        <BOMTable bom={bom} />
        <Button onClick={handlePrint}>Print Checklist</Button>
      </Stack>
  );
}

export default BOMCalculator;
