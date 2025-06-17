import React from 'react';
import usePatchworkGrid from '../hooks/usePatchworkGrid'; // Import the hook
import PatchworkBlock from './PatchworkBlock'; // Import the block component

const PatchworkGrid = () => {
  const {
    gridRef,
    gameBlocks,
    dragInformation,
    handleBlockResize,
    mainGridDropRef,
    isGridHovered,
    GRID_COLS,
    GRID_ROWS,
    CELL_SIZE,
    PATCHWORK_SECTIONS,
  } = usePatchworkGrid(); // Use the custom hook

  const renderGridElements = () => {
    const gridElements = [];

    // Super subtle section backgrounds (barely visible)
    PATCHWORK_SECTIONS.forEach((sectionItem, sectionIndex) => {
      const sectionHue = (sectionIndex * 137.5) % 360; // Golden angle for nice color distribution
      gridElements.push(
        <div
          key={`section-bg-${sectionItem.id}`}
          className="absolute transition-all duration-500"
          style={{
            left: sectionItem.x * CELL_SIZE,
            top: sectionItem.y * CELL_SIZE,
            width: sectionItem.width * CELL_SIZE,
            height: sectionItem.height * CELL_SIZE,
            backgroundColor: `hsla(${sectionHue}, 15%, 95%, 0.3)`,
            borderRadius: '8px',
          }}
        />
      );
    });

    // Minimal grid lines
    for (let verticalIndex = 0; verticalIndex <= GRID_COLS; verticalIndex++) {
      gridElements.push(
        <div
          key={`vertical-line-${verticalIndex}`}
          className="absolute border-l border-gray-100 opacity-20"
          style={{
            left: verticalIndex * CELL_SIZE,
            top: 0,
            height: GRID_ROWS * CELL_SIZE,
          }}
        />
      );
    }

    for (let horizontalIndex = 0; horizontalIndex <= GRID_ROWS; horizontalIndex++) {
      gridElements.push(
        <div
          key={`horizontal-line-${horizontalIndex}`}
          className="absolute border-t border-gray-100 opacity-20"
          style={{
            top: horizontalIndex * CELL_SIZE,
            left: 0,
            width: GRID_COLS * CELL_SIZE,
          }}
        />
      );
    }

    return gridElements;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Secret Patchwork Grid with Edge Resizing ✨
        </h1>
        <p className="text-gray-600 text-lg mb-2">
          Drag blocks around and discover the hidden sections! Each area morphs blocks to different sizes.
        </p>
        <p className="text-gray-500 text-sm">
          💡 <strong>Pro tip:</strong> Hover over block edges to see resize handles - drag them to resize blocks! Blocks will intelligently push or resize neighbors.
        </p>

        {dragInformation.currentSection && dragInformation.morphedSize && (
          <div className="mt-4 p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
            <p className="text-gray-800 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></span>
              Morphing to {dragInformation.morphedSize.width}×{dragInformation.morphedSize.height}
            </p>
          </div>
        )}
      </div>

      <div className="overflow-auto max-h-screen">
        <div
          ref={(el) => {
            mainGridDropRef(el);
            gridRef.current = el;
          }}
          className="relative bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 mx-auto"
          style={{
            width: GRID_COLS * CELL_SIZE,
            height: GRID_ROWS * CELL_SIZE,
          }}
        >
          {renderGridElements()}

          {/* Preview position with morphed size */}
          {dragInformation.previewPosition && dragInformation.morphedSize && (
            <div
              className="absolute border-3 border-dashed border-purple-400 bg-purple-100 bg-opacity-30 rounded-2xl pointer-events-none z-40"
              style={{
                left: dragInformation.previewPosition.x * CELL_SIZE,
                top: dragInformation.previewPosition.y * CELL_SIZE,
                width: dragInformation.morphedSize.width * CELL_SIZE - 4,
                height: dragInformation.morphedSize.height * CELL_SIZE - 4,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-purple-600 font-bold text-sm bg-white/70 px-2 py-1 rounded-lg backdrop-blur-sm">
                  {dragInformation.morphedSize.width}×{dragInformation.morphedSize.height}
                </div>
              </div>
            </div>
          )}

          {/* Blocks */}
          {gameBlocks.map(blockItem => (
            <PatchworkBlock
              key={`block-${blockItem.id}`}
              blockData={blockItem}
              onBlockMove={() => {}} // Movement handled by drop target, not block itself
              onBlockResize={handleBlockResize}
              activeSectionInfo={dragInformation.currentSection}
              morphedSizeInfo={dragInformation.morphedSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatchworkGrid;