import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BOMCalculator from './BOMCalculator';
import {
  calculateLeadQuantity,
  determineCellType,
  getBattenDimensions,
  calculateBattenQuantity,
  getBottomRowPanelCount,
  getNonBottomRowPanelCount,
  getTotalPanelCount,
} from './BOMCalculator';

// Mock the createPortal function
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

describe('BOMCalculator Component', () => {
  it('renders without crashing', () => {
    render(<BOMCalculator />);
    expect(screen.getByText('Panel Type')).toBeInTheDocument();
    expect(screen.getByText('Number of Strings')).toBeInTheDocument();
    expect(screen.getByText('Toggle BOM Calculation Rules')).toBeInTheDocument();
    expect(screen.getByText('Reset Grid')).toBeInTheDocument();
    expect(screen.getByText('Print Checklist')).toBeInTheDocument();
  });

  it('allows selecting panel type', () => {
    render(<BOMCalculator />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'LONGi 405w' } });
    expect(select).toHaveValue('LONGi 405w');
  });

  it('allows setting number of strings', () => {
    render(<BOMCalculator />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '3' } });
    expect(input).toHaveValue(3);
  });

  it('toggles BOM calculation rules', () => {
    render(<BOMCalculator />);
    const toggleButton = screen.getByText('Toggle BOM Calculation Rules');
    fireEvent.click(toggleButton);
    expect(screen.getByText('BOM Calculation Rules')).toBeInTheDocument();
  });

  it('resets the grid when reset button is clicked', () => {
    render(<BOMCalculator />);
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
