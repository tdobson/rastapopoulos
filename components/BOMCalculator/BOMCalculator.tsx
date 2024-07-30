'use client';

// components/BOMCalculator/BOMCalculator.tsx

import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

// Component prices
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
  'Lead 600mm': 42.80, // Example price, adjust as needed
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

//number of panels vs millimetereage of lead required. eg 1 panel requires 2100mm of lead, 6 panels require 8900mm of lead, 7 panels require 8900+1375mm of lead etc
const leadMeterageTable = {
  1: 2100,
  2: 3400,
  3: 4475,
  4: 6000,
  5: 7275,
  6: 8900,
  default: 1375
};

/**
 * Determines the types of corners present in a cell of a grid representing solar panels.
 *
 * @param {GridType} grid - A 2D array representing the layout of solar panels. Each cell contains either 0 (no panel) or 1 (panel).
 * @param {number} row - The row index of the cell to check for corners.
 * @param {number} col - The column index of the cell to check for corners.
 *
 * @returns {Object} An object indicating the types of corners found in the cell. The keys are corner types, and the corresponding values are booleans.
 *                   - 'TopLeftCorner': true if the cell is a top-left corner.
 *                   - 'TopRightCorner': true if the cell is a top-right corner.
 *                   - 'BottomLeftCorner': true if the cell is a bottom-left corner.
 *                   - 'BottomRightCorner': true if the cell is a bottom-right corner.
 *                   If no corners are found, an empty object is returned.
 *
 * @example
 * // Input grid:
 * [
 *   [1, 1, 1],
 *   [1, 0, 1],
 *   [1, 1, 1]
 * ]
 *
 * isCorner(grid, 0, 0); // Returns { TopLeftCorner: true }
 * isCorner(grid, 0, 2); // Returns { TopRightCorner: true }
 * isCorner(grid, 1, 1); // Returns {}
 * isCorner(grid, 2, 0); // Returns { BottomLeftCorner: true }
 * isCorner(grid, 2, 2); // Returns { BottomRightCorner: true }
 *
 * @description
 * The `isCorner` function takes a 2D grid representing the layout of solar panels and the coordinates of a specific cell.
 * It determines the types of corners present in that cell based on the presence or absence of panels in the adjacent cells.
 *
 * The function considers the following corner types:
 * - Top-left corner: The cell is a top-left corner if there is a panel below and to the right, but no panel in the bottom-right diagonal.
 * - Top-right corner: The cell is a top-right corner if there is a panel below and to the left, but no panel in the bottom-left diagonal.
 * - Bottom-left corner: The cell is a bottom-left corner if there is a panel above and to the right, but no panel in the top-right diagonal.
 * - Bottom-right corner: The cell is a bottom-right corner if there is a panel above and to the left, but no panel in the top-left diagonal.
 *
 * The function also handles special cases where a cell can be considered multiple types of corners simultaneously.
 * For example, in the following grid:
 * [
 *   [1, 1, 1],
 *   [1, 1, 0],
 *   [1, 1, 1]
 * ]
 * The cell at position (1, 1) is considered both a top-right corner and a bottom-right corner.
 *
 * The function returns an object where the keys are the corner types and the corresponding values are booleans indicating the presence of that corner type.
 * If no corners are found, an empty object is returned.
 *
 * @logic
 * 1. Check if the current cell is a panel. If not, return an empty object.
 * 2. Check the presence of panels in the adjacent cells (above, below, left, right) and diagonal cells (top-left, top-right, bottom-left, bottom-right).
 * 3. For each corner type:
 *    - Check the specific conditions for that corner type based on the presence/absence of panels in the relevant adjacent and diagonal cells.
 *    - If the conditions are met, set the corresponding corner type to true in the result object.
 * 4. Return the result object containing the corner types found in the cell.
 */
function isCorner(grid: GridType, row: number, col: number): { [key: string]: boolean } {
  const isPanel = (r: number, c: number): boolean =>
      r >= 0 && r < gridSize && c >= 0 && c < gridSize && grid[r][c] === 1;

  // Check if the current cell is a panel
  if (!isPanel(row, col)) return {};

  const above = isPanel(row - 1, col); // Panel above
  const below = isPanel(row + 1, col); // Panel below
  const left = isPanel(row, col - 1); // Panel to the left
  const right = isPanel(row, col + 1); // Panel to the right
  const topLeft = isPanel(row - 1, col - 1); // Panel in the top-left corner
  const topRight = isPanel(row - 1, col + 1); // Panel in the top-right corner
  const bottomLeft = isPanel(row + 1, col - 1); // Panel in the bottom-left corner
  const bottomRight = isPanel(row + 1, col + 1); // Panel in the bottom-right corner

  const corners: { [key: string]: boolean } = {};

  // Check for BottomLeftCorner
  if ((above && right && !topRight) || (above && below && left && !bottomLeft)) {
    corners['BottomLeftCorner'] = true;
  }

  // Check for BottomRightCorner
  if ((above && left && !topLeft) || (above && below && right && !bottomRight)) {
    corners['BottomRightCorner'] = true;
  }

  // Check for TopLeftCorner
  if ((below && right && !bottomRight) || (above && below && left && !topLeft)) {
    corners['TopLeftCorner'] = true;
  }

  // Check for TopRightCorner
  if ((below && left && !bottomLeft) || (above && below && right && !topRight)) {
    corners['TopRightCorner'] = true;
  }

  return corners;
}

/**
 * Returns the total number of rows in the grid that contain at least one panel.
 *
 * @param grid - The grid representing the layout of panels.
 * @returns The number of rows containing panels.
 */
function getTotalRows(grid: GridType): number {
  for (let row = grid.length - 1; row >= 0; row--) {
    if (grid[row].some(cell => cell === 1)) {
      return row + 1;
    }
  }
  return 0;
}

/**
 * Determines if a given row is the bottom row of the grid that contains panels.
 *
 * @param grid - The grid representing the layout of panels.
 * @param row - The row index to check.
 * @returns True if the row is the bottom row containing panels, otherwise false.
 */
function isBottomRow(grid: GridType, row: number): boolean {
  const totalRows = getTotalRows(grid);
  return row === totalRows - 1;
}

/**
 * Calculates the quantity of lead required for both standard and deep types based on the number of panels in the bottom row and the maximum width of non-bottom rows.
 *
 * Lead comes in two types that have separate uses and come in separate quantities:
 *
 * 1. **Normal Lead**:
 *    - Calculated based on the number of panels across the bottom row of the array.
 *    - It comes in 1500mm lengths.
 *    - The required length is determined using the `leadMeterageTable` constant.
 *    - The total length required for the bottom row panels is calculated by summing the values from the `leadMeterageTable` for each panel count up to the `bottomRowPanelCount`.
 *    - The total length is then divided by 1500mm and rounded up to determine the number of pieces of normal lead required.
 *
 * 2. **Deep Lead (800mm width)**:
 *    - Calculated based on the total width of the array, minus the bottom row.
 *    - It also comes in 1500mm lengths.
 *    - The required length is determined using the `leadMeterageTable` constant.
 *    - The total length required for the non-bottom row panels is calculated by summing the values from the `leadMeterageTable` for each panel count up to the `maxNonBottomRowWidth`.
 *    - The total length is then divided by 1500mm and rounded up to determine the number of pieces of deep lead required.
 *
 * Example calculations:
 * - For 1 panel requiring normal lead: 2 pieces of normal lead (2100mm / 1500mm = 1.4, rounded up to 2).
 * - For 3 panels requiring normal lead: 3 pieces of normal lead (4475mm / 1500mm = 2.98, rounded up to 3).
 * - For 8 panels requiring normal lead: 8 pieces of normal lead ((8900mm + 1375mm + 1375mm) / 1500mm = 7.77, rounded up to 8).
 *
 * @param bottomRowPanelCount - The number of panels in the bottom row.
 * @param maxNonBottomRowWidth - The maximum width of non-bottom rows.
 * @returns An object containing the quantities of standard and deep lead required.
 */
function calculateLeadQuantity(bottomRowPanelCount: number, maxNonBottomRowWidth: number): { standard: number; deep: number } {
  const calculateLeadPieces = (panelCount: number): number => {
    let totalLength = 0;
    for (let i = 1; i <= panelCount; i++) {
      totalLength += leadMeterageTable[i] || leadMeterageTable.default;
    }
    return Math.ceil(totalLength / 1500);
  };

  const standard = calculateLeadPieces(bottomRowPanelCount);
  const deep = calculateLeadPieces(maxNonBottomRowWidth);

  return { standard, deep };
}

/**
 * Calculates the number of panels in a specific row of the grid.
 *
 * @param grid - The grid representing the layout of panels.
 * @param row - The row index to count the panels in.
 * @returns The number of panels in the specified row.
 */
function getPanelCountInRow(grid: GridType, row: number): number {
  if (row < 0 || row >= grid.length) return 0;
  return grid[row].filter(cell => cell === 1).length;
}

/**
 * Calculates the number of panels in the bottom row of the grid.
 *
 * @param grid - The grid representing the layout of panels.
 * @returns The number of panels in the bottom row.
 */
function getBottomRowPanelCount(grid: GridType): number {
  const totalRows = getTotalRows(grid);
  return getPanelCountInRow(grid, totalRows - 1);
}

/**
 * Calculates the number of panels that are not on the bottom row and do not have a panel directly below them.
 *
 * @param grid - The grid representing the layout of panels.
 * @returns The count of panels that meet the specified criteria.
 */
function getNonBottomWidthPanelCount(grid: GridType): number {
  const totalRows = getTotalRows(grid);
  const bottomRowIndex = totalRows - 1;

  // If there's only one row or less, return 0 as there are no non-bottom rows
  if (totalRows <= 1) return 0;

  let count = 0;

  // Iterate through each row except the bottom row
  for (let row = 0; row < bottomRowIndex; row++) {
    // Iterate through each column in the current row
    for (let col = 0; col < grid[row].length; col++) {
      // Check if the current cell contains a panel and if there's no panel directly below it
      if (grid[row][col] === 1 && grid[row + 1][col] === 0) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Calculates the total number of panels in the grid, excluding empty cells and error cells.
 *
 * @param cellTypesCount - An object containing counts of different cell types.
 * @returns The total number of panels.
 */
function getTotalPanelCount(cellTypesCount: CellTypesCount): number {
  return Object.values(cellTypesCount).reduce((sum, count) => sum + count, 0) - cellTypesCount.EmptyCell - cellTypesCount.Error;
}

/**
 * Determines the dimensions (rows and columns) of the grid based on the presence of panels.
 *
 * @param grid - The grid representing the layout of panels.
 * @returns An object containing the number of rows and columns with panels.
 */
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

/**
 * Calculates the quantity of battens required based on the dimensions of the grid.
 *
 * @param rows - The number of rows in the grid.
 * @param columns - The number of columns in the grid.
 * @returns The total number of battens required.
 */
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

/**
 * Calculates the number of panels in the top row of the grid.
 *
 * @param cellTypesCount - An object containing counts of different cell types.
 * @returns The number of panels in the top row.
 */
function getTopRowPanelCount(cellTypesCount: CellTypesCount): number {
  return cellTypesCount.TopSinglePanel + cellTypesCount.TopMidPanel + cellTypesCount.TopEndPanel;
}

// Updated calculateBOM function
/**
 * Calculates the Bill of Materials (BOM) based on the grid layout, panel type, and number of strings.
 *
 * @param cellTypesCount - An object containing counts of different cell types.
 * @param grid - The grid representing the layout of panels.
 * @param panelType - The type of panel being used.
 * @param numberOfStrings - The number of strings in the setup.
 * @returns The BOM object containing quantities, prices, totals, and explanations for each component.
 */
function calculateBOM(cellTypesCount: CellTypesCount, grid: GridType, panelType: string, numberOfStrings: number): BOM {
  const { rows, columns } = getGridDimensions(grid);
  const battenQuantity = calculateBattenQuantity(rows, columns);
  const totalPanelCount = getTotalPanelCount(cellTypesCount);
  const bottomRowPanelCount = getBottomRowPanelCount(grid);
  const maxNonBottomRowWidth = getNonBottomWidthPanelCount(grid);
  const topRowPanelCount = getTopRowPanelCount(cellTypesCount);

  const leadQuantities = calculateLeadQuantity(bottomRowPanelCount, maxNonBottomRowWidth);

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
      quantity: (leadQuantities.standard + leadQuantities.deep) * 3,
      price: componentPrices['Copper Nails'],
      total: 0,
      explanation: `3 nails per piece of lead (${leadQuantities.standard} standard + ${leadQuantities.deep} deep)`,
    },
    'Lead': {
      quantity: leadQuantities.standard,
      price: componentPrices['Lead'],
      total: 0,
      explanation: `Standard lead for ${bottomRowPanelCount} bottom row panels`,
    },
    'Lead 600mm': {
      quantity: leadQuantities.deep,
      price: componentPrices['Lead 600mm'],
      total: 0,
      explanation: `Deep lead for ${maxNonBottomRowWidth} maximum width of non-bottom rows`,
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

/**
 * Counts the occurrences of each cell type in the grid.
 *
 * @param grid - The grid representing the layout of panels.
 * @returns An object containing the counts of each cell type.
 */
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
      const cellTypes = determineCellType(grid, row, col);
      cellTypes.forEach(cellType => {
        cellTypesCount[cellType as keyof CellTypesCount]++;
      });
    }
  }

  return cellTypesCount;
}

/**
 * Determines the type of a cell in the grid based on its position and surrounding cells.
 *
 * @param grid - The grid representing the layout of panels.
 * @param row - The row index of the cell to determine the type for.
 * @param col - The column index of the cell to determine the type for.
 * @returns A string indicating the type of the cell.
 */
function determineCellType(grid: GridType, row: number, col: number): string[] {
  if (grid[row][col] === 0) return ['EmptyCell'];

  const cornerTypes = isCorner(grid, row, col);
  if (Object.values(cornerTypes).some(Boolean)) {
    return Object.entries(cornerTypes)
      .filter(([, value]) => value)
      .map(([key]) => key);
  }

  const isPanel = (r: number, c: number): boolean =>
      r >= 0 && r < gridSize && c >= 0 && c < gridSize && grid[r][c] === 1;

  const above = isPanel(row - 1, col);
  const below = isPanel(row + 1, col);
  const left = isPanel(row, col - 1);
  const right = isPanel(row, col + 1);

  if (!above && !below && !left && !right) return ['SinglePanel'];
  if (!above && below && !left && !right) return ['TopSinglePanel'];
  if (above && !below && !left && !right) return ['BottomSinglePanel'];
  if (above && below && !left && !right) return ['CenterSinglePanel'];

  if (!above && !below && left && right) return ['MidPanel'];
  if (above && below && left && right) return ['MiddleMidPanel'];
  if (!above && below && left && right) return ['TopMidPanel'];
  if (above && !below && left && right) return ['BottomMidPanel'];

  if (!above && !below && ((left && !right) || (!left && right))) return ['EndPanel'];
  if (above && below && ((left && !right) || (!left && right))) return ['MiddleEndPanel'];
  if (!above && below && ((left && !right) || (!left && right))) return ['TopEndPanel'];
  if (above && !below && ((left && !right) || (!left && right))) return ['BottomEndPanel'];

  return ['Error'];
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
      printWindow.document.body.innerHTML = '';
      createPortal(
        <PrintableChecklist bom={bom} />,
        printWindow.document.body
      );
      printWindow.onload = () => {
        printWindow.print();
      };
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
            Toggle Cell Types Count and Panel Information
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
              <Grid.Col span={12}>
                <Text>Bottom Row Panel Count: {getBottomRowPanelCount(grid)}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text>Max Non-Bottom Row Width: {getNonBottomWidthPanelCount(grid)}</Text>
              </Grid.Col>
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
