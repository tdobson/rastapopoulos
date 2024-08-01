'use client';

// components/BOMCalculator/BOMCalculator.tsx

import React, { useState, useRef, useCallback, useMemo } from 'react';

const HIDE_PRICING_INFO = false;
const HIDE_DEBUG_BUTTONS = false;
import { createPortal } from 'react-dom';
import {
  Grid,
  Select,
  Text,
  Button,
  Group,
  Collapse,
  Box,
  Stack,
  NumberInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  CellTypesCount,
  PanelPrices,
  ComponentPrices,
  BOM,
  BOMItem,
} from '../../types/bomCalculator';
import './BOMCalculator.css';
import BOMTable from '../BOMTable/BOMTable';
import PrintableChecklist from '../PrintableChecklist/PrintableChecklist';
import BOMRules from '../BOMRules/BOMRules';

const gridSize = 25;

type GridType = number[][];

const panelPrices: PanelPrices = {
  'DMEGC 405w': 112.0,
  'LONGi 405w': 121.5,
};

// Component prices
const componentPrices: ComponentPrices = {
  'GSE Half Portrait Frames': 19.52,
  'Lateral Flashing': 13.35,
  'GSE Screws Black': 0.26,
  'GSE Screws Silver': 0.3, // Example price, adjust as needed
  'GSE End Clamp': 1.11,
  'GSE Mid Clamp': 1.28,
  'Compressed Seal Roll': 9.15,
  'Pre Assembled DC Lead': 9.03,
  'DC Live Sticker': 0.24,
  'Cable Ties': 0.03,
  Battens: 0.24,
  'Galvanised Nails': 0.01,
  'Copper Nails': 0.02,
  Lead: 34.2, // per 1500mm length
  'Lead 600mm': 42.8, // Example price, adjust as needed
  'Tile Kicker Bars': 5.0, // Example price, adjust as needed
  'Kicker Bar Hooks': 1.5, // Example price, adjust as needed
  'Flexalu Top Flashing': 15.0, // Example price, adjust as needed
  'Arc Box': 20.0, // Example price, adjust as needed
  'Arc Box Bracket': 5.0, // Example price, adjust as needed
  'Roofer Guide Sheet': 1.0, // Example price, adjust as needed
  'Lateral Flashing Hooks': 0.5, // Example price, adjust as needed
  'Lateral Flashing Nails Galv 20mm': 0.02, // Example price, adjust as needed
  'Uberflex Carpet Flashing': 10.0, // Example price, adjust as needed
  'Wire Clout Nails 65mm': 0.5, // 50p per item
  'Panel Wedge': 0.5, // 50p per item
};

/**
 * Batten table for determining the number of battens required based on the number of columns and rows in the solar panel grid.
 *
 * The structure is as follows:
 * - The outer key represents the number of columns (up to 20 columns).
 * - The inner key represents the number of rows (up to 4 rows).
 * - The value is the number of battens required for that specific grid configuration.
 *
 * For example, battenTable[3][2] represents the number of battens needed for a grid with 3 columns and 2 rows.
 */
const battenTable: { [columns: number]: { [rows: number]: number } } = {
  1: { 1: 9, 2: 18, 3: 18, 4: 27 },
  2: { 1: 15, 2: 30, 3: 30, 4: 45 },
  3: { 1: 21, 2: 42, 3: 42, 4: 63 },
  4: { 1: 27, 2: 54, 3: 54, 4: 81 },
  5: { 1: 27, 2: 54, 3: 54, 4: 81 },
  6: { 1: 36, 2: 72, 3: 72, 4: 108 },
  7: { 1: 36, 2: 72, 3: 72, 4: 108 },
  8: { 1: 45, 2: 90, 3: 90, 4: 135 },
  9: { 1: 54, 2: 108, 3: 108, 4: 162 },
  10: { 1: 54, 2: 108, 3: 108, 4: 162 },
  11: { 1: 63, 2: 126, 3: 126, 4: 189 },
  12: { 1: 63, 2: 126, 3: 126, 4: 189 },
  13: { 1: 72, 2: 144, 3: 144, 4: 216 },
  14: { 1: 72, 2: 144, 3: 144, 4: 216 },
  15: { 1: 72, 2: 144, 3: 144, 4: 216 },
  16: { 1: 81, 2: 162, 3: 162, 4: 243 },
  17: { 1: 90, 2: 180, 3: 180, 4: 270 },
  18: { 1: 90, 2: 180, 3: 180, 4: 270 },
  19: { 1: 99, 2: 198, 3: 198, 4: 297 },
  20: { 1: 99, 2: 198, 3: 198, 4: 297 },
};

//number of panels vs millimetereage of lead required. eg 1 panel requires 2100mm of lead, 6 panels require 8900mm of lead, 7 panels require 8900+1375mm of lead etc
const leadMeterageTable = {
  1: 2100, // Length required for 1 panel
  2: 3400, // Length required for 2 panels
  3: 4475, // Length required for 3 panels
  4: 6000, // Length required for 4 panels
  5: 7275, // Length required for 5 panels
  6: 8900, // Length required for 6 panels
  default: 1375, // Additional length per panel after the 6th
  standardLeadLength: 1500, // Length of one piece of lead in mm
  conversionTable: {
    1: 2, // 1 panel requires 2 rolls of lead
    2: 3, // 2 panels require 3 rolls of lead
    3: 3, // 3 panels require 3 rolls of lead
    4: 4, // 4 panels require 4 rolls of lead
    5: 5, // 5 panels require 5 rolls of lead
    6: 6, // 6 panels require 6 rolls of lead
    default: 1, // Additional panels require 1 roll per panel
  },
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
export function isCorner(grid, row, col) {
  const gridSize = grid.length;
  const isPanel = (r, c) => r >= 0 && r < gridSize && c >= 0 && c < gridSize && grid[r][c] === 1;

  // Check if the current cell is a panel
  if (!isPanel(row, col)) return {};

  const above = isPanel(row - 1, col);
  const below = isPanel(row + 1, col);
  const left = isPanel(row, col - 1);
  const right = isPanel(row, col + 1);
  const topLeft = isPanel(row - 1, col - 1);
  const topRight = isPanel(row - 1, col + 1);
  const bottomLeft = isPanel(row + 1, col - 1);
  const bottomRight = isPanel(row + 1, col + 1);

  const corners = {};

  // Top-left corner check
  if (!topLeft && above && left) {
    corners['TopLeftCorner'] = true;
  }

  // Top-right corner check
  if (!topRight && above && right) {
    corners['TopRightCorner'] = true;
  }

  // Bottom-left corner check
  if (!bottomLeft && below && left) {
    corners['BottomLeftCorner'] = true;
  }

  // Bottom-right corner check
  if (!bottomRight && below && right) {
    corners['BottomRightCorner'] = true;
  }

  return corners;
}

/**
 * Calculates the total number of rows in the grid that contain at least one panel.
 *
 * @param {GridType} grid - The 2D array representing the solar panel layout.
 * @returns {number} The count of rows that contain at least one panel.
 *
 * @description
 * This function iterates through the entire grid and counts the number of rows
 * that have at least one panel (represented by a '1' in the grid).
 *
 * The function works as follows:
 * 1. Initialize a counter for rows with panels.
 * 2. Iterate through each row of the grid.
 * 3. For each row, check if it contains at least one panel.
 * 4. If a row contains a panel, increment the counter.
 * 5. After checking all rows, return the total count.
 *
 * This count represents the actual number of horizontal rows occupied by panels,
 * regardless of their position in the grid or any empty rows between them.
 *
 * @example
 * const grid = [
 *   [0, 0, 0, 0],  // Empty row
 *   [1, 1, 0, 0],  // Row with panels
 *   [0, 0, 0, 0],  // Empty row
 *   [0, 1, 1, 1],  // Row with panels
 *   [1, 0, 0, 0]   // Row with panels
 * ];
 * const totalRows = getTotalRows(grid);  // Returns 3
 */
export function getTotalRows(grid: GridType): number {
  let rowsWithPanels = 0;

  // Iterate through each row of the grid
  for (let row = 0; row < grid.length; row++) {
    // Check if the current row contains at least one panel
    if (grid[row].some(cell => cell === 1)) {
      rowsWithPanels++;
    }
  }

  return rowsWithPanels;
}

/**
 * Determines if a given row is the bottom row of the grid that contains panels.
 *
 * @param grid - The grid representing the layout of panels.
 * @param row - The row index to check.
 * @returns True if the row is the bottom row containing panels, otherwise false.
 */
export function isBottomRow(grid: GridType, row: number): boolean {
  const totalRows = getTotalRows(grid);
  return row === totalRows - 1;
}

/**
 * Calculates the quantity of lead required based on the number of panels in the bottom row.
 *
 * Lead calculation:
 * - Calculated based on the number of panels across the bottom row of the array.
 * - It comes in 1500mm lengths.
 * - The required length is determined using the `leadMeterageTable` constant.
 * - The total length required for the bottom row panels is calculated by summing the values from the `leadMeterageTable` for each panel count up to the `bottomRowPanelCount`.
 * - The total length is then divided by 1500mm and rounded up to determine the number of pieces of lead required.
 *
 * Example calculations:
 * - For 1 panel: 2 pieces of lead (2100mm / 1500mm = 1.4, rounded up to 2).
 * - For 3 panels: 3 pieces of lead (4475mm / 1500mm = 2.98, rounded up to 3).
 * - For 8 panels: 8 pieces of lead ((8900mm + 1375mm + 1375mm) / 1500mm = 7.77, rounded up to 8).
 *
 * @param bottomRowPanelCount - The number of panels in the bottom row.
 * @returns The number of pieces of lead required.
 */
export function calculateLeadQuantity(bottomRowPanelCount: number): number {
  if (bottomRowPanelCount <= 0) return 0; // No panels, no lead required

  // Use conversion table if available
  if (leadMeterageTable.conversionTable[bottomRowPanelCount] !== undefined) {
    return leadMeterageTable.conversionTable[bottomRowPanelCount];
  }

  // For more panels, calculate using the default value
  let totalLength = 0;
  for (let i = 1; i <= bottomRowPanelCount; i++) {
    totalLength += leadMeterageTable[i] || leadMeterageTable.default;
  }

  return Math.ceil(totalLength / leadMeterageTable.standardLeadLength);
}
/**
 * Calculates the number of panels in a specific row of the grid.
 *
 * @param grid - The grid representing the layout of panels.
 * @param row - The row index to count the panels in.
 * @returns The number of panels in the specified row.
 */
export function getPanelCountInRow(grid: GridType, row: number): number {
  if (row < 0 || row >= grid.length) return 0;
  return grid[row].filter((cell) => cell === 1).length;
}

/**
 * Calculates the number of panels that are not in the top row and do not have a panel directly above them,
 * including the top row panels.
 *
 * @param grid - The grid representing the layout of panels.
 * @returns The count of panels that meet the specified criteria.
 */
function getTopRowPanelCountWithNothingAbove(grid) {
  // Find the index of the first row that contains at least one panel
  let topRowIndex = -1;
  for (let row = 0; row < grid.length; row++) {
    if (grid[row].some(cell => cell === 1)) {
      topRowIndex = row;
      break;
    }
  }

  if (topRowIndex === -1) return 0; // No panels found in the grid

  let count = 0;

  // Count panels in the top row
  for (let col = 0; col < grid[topRowIndex].length; col++) {
    if (grid[topRowIndex][col] === 1) {
      count++;
    }
  }

  // Count panels in non-top rows without a panel directly above
  for (let row = topRowIndex + 1; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 1 && grid[row - 1][col] === 0) {
        count++;
      }
    }
  }

  return count;
}


/**
 * Calculates the number of panels that are not in the top row and do not have a panel directly above them.
 *
 * @param grid - The grid representing the layout of panels.
 * @returns The count of panels that meet the specified criteria.
 */
function getNonTopRowPanelCount(grid) {
  // Find the index of the first row that contains at least one panel
  let topRowIndex = -1;
  for (let row = 0; row < grid.length; row++) {
    if (grid[row].some(cell => cell === 1)) {
      topRowIndex = row;
      break;
    }
  }

  if (topRowIndex === -1) return 0; // No panels found in the grid

  let count = 0;

  for (let row = topRowIndex + 1; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 1 && grid[row - 1][col] === 0) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Calculates the number of panels in the bottom row of the grid.
 *
 * @param grid - The grid representing the layout of panels.
 * @returns The number of panels in the bottom row.
 */
export function getBottomRowPanelCount(grid: GridType): number {
  const totalRows = getTotalRows(grid);
  return getPanelCountInRow(grid, totalRows - 1);
}

/**
 * Calculates the number of panels that are not on the bottom row and do not have a panel directly below them.
 *
 * @param grid - The grid representing the layout of panels.
 * @returns The count of panels that meet the specified criteria.
 */
export function getNonBottomRowPanelCount(grid: GridType): number {
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
 * Calculates the total number of active cells (panels) in the grid.
 *
 * @param grid - The grid representing the layout of panels.
 * @returns The total number of active cells (panels).
 */
export function getTotalPanelCount(grid: GridType): number {
  return grid.flat().filter((cell) => cell === 1).length;
}

/**
 * Determines the dimensions (rows and columns) of the grid based on the presence of panels.
 *
 * @param grid - The grid representing the layout of panels.
 * @returns An object containing the number of rows and columns with panels.
 */

/**
 * Determines the actual dimensions of the panel layout for batten calculation.
 *
 * @param grid - The grid representing the layout of panels.
 * @returns An object containing the number of rows with panels and the maximum number of columns with panels.
 */
export function getBattenDimensions(grid: GridType): { rows: number; columns: number } {
  let rows = 0;
  let maxColumns = 0;

  for (let row = 0; row < grid.length; row++) {
    let columnsInRow = 0;
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 1) {
        columnsInRow++;
      }
    }
    if (columnsInRow > 0) {
      rows++;
      maxColumns = Math.max(maxColumns, columnsInRow);
    }
  }

  return { rows, columns: maxColumns };
}

/**
 * Calculates the number of horizontal rows of panels in the grid.
 *
 * @param {GridType} grid - The 2D array representing the solar panel layout.
 * @returns {number} The count of horizontal rows containing panels.
 *
 * @description
 * This function counts the number of distinct horizontal rows of panels in the grid.
 * A horizontal row is counted when it contains at least one panel and is preceded
 * by a row without panels or is the first row with panels.aaaaaaaaa
 *
 * The algorithm works as follows:
 * 1. Initialize a counter for horizontal rows and a flag for the previous row's state.
 * 2. Iterate through each row of the grid.
 * 3. For each row, check if it contains any panels.
 * 4. If the current row has panels and the previous row did not, increment the counter.
 * 5. Update the previous row state for the next iteration.
 * 6. After checking all rows, return the total count of horizontal rows.
 *
 * This count is used for determining the number of panel wedges required in the BOM,
 * as one wedge is needed per horizontal row of panels.
 *
 * @example
 * const grid = [
 *   [1, 1, 1, 0],  // First horizontal row
 *   [0, 0, 0, 0],
 *   [1, 1, 0, 0],  // Second horizontal row
 *   [1, 1, 0, 0],  // (Same horizontal row as above)
 *   [0, 0, 0, 0],
 *   [0, 1, 1, 1]   // Third horizontal row
 * ];
 * const horizontalRowCount = getHorizontalRowCount(grid);  // Returns 3
 */
export function getHorizontalRowCount(grid: GridType): number {
  let horizontalRows = 0;
  let previousRowHadPanel = false;

  for (let row = 0; row < grid.length; row++) {
    const hasPanel = grid[row].some(cell => cell === 1);
    if (hasPanel && !previousRowHadPanel) {
      horizontalRows++;
    }
    previousRowHadPanel = hasPanel;
  }

  return horizontalRows;
}

/**
 * Calculates the quantity of battens required based on the dimensions of the solar panel grid.
 *
 * @param {number} rows - The number of rows in the solar panel grid.
 * @param {number} columns - The number of columns in the solar panel grid.
 * @param {number} totalPanelCount - The total number of solar panels in the grid.
 * @returns {number} The total number of battens required.
 *
 * @description
 * This function determines the number of battens needed for a solar panel installation.
 * Battens are horizontal supports used to secure solar panels to a roof.
 *
 * The calculation is based on the following business logic:
 * 1. If no solar panels are specified (totalPanelCount is 0), no battens are needed.
 * 2. For grids up to 20 columns and 4 rows, a predefined lookup table (battenTable) is used.
 * 3. For larger grids, a base quantity is calculated and then adjusted:
 *    - The base quantity is the value for a 20x4 grid from the lookup table.
 *    - For each column beyond 20, 9 additional battens are added.
 *    - For each row beyond 4, the number of battens for the current column count is added.
 *
 * This approach ensures accurate batten quantities for standard installations
 * while providing a reasonable estimate for larger, non-standard installations.
 *
 * @example
 * // For a 2x3 grid with 6 panels
 * const battenCount = calculateBattenQuantity(2, 3, 6);
 * console.log(battenCount); // Output: 42
 *
 * @example
 * // For a 5x25 grid with 125 panels
 * const largeBattenCount = calculateBattenQuantity(5, 25, 125);
 * console.log(largeBattenCount); // Output: 495
 */
export function calculateBattenQuantity(
  rows: number,
  columns: number,
  totalPanelCount: number
): number {
  // Return 0 if no solar panels are specified
  if (totalPanelCount === 0) {
    return 0;
  }

  // Limit the columns and rows to the maximum values in our lookup table
  const safeColumns = Math.min(columns, 20);
  const safeRows = Math.min(rows, 4);

  // If the grid size is within our lookup table, return the value directly
  if (safeColumns <= 20 && safeRows <= 4) {
    console.log(`Debug: safeColumns = ${safeColumns}, safeRows = ${safeRows}`);
    // This line might cause undefined if battenTable[safeRows] is undefined
    // or if battenTable[safeRows][safeColumns] is undefined
    return battenTable[safeRows][safeColumns] || 0; // Add fallback to 0
  }

  // For larger grids, start with the maximum value in our lookup table
  let baseQuantity = battenTable[4][20] || 0; // Add fallback to 0

  // Add 9 battens for each column beyond 20
  if (columns > 20) {
    baseQuantity += (columns - 20) * 9;
  }

  // For each row beyond 4, add the batten count for the current column count (up to 20)
  if (rows > 4) {
    for (let i = 5; i <= rows; i++) {
      // This line might cause undefined if battenTable[Math.min(columns, 20)] is undefined
      // or if battenTable[Math.min(columns, 20)][4] is undefined
      baseQuantity += battenTable[Math.min(columns, 20)][4] || 0; // Add fallback to 0
    }
  }

  return baseQuantity;
}

/**
 * Calculates the number of panels in the top row of the grid.
 *
 * @param cellTypesCount - An object containing counts of different cell types.
 * @param grid - The grid representing the layout of panels.
 * @returns The number of panels in the top row.
 * @description This function counts all panels located in the top row of the grid. If there's only one row, it returns the total panel count for that row.
 */
export function getTopRowPanelCount(cellTypesCount: CellTypesCount, grid: GridType): number {
  const totalRows = getTotalRows(grid);
  if (totalRows === 1) {
    return  cellTypesCount.SinglePanel + cellTypesCount.EndPanel + cellTypesCount.MidPanel;
  }
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
export function calculateBOM(
  cellTypesCount: CellTypesCount,
  grid: GridType,
  panelType: string,
  numberOfStrings: number
): BOM {
  const { rows, columns } = getBattenDimensions(grid);
  const totalPanelCount = getTotalPanelCount(grid);
  const battenQuantity = calculateBattenQuantity(rows, columns, totalPanelCount);
  const bottomRowPanelCount = getBottomRowPanelCount(grid);
  const topRowPanelCount = getTopRowPanelCount(cellTypesCount, grid); //unsafe
  const totalTopRowPanelCount = getTopRowPanelCountWithNothingAbove(grid)
  const nonTopRowPanelCount = getNonTopRowPanelCount(grid);
  const horizontalRowCount = getHorizontalRowCount(grid);

  const leadQuantity = calculateLeadQuantity(bottomRowPanelCount);

 // console.log("topRowPanelCount: " + topRowPanelCount + " - totalTopRowPanelCount: " + totalTopRowPanelCount)

  const bom: BOM = {
    'GSE Half Portrait Frames': {
      quantity: totalPanelCount * 2,
      price: componentPrices['GSE Half Portrait Frames'],
      total: 0,
      explanation: `${totalPanelCount} total panels * 2`,
    },
    'Lateral Flashing': {
      quantity:
        (cellTypesCount.SinglePanel * 2 +
          cellTypesCount.TopSinglePanel * 2 +
          cellTypesCount.BottomSinglePanel * 2 +
          cellTypesCount.CenterSinglePanel * 2 +
          cellTypesCount.BottomEndPanel * 1 +
          cellTypesCount.TopEndPanel * 1 +
          cellTypesCount.EndPanel
        ) * 2,
      price: componentPrices['Lateral Flashing'],
      total: 0,
      explanation: `(${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel + ${cellTypesCount.EndPanel} EndPanel) * 2 * 2`,
    },
    'GSE Screws Black': {
      quantity:
          cellTypesCount.SinglePanel * 4 +
          cellTypesCount.TopSinglePanel * 4 +
          cellTypesCount.BottomSinglePanel * 4 +
          cellTypesCount.EndPanel * 2 +
          cellTypesCount.MidPanel * 2 +
          cellTypesCount.MiddleMidPanel * 2 +
          cellTypesCount.TopMidPanel * 2 +
          cellTypesCount.BottomEndPanel * 3 +
          cellTypesCount.TopEndPanel * 3 +
          cellTypesCount.BottomMidPanel * 2,
      price: componentPrices['GSE Screws Black'],
      total: 0,
      explanation: `(${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel + ${cellTypesCount.EndPanel} EndPanel) * 3 + ${cellTypesCount.EndPanel} EndPanel + ${cellTypesCount.MidPanel} MidPanel`,
    },
    'GSE Screws Silver': {
      quantity: totalPanelCount * 6,
      price: componentPrices['GSE Screws Silver'],
      total: 0,
      explanation: `6 screws per panel, totaling ${totalPanelCount * 6} screws for ${totalPanelCount} total panels`,
    },
    'GSE End Clamp': {
      quantity:
        cellTypesCount.SinglePanel * 4 +
        cellTypesCount.TopSinglePanel * 4 +
        cellTypesCount.BottomSinglePanel * 4 +
          cellTypesCount.BottomEndPanel * 2 +
          cellTypesCount.TopEndPanel * 2 +
        cellTypesCount.EndPanel * 2,
      price: componentPrices['GSE End Clamp'],
      total: 0,
      explanation: `(${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel) * 4 + ${cellTypesCount.EndPanel} EndPanel * 2`,
    },
    'GSE Mid Clamp': {
      quantity:
        cellTypesCount.MidPanel * 2 +
        cellTypesCount.MiddleMidPanel * 2 +
        cellTypesCount.TopMidPanel * 2 +
          cellTypesCount.BottomEndPanel * 1 +
          cellTypesCount.TopEndPanel * 1 +
        cellTypesCount.BottomMidPanel * 2 +
        cellTypesCount.EndPanel ,
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
    Battens: {
      quantity: battenQuantity,
      price: componentPrices['Battens'],
      total: 0,
      explanation: `${battenQuantity} battens for ${rows} rows and ${columns} columns`,
    },
    'Copper Nails': {
      quantity: leadQuantity * 3,
      price: componentPrices['Copper Nails'],
      total: 0,
      explanation: `3 nails per piece of lead (${leadQuantity} pieces)`,
    },
    Lead: {
      quantity: leadQuantity,
      price: componentPrices['Lead'],
      total: 0,
      explanation: `Lead for ${bottomRowPanelCount} bottom row panels`,
    },
    'Tile Kicker Bars': {
      quantity: totalTopRowPanelCount,
      price: componentPrices['Tile Kicker Bars'],
      total: 0,
      explanation: `1 per non-top row panel, totaling ${totalTopRowPanelCount}`,
    },
    'Kicker Bar Hooks': {
      quantity: totalTopRowPanelCount * 2,
      price: componentPrices['Kicker Bar Hooks'],
      total: 0,
      explanation: `2 per non-top row panel, totaling ${totalTopRowPanelCount * 2}`,
    },
    'Flexalu Top Flashing': {
      quantity: Math.ceil(totalTopRowPanelCount / 4),
      price: componentPrices['Flexalu Top Flashing'],
      total: 0,
      explanation: `Ceiling of ${totalTopRowPanelCount} top row panels / 4`,
    },
    'Arc Box': {
      quantity: 2 * numberOfStrings,
      price: componentPrices['Arc Box'],
      total: 0,
      explanation: `2 Arc Box per string, ${numberOfStrings} strings`,
    },
    'Arc Box Bracket': {
      quantity: 2 * numberOfStrings,
      price: componentPrices['Arc Box Bracket'],
      total: 0,
      explanation: `2 Arc Box Bracket per string, ${numberOfStrings} strings`,
    },
    'Roofer Guide Sheet': {
      quantity: 1,
      price: componentPrices['Roofer Guide Sheet'],
      total: 0,
      explanation: `1 per plot`,
    },
    'Lateral Flashing Hooks': {
      quantity:
        cellTypesCount.EndPanel * 2 +
        cellTypesCount.SinglePanel * 4 +
        cellTypesCount.TopSinglePanel * 4 +
        cellTypesCount.BottomSinglePanel * 4,
      price: componentPrices['Lateral Flashing Hooks'],
      total: 0,
      explanation: `(${cellTypesCount.EndPanel} EndPanel * 2) + (${cellTypesCount.SinglePanel} SinglePanel + ${cellTypesCount.TopSinglePanel} TopSinglePanel + ${cellTypesCount.BottomSinglePanel} BottomSinglePanel) * 4`,
    },
    'Lateral Flashing Nails Galv 20mm': {
      quantity:
        cellTypesCount.EndPanel * 2 +
        cellTypesCount.SinglePanel * 4 +
        cellTypesCount.TopSinglePanel * 4 +
        cellTypesCount.BottomSinglePanel * 4,
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
    'Wire Clout Nails 65mm': {
      quantity: battenQuantity * 5,
      price: componentPrices['Wire Clout Nails 65mm'],
      total: 0,
      explanation: `5 nails per batten, ${battenQuantity} battens`,
    },
    'Panel Wedge': {
      quantity: horizontalRowCount,
      price: componentPrices['Panel Wedge'],
      total: 0,
      explanation: `1 wedge per horizontal row of panels, ${horizontalRowCount} rows`,
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
export function countCellTypes(grid: GridType): CellTypesCount {
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
      cellTypes.forEach((cellType) => {
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
 * @returns An array indicating the types of the cell.
 */
function determineCellType(grid, row, col) {
  if (grid[row][col] === 0) return ['EmptyCell'];

  const cellTypes = [];
  const cornerTypes = isCorner(grid, row, col);
  cellTypes.push(...Object.keys(cornerTypes));

  const isPanel = (r, c) =>
      r >= 0 && r < grid.length && c >= 0 && c < grid[0].length && grid[r][c] === 1;

  const above = isPanel(row - 1, col);
  const below = isPanel(row + 1, col);
  const left = isPanel(row, col - 1);
  const right = isPanel(row, col + 1);

  // Single panels (no adjacent panels)
  if (!above && !below && !left && !right) cellTypes.push('SinglePanel');          // Isolated panel

  // vertical column panels
  if (!above && below && !left && !right) cellTypes.push('TopSinglePanel');        // Top of a single vertical column
  if (above && !below && !left && !right) cellTypes.push('BottomSinglePanel');     // Bottom of a single vertical column
  if (above && below && !left && !right) cellTypes.push('CenterSinglePanel');      // Middle of a single vertical column

  // Horizontal row panels
  if (!above && !below && left && right) cellTypes.push('MidPanel');               // Middle of a single horizontal row
  if (!above && !below && ((left && !right) || (!left && right))) cellTypes.push('EndPanel');           // End of a single horizontal row

  // grid panels
  if (!above && below && left && right) cellTypes.push('TopMidPanel');             // Middle panel in the top row
  if (above && !below && left && right) cellTypes.push('BottomMidPanel');          // Middle panel in the bottom row
  if (above && below && left && right) cellTypes.push('MiddleMidPanel');           // Middle panel in the middle of the grid
  if (above && below && ((left && !right) || (!left && right))) cellTypes.push('MiddleEndPanel');       // Vertical edge in the middle of the grid

  // interesting grid panels
  if (!above && below && ((left && !right) || (!left && right))) cellTypes.push('TopEndPanel');         // Top corner of the grid (not including single panel)
  if (above && !below && ((left && !right) || (!left && right))) cellTypes.push('BottomEndPanel');      // Bottom corner of the grid (not including single panel)

  if (cellTypes.length === 0) cellTypes.push('Error');

  return cellTypes;
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

  const bom = calculateBOM(
    cellTypesCount,
    grid,
    panelType,
    typeof numberOfStrings === 'number' ? numberOfStrings : 1
  );
  const totalCost = useMemo(
    () => (HIDE_PRICING_INFO ? 0 : Object.values(bom).reduce((sum, item) => sum + item.total, 0)),
    [bom]
  );

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

  const [openedCellTypes, { toggle: toggleCellTypes }] = useDisclosure(false);
  const [openedBOMRules, { toggle: toggleBOMRules }] = useDisclosure(false);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const handlePrint = useCallback(() => {
    setIsPrintModalOpen(true);
  }, []);

  const handleClosePrintModal = useCallback(() => {
    setIsPrintModalOpen(false);
  }, []);

  return (
    <Stack gap="md">
      <Group justify="center" mb="md">
        {HIDE_PRICING_INFO ? null : (
          <Select
            label="Panel Type"
            value={panelType}
            onChange={(value) => setPanelType(value || 'DMEGC 405w')}
            data={Object.keys(panelPrices)}
          />
        )}
        <NumberInput
          label="Number of Strings"
          value={numberOfStrings}
          onChange={(value) => setNumberOfStrings(value !== '' ? Number(value) : '')}
          min={1}
          max={10}
        />
      </Group>
      <Group justify="center" mb="md">
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
      </Group>

      <Group justify="center" mb="md">
        <Button onClick={handlePrint} size="md">
          Open Checklist
        </Button>
        <Button variant="filled" color="yellow" onClick={clearGrid} size="md">
          Reset Grid
        </Button>
      </Group>
      <PrintableChecklist bom={bom} opened={isPrintModalOpen} onClose={handleClosePrintModal} />
      {HIDE_PRICING_INFO ? null : (
        <>
          <Text size="xl">Bill of Materials:</Text>
          <Text size="xl">Total Cost: £{totalCost.toFixed(2)}</Text>
        </>
      )}

      <BOMTable bom={bom} />
      <Group justify="center" mb="md">
        {HIDE_DEBUG_BUTTONS ? null : (
          <>
            <Box>
              <Button variant="filled" color="gray" onClick={toggleCellTypes} size="md">
                Toggle Cell Types Count and Panel Information
              </Button>

              <Collapse in={openedCellTypes}>
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
                    <Text>Non-Bottom Row Panel Count: {getNonBottomRowPanelCount(grid)}</Text>
                  </Grid.Col>
                </Grid>
              </Collapse>
            </Box>
            <Box>
              <Button variant="filled" color="gray" onClick={toggleBOMRules} size="md">
                Toggle BOM Calculation Rules
              </Button>

              <Collapse in={openedBOMRules}>
                <BOMRules />
              </Collapse>
            </Box>
          </>
        )}
      </Group>
    </Stack>
  );
}

export default BOMCalculator;
