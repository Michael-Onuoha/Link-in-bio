import React, { useState, useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { BLOCK_ITEM_TYPE, CELL_SIZE } from '../constants';
import ResizeHandle from './ResizeHandle';

const PatchworkBlock = ({ blockData, onBlockMove, onBlockResize, activeSectionInfo, morphedSizeInfo }) => {
  const blockRef = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: BLOCK_ITEM_TYPE,
    item: { id: blockData.id, originalPosition: { x: blockData.x, y: blockData.y } },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [isClicked, setIsClicked] = useState(false);
  // Removed dragStarted and touchStartTime states as they are no longer needed with this approach
  // const [dragStarted, setDragStarted] = useState(false);
  // const [touchStartTime, setTouchStartTime] = useState(null);

  const currentDisplaySize = morphedSizeInfo && isDragging ? morphedSizeInfo : { width: blockData.width, height: blockData.height };

  // Removed custom handleTouchStart and handleMouseDown
  // const handleTouchStart = (e) => {
  //   // Don't interfere with resize handles
  //   if (e.target.classList.contains('resize-handle')) {
  //     return;
  //   }
  //   setIsClicked(true);
  //   setDragStarted(false);
  //   setTouchStartTime(Date.now());
  //   // Let the touch backend handle the event
  //   e.stopPropagation();
  // };
  // const handleMouseDown = (e) => {
  //   // Don't interfere with resize handles
  //   if (e.target.classList.contains('resize-handle')) {
  //     return;
  //   }
  //   setIsClicked(true);
  //   setDragStarted(false);
  //   e.stopPropagation();
  // };
  // Removed handleTouchEnd
  // const handleTouchEnd = (e) => {
  //   if (!isDragging && Date.now() - touchStartTime < 200) {
  //     // Quick tap - reset state
  //     setTimeout(() => {
  //       if (!isDragging) {
  //         setIsClicked(false);
  //       }
  //     }, 100);
  //   }
  // };
  // Removed drag start detection effect
  // useEffect(() => {
  //   if (isDragging && !dragStarted) {
  //     setDragStarted(true);
  //   } else if (!isDragging && dragStarted) {
  //     setDragStarted(false);
  //     setIsClicked(false);
  //   }
  // }, [isDragging, dragStarted]);

  // Add back the simple click handler for selection
  const handleBlockClick = (e) => {
    // Only set clicked if the target is the block itself, not a resize handle
    if (blockRef.current && blockRef.current === e.target) {
       setIsClicked(true);
    }
  };

  // Add back a simple touchstart handler without stopping propagation
  const handleBlockTouchStart = (e) => {
     // Allow event to propagate to react-dnd-touch-backend
     // e.stopPropagation() is intentionally omitted here
     // e.preventDefault() is handled by touch-action: none and the backend
  };

  // Removed the useEffect that updated isClicked based on isDragging
  // useEffect(() => {
  //   if (isDragging) {
  //     setIsClicked(true); // Block is considered "clicked" or active when dragging starts
  //   } else {
  //     // When dragging stops, we might want to keep it clicked until an outside click occurs
  //     // Or reset immediately if it was just a short tap that didn't drag
  //     // For now, let's rely on the document click listener to deselect
  //     // setIsClicked(false); // This might be too aggressive, let document listener handle deselect
  //   }
  // }, [isDragging]);


  useEffect(() => {
    const handleDocumentTouch = (e) => {
      if (blockRef.current && !blockRef.current.contains(e.target)) {
        setIsClicked(false);
      }
    };

    const handleDocumentMouse = (e) => {
      if (blockRef.current && !blockRef.current.contains(e.target)) {
        setIsClicked(false);
      }
    };

    // Use passive listeners for better performance
    document.addEventListener('mousedown', handleDocumentMouse);
    // Keep touchstart listener for outside clicks, but make it passive
    document.addEventListener('touchstart', handleDocumentTouch, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouse);
      document.removeEventListener('touchstart', handleDocumentTouch);
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
      // Removed onMouseDown and onTouchStart/End
      // onMouseDown={handleMouseDown}
      // onTouchStart={handleTouchStart}
      // onTouchEnd={handleTouchEnd}
      // Add back onClick for selection
      onClick={handleBlockClick}
      // Keep onTouchStart without stopPropagation
      onTouchStart={handleBlockTouchStart}
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
        // Critical mobile touch settings
        touchAction: 'none', // Prevent scrolling during drag
        WebkitTapHighlightColor: 'transparent',
        // Prevent text selection during drag
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
        // Ensure the element is above other content
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

      {/* Mobile drag hint - show on touch devices */}
      {isClicked && !isDragging && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap animate-pulse">
          <span className="sm:hidden">Long press & drag to move</span>
          <span className="hidden sm:inline">Click & drag to move</span>
        </div>
      )}

      {/* Visual feedback for touch interaction */}
      {isClicked && (
        <div className="absolute inset-0 bg-white bg-opacity-10 rounded-2xl pointer-events-none animate-pulse"></div>
      )}
    </div>
  );
};

export default PatchworkBlock;