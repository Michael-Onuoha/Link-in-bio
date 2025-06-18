// PatchworkBlock.js - Complete with mobile drag support
"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { BLOCK_ITEM_TYPE, CELL_SIZE } from '../constants';
import ResizeHandle from './ResizeHandle';

const PatchworkBlock = ({ blockData, onBlockMove, onBlockResize, activeSectionInfo, morphedSizeInfo }) => {
  const blockRef = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: BLOCK_ITEM_TYPE,
    item: { id: blockData.id, originalPosition: { x: blockData.x, y: blockData.y } },
    collect: (monitor) => {
      // Debug logging - remove this after testing
      console.log('Block', blockData.id, 'drag status:', monitor.isDragging());
      return {
        isDragging: monitor.isDragging(),
      };
    },
    options: {
      dropEffect: 'move',
    },
  });

  const [isClicked, setIsClicked] = useState(false);

  const currentDisplaySize = morphedSizeInfo && isDragging ? morphedSizeInfo : { width: blockData.width, height: blockData.height };

  // Simplified click handler for selection
  const handleClick = (e) => {
    if (blockRef.current && (blockRef.current === e.target || blockRef.current.contains(e.target))) {
      if (!e.target.classList.contains('resize-handle')) {
        setIsClicked(true);
      }
    }
  };

  // Document interaction handler to deselect
  useEffect(() => {
    const handleDocumentInteraction = (e) => {
      if (blockRef.current && !blockRef.current.contains(e.target)) {
        setIsClicked(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentInteraction);
    document.addEventListener('touchstart', handleDocumentInteraction, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleDocumentInteraction);
      document.removeEventListener('touchstart', handleDocumentInteraction);
    };
  }, []);

  // Combine refs for drag functionality
  const setRefs = (node) => {
    blockRef.current = node;
    drag(node);
    preview(node);
  };

  return (
    <div
      ref={setRefs}
      onClick={handleClick}
      className={`absolute rounded-2xl shadow-lg cursor-grab active:cursor-grabbing select-none transition-all duration-300 ease-out group ${blockData.color} ${
        isDragging
          ? 'opacity-75 z-50 scale-105'
          : 'hover:scale-105 hover:shadow-xl z-10 hover:-rotate-1'
      }`}
      style={{
        left: blockData.x * CELL_SIZE,
        top: blockData.y * CELL_SIZE,
        width: currentDisplaySize.width * CELL_SIZE - 4,
        height: currentDisplaySize.height * CELL_SIZE - 4,
        transformOrigin: 'center center',
        // Mobile-optimized touch settings
        touchAction: 'none', // Critical for mobile dragging
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none', // Prevent iOS context menu
        WebkitUserDrag: 'none', // Prevent native HTML5 drag
        WebkitUserSelect: 'none',
        KhtmlUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
        // Prevent scrolling during drag
        overscrollBehavior: 'none',
        // Additional mobile-specific styles
        WebkitOverflowScrolling: 'touch',
        zIndex: isDragging ? 1000 : 10,
      }}
      data-block-id={blockData.id}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2 pointer-events-none">
        <div className="text-white font-bold text-2xl drop-shadow-lg mb-1">
          {blockData.id}
        </div>
        <div className="text-white text-xs opacity-80 font-medium">
          {currentDisplaySize.width}×{currentDisplaySize.height}
        </div>
      </div>

      {/* Enhanced shine effects */}
      <div className={`absolute top-2 left-2 w-4 h-4 bg-white bg-opacity-40 rounded-full blur-sm pointer-events-none transition-opacity duration-200 ${isClicked ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute top-4 left-5 w-2 h-2 bg-white bg-opacity-20 rounded-full pointer-events-none transition-opacity duration-200 ${isClicked ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute bottom-3 right-3 w-3 h-3 bg-white bg-opacity-10 rounded-full blur-sm pointer-events-none transition-opacity duration-200 ${isClicked ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Morphing size indicator */}
      {isDragging && morphedSizeInfo && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-bounce pointer-events-none">
          {morphedSizeInfo.width}×{morphedSizeInfo.height}
        </div>
      )}

      {/* Resize handles - only show when not dragging and clicked */}
      {!isDragging && isClicked && (
        <>
          <ResizeHandle position="right" onResize={onBlockResize} blockId={blockData.id} isBlockClicked={isClicked} />
          <ResizeHandle position="bottom" onResize={onBlockResize} blockId={blockData.id} isBlockClicked={isClicked} />
          <ResizeHandle position="bottom-right" onResize={onBlockResize} blockId={blockData.id} isBlockClicked={isClicked} />
          <ResizeHandle position="left" onResize={onBlockResize} blockId={blockData.id} isBlockClicked={isClicked} />
          <ResizeHandle position="top" onResize={onBlockResize} blockId={blockData.id} isBlockClicked={isClicked} />
          <ResizeHandle position="top-left" onResize={onBlockResize} blockId={blockData.id} isBlockClicked={isClicked} />
          <ResizeHandle position="top-right" onResize={onBlockResize} blockId={blockData.id} isBlockClicked={isClicked} />
          <ResizeHandle position="bottom-left" onResize={onBlockResize} blockId={blockData.id} isBlockClicked={isClicked} />
        </>
      )}

      {/* Mobile drag hint */}
      {isClicked && !isDragging && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
          <span className="sm:hidden">Long press & drag to move</span>
          <span className="hidden sm:inline">Click & drag to move</span>
        </div>
      )}

      {/* Visual feedback for touch interaction */}
      {isClicked && (
        <div className="absolute inset-0 bg-white bg-opacity-10 rounded-2xl pointer-events-none animate-pulse"></div>
      )}

      {/* Debug indicator - remove after testing */}
      {isDragging && (
        <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded pointer-events-none">
          DRAGGING
        </div>
      )}
    </div>
  );
};

export default PatchworkBlock;