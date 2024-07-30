import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import BOMCalculator, {
  calculateLeadQuantity,
  determineCellType,
  getBattenDimensions,
  calculateBattenQuantity,
  getBottomRowPanelCount,
  getNonBottomRowPanelCount,
  getTotalPanelCount,
  isCorner,
  countCellTypes,
  getTotalRows,
  isBottomRow,
  getPanelCountInRow,
  getTopRowPanelCount,
} from './BOMCalculator';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <MantineProvider>
      {ui}
    </MantineProvider>
  );
};
import {
  calculateLeadQuantity,
  determineCellType,
  getBattenDimensions,
  calculateBattenQuantity,
  getBottomRowPanelCount,
  getNonBottomRowPanelCount,
  getTotalPanelCount,
  isCorner,
  countCellTypes,
  getTotalRows,
  isBottomRow,
  getPanelCountInRow,
  getTopRowPanelCount,
} from './BOMCalculator';

// Mock the createPortal function
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

describe('BOMCalculator Component', () => {
  it('renders without crashing', () => {
    renderWithProvider(<BOMCalculator />);
    expect(screen.getByText('Panel Type')).toBeInTheDocument();
    expect(screen.getByText('Number of Strings')).toBeInTheDocument();
    expect(screen.getByText('Toggle BOM Calculation Rules')).toBeInTheDocument();
    expect(screen.getByText('Reset Grid')).toBeInTheDocument();
    expect(screen.getByText('Print Checklist')).toBeInTheDocument();
  });

  it('allows selecting panel type', () => {
    renderWithProvider(<BOMCalculator />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'LONGi 405w' } });
    expect(select).toHaveValue('LONGi 405w');
  });

  it('allows setting number of strings', () => {
    renderWithProvider(<BOMCalculator />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '3' } });
    expect(input).toHaveValue(3);
  });

  it('toggles BOM calculation rules', () => {
    renderWithProvider(<BOMCalculator />);
    const toggleButton = screen.getByText('Toggle BOM Calculation Rules');
    fireEvent.click(toggleButton);
    expect(screen.getByText('BOM Calculation Rules')).toBeInTheDocument();
  });

  it('resets the grid when reset button is clicked', () => {
    renderWithProvider(<BOMCalculator />);
    const resetButton = screen.getByText('Reset Grid');
    fireEvent.click(resetButton);
    expect(screen.getByText('Total Cost: £0.00')).toBeInTheDocument();
  });
});

describe('calculateLeadQuantity function', () => {
  it('calculates lead quantity correctly for 1 panel', () => {
    const result = calculateLeadQuantity(1, 0);
    expect(result).toEqual({ standard: 2, deep: 0 });
  });

  it('calculates lead quantity correctly for 3 panels', () => {
    const result = calculateLeadQuantity(3, 0);
    expect(result).toEqual({ standard: 3, deep: 0 });
  });

  it('calculates lead quantity correctly for 8 panels', () => {
    const result = calculateLeadQuantity(8, 0);
    expect(result).toEqual({ standard: 8, deep: 0 });
  });

  it('calculates deep lead quantity correctly', () => {
    const result = calculateLeadQuantity(3, 2);
    expect(result).toEqual({ standard: 3, deep: 2 });
  });
});

describe('determineCellType function', () => {
  const grid = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ];

  it('identifies SinglePanel correctly', () => {
    expect(determineCellType([[1]], 0, 0)).toEqual(['SinglePanel']);
  });

  it('identifies TopSinglePanel correctly', () => {
    expect(determineCellType([[1], [1]], 0, 0)).toEqual(['TopSinglePanel']);
  });

  it('identifies BottomSinglePanel correctly', () => {
    expect(determineCellType([[1], [1]], 1, 0)).toEqual(['BottomSinglePanel']);
  });

  it('identifies MidPanel correctly', () => {
    expect(determineCellType(grid, 0, 1)).toEqual(['MidPanel']);
  });

  it('identifies corner types correctly', () => {
    expect(determineCellType(grid, 0, 0)).toEqual(['TopLeftCorner']);
    expect(determineCellType(grid, 0, 2)).toEqual(['TopRightCorner']);
    expect(determineCellType(grid, 2, 0)).toEqual(['BottomLeftCorner']);
    expect(determineCellType(grid, 2, 2)).toEqual(['BottomRightCorner']);
  });
});

describe('getBattenDimensions function', () => {
  it('calculates batten dimensions correctly for a simple grid', () => {
    const grid = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    expect(getBattenDimensions(grid)).toEqual({ rows: 3, columns: 3 });
  });

  it('calculates batten dimensions correctly for an irregular grid', () => {
    const grid = [
      [1, 1, 0],
      [1, 1, 1],
      [1, 0, 0],
    ];
    expect(getBattenDimensions(grid)).toEqual({ rows: 3, columns: 3 });
  });

  it('returns zero dimensions for an empty grid', () => {
    const grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    expect(getBattenDimensions(grid)).toEqual({ rows: 0, columns: 0 });
  });
});

describe('calculateBattenQuantity function', () => {
  it('calculates batten quantity correctly for small grids', () => {
    expect(calculateBattenQuantity(3, 2, 6)).toBe(30);
    expect(calculateBattenQuantity(4, 3, 12)).toBe(63);
  });

  it('calculates batten quantity correctly for large grids', () => {
    expect(calculateBattenQuantity(25, 5, 125)).toBe(252);
  });

  it('returns 0 for no panels', () => {
    expect(calculateBattenQuantity(0, 0, 0)).toBe(0);
  });
});

describe('getBottomRowPanelCount function', () => {
  it('counts bottom row panels correctly', () => {
    const grid = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
    ];
    expect(getBottomRowPanelCount(grid)).toBe(2);
  });

  it('returns 0 for an empty grid', () => {
    const grid = [
      [0, 0, 0],
      [0, 0, 0],
    ];
    expect(getBottomRowPanelCount(grid)).toBe(0);
  });
});

describe('getNonBottomRowPanelCount function', () => {
  it('counts non-bottom row panels correctly', () => {
    const grid = [
      [1, 1, 0],
      [1, 0, 1],
      [1, 1, 1],
    ];
    expect(getNonBottomRowPanelCount(grid)).toBe(2);
  });

  it('returns 0 for a single row grid', () => {
    const grid = [[1, 1, 1]];
    expect(getNonBottomRowPanelCount(grid)).toBe(0);
  });
});

describe('getTotalPanelCount function', () => {
  it('counts total panels correctly', () => {
    const grid = [
      [1, 1, 0],
      [1, 0, 1],
      [1, 1, 1],
    ];
    expect(getTotalPanelCount(grid)).toBe(7);
  });

  it('returns 0 for an empty grid', () => {
    const grid = [
      [0, 0, 0],
      [0, 0, 0],
    ];
    expect(getTotalPanelCount(grid)).toBe(0);
  });
});

describe('isCorner function', () => {
  it('identifies top-left corner correctly', () => {
    const grid = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ];
    expect(isCorner(grid, 0, 0)).toEqual({ TopLeftCorner: true });
  });

  it('identifies top-right corner correctly', () => {
    const grid = [
      [0, 1, 1],
      [0, 0, 1],
      [0, 0, 0],
    ];
    expect(isCorner(grid, 0, 2)).toEqual({ TopRightCorner: true });
  });

  it('identifies bottom-left corner correctly', () => {
    const grid = [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
    ];
    expect(isCorner(grid, 2, 0)).toEqual({ BottomLeftCorner: true });
  });

  it('identifies bottom-right corner correctly', () => {
    const grid = [
      [0, 0, 0],
      [0, 0, 1],
      [0, 1, 1],
    ];
    expect(isCorner(grid, 2, 2)).toEqual({ BottomRightCorner: true });
  });

  it('identifies multiple corners for a single cell', () => {
    const grid = [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
    expect(isCorner(grid, 1, 1)).toEqual({
      TopLeftCorner: true,
      TopRightCorner: true,
      BottomLeftCorner: true,
      BottomRightCorner: true,
    });
  });

  it('returns an empty object for non-corner cells', () => {
    const grid = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    expect(isCorner(grid, 1, 1)).toEqual({});
  });

  it('handles edge cases correctly', () => {
    const grid = [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ];
    expect(isCorner(grid, 0, 0)).toEqual({ TopLeftCorner: true, BottomRightCorner: true });
    expect(isCorner(grid, 0, 2)).toEqual({ TopRightCorner: true, BottomLeftCorner: true });
    expect(isCorner(grid, 2, 0)).toEqual({ BottomLeftCorner: true, TopRightCorner: true });
    expect(isCorner(grid, 2, 2)).toEqual({ BottomRightCorner: true, TopLeftCorner: true });
  });

  it('handles single cell grid', () => {
    const grid = [[1]];
    expect(isCorner(grid, 0, 0)).toEqual({
      TopLeftCorner: true,
      TopRightCorner: true,
      BottomLeftCorner: true,
      BottomRightCorner: true,
    });
  });
});

describe('countCellTypes function', () => {
  it('counts cell types correctly', () => {
    const grid = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ];
    const result = countCellTypes(grid);
    expect(result.SinglePanel).toBe(0);
    expect(result.MidPanel).toBe(1);
    expect(result.TopLeftCorner).toBe(1);
    expect(result.TopRightCorner).toBe(1);
    expect(result.BottomLeftCorner).toBe(1);
    expect(result.BottomRightCorner).toBe(1);
    expect(result.EmptyCell).toBe(1);
  });
});

describe('getTotalRows function', () => {
  it('returns correct number of rows with panels', () => {
    const grid = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ];
    expect(getTotalRows(grid)).toBe(3);
  });

  it('returns 0 for an empty grid', () => {
    const grid = [
      [0, 0, 0],
      [0, 0, 0],
    ];
    expect(getTotalRows(grid)).toBe(0);
  });
});

describe('isBottomRow function', () => {
  const grid = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ];

  it('identifies bottom row correctly', () => {
    expect(isBottomRow(grid, 2)).toBe(true);
  });

  it('identifies non-bottom rows correctly', () => {
    expect(isBottomRow(grid, 0)).toBe(false);
    expect(isBottomRow(grid, 1)).toBe(false);
  });
});

describe('getPanelCountInRow function', () => {
  const grid = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 0],
  ];

  it('counts panels in a row correctly', () => {
    expect(getPanelCountInRow(grid, 0)).toBe(3);
    expect(getPanelCountInRow(grid, 1)).toBe(2);
    expect(getPanelCountInRow(grid, 2)).toBe(2);
  });

  it('returns 0 for out-of-bounds rows', () => {
    expect(getPanelCountInRow(grid, -1)).toBe(0);
    expect(getPanelCountInRow(grid, 3)).toBe(0);
  });
});

describe('getTopRowPanelCount function', () => {
  it('counts top row panels correctly', () => {
    const cellTypesCount = {
      TopSinglePanel: 1,
      TopMidPanel: 2,
      TopEndPanel: 1,
      // ... other properties
    };
    expect(getTopRowPanelCount(cellTypesCount)).toBe(4);
  });
});
