export const GRID_COLS = 6;
export const GRID_ROWS = 60;

// Secret patchwork sections scattered throughout the grid
export const PATCHWORK_SECTIONS = [
  // Top area mix
  { id: 1, x: 0, y: 0, width: 3, height: 8, blockSize: { width: 3, height: 4 } },
  { id: 2, x: 3, y: 0, width: 3, height: 6, blockSize: { width: 3, height: 3 } },
  { id: 3, x: 3, y: 6, width: 2, height: 4, blockSize: { width: 2, height: 2 } },
  { id: 4, x: 5, y: 6, width: 1, height: 6, blockSize: { width: 1, height: 3 } },



  // Mid-top chaos
  { id: 5, x: 0, y: 8, width: 2, height: 9, blockSize: { width: 2, height: 3 } },
  { id: 6, x: 2, y: 8, width: 4, height: 4, blockSize: { width: 4, height: 2 } },
  { id: 7, x: 2, y: 12, width: 3, height: 5, blockSize: { width: 3, height: 5 } },
  { id: 8, x: 5, y: 12, width: 1, height: 8, blockSize: { width: 1, height: 4 } },

  // Wild middle section
  { id: 9, x: 0, y: 17, width: 6, height: 3, blockSize: { width: 6, height: 3 } },
  { id: 10, x: 0, y: 20, width: 2, height: 6, blockSize: { width: 2, height: 6 } },
  { id: 11, x: 2, y: 20, width: 1, height: 4, blockSize: { width: 1, height: 1 } },
  { id: 12, x: 3, y: 20, width: 3, height: 8, blockSize: { width: 3, height: 2 } },

  // Compact zone
  { id: 13, x: 2, y: 24, width: 1, height: 4, blockSize: { width: 1, height: 2 } },
  { id: 14, x: 0, y: 26, width: 2, height: 6, blockSize: { width: 2, height: 3 } },

  // Mega blocks area
  { id: 15, x: 0, y: 32, width: 4, height: 6, blockSize: { width: 4, height: 3 } },
  { id: 16, x: 4, y: 28, width: 2, height: 10, blockSize: { width: 2, height: 5 } },

  // Tall and thin section
  { id: 17, x: 0, y: 38, width: 1, height: 8, blockSize: { width: 1, height: 4 } },
  { id: 18, x: 1, y: 38, width: 2, height: 12, blockSize: { width: 2, height: 4 } },
  { id: 19, x: 3, y: 38, width: 3, height: 6, blockSize: { width: 3, height: 3 } },

  // Wide sections
  { id: 20, x: 3, y: 44, width: 3, height: 4, blockSize: { width: 3, height: 2 } },
  { id: 21, x: 0, y: 46, width: 3, height: 6, blockSize: { width: 3, height: 6 } },

  // Final chaos
  { id: 22, x: 3, y: 48, width: 2, height: 8, blockSize: { width: 2, height: 4 } },
  { id: 23, x: 5, y: 48, width: 1, height: 4, blockSize: { width: 1, height: 2 } },
  { id: 24, x: 0, y: 52, width: 6, height: 2, blockSize: { width: 2, height: 2 } },
  { id: 25, x: 5, y: 52, width: 1, height: 8, blockSize: { width: 1, height: 1 } },
  { id: 26, x: 0, y: 54, width: 5, height: 6, blockSize: { width: 5, height: 3 } },
];

export const BLOCK_ITEM_TYPE = 'DRAGGABLE_BLOCK';
export const CELL_SIZE = 40;