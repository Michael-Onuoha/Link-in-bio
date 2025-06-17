import React, { useState } from 'react';
import { CELL_SIZE } from '../constants';

const ResizeHandle = ({ position, onResize, blockId, isBlockClicked }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    // Use pointer events for better touch support
    const startX = e.clientX || (e.touches && e.touches[0].clientX);
    const startY = e.clientY || (e.touches && e.touches[0].clientY);

    const handlePointerMove = (moveEvent) => {
      const currentX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const currentY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      
      const deltaX = Math.round((currentX - startX) / CELL_SIZE);
      const deltaY = Math.round((currentY - startY) / CELL_SIZE);
      onResize(blockId, position, deltaX, deltaY);
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      // Also remove touch events as fallback
      document.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('touchend', handlePointerUp);
    };

    // Use pointer events for better cross-platform support
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    
    // Fallback for older browsers
    document.addEventListener('touchmove', handlePointerMove, { passive: false });
    document.addEventListener('touchend', handlePointerUp);
  };

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'absolute',
      backgroundColor: 'rgba(180, 180, 180, 0.9)',
      borderRadius: '50%',
      width: '12px',
      height: '12px',
      opacity: isHovered || isResizing || isBlockClicked ? 1 : 0,
      transition: 'all 0.15s ease',
      zIndex: 1000,
      // Changed touch-action for resize handles
      touchAction: 'none',
    };

    switch (position) {
      case 'right':
        return {
          ...baseStyles,
          right: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'ew-resize',
        };
      case 'bottom':
        return {
          ...baseStyles,
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'ns-resize',
        };
      case 'bottom-right':
        return {
          ...baseStyles,
          bottom: '-5px',
          right: '-5px',
          cursor: 'nwse-resize',
        };
      case 'left':
        return {
          ...baseStyles,
          left: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '12px',
          height: '12px',
          cursor: 'ew-resize',
          borderRadius: '50%'
        };
      case 'top':
        return {
          ...baseStyles,
          top: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '12px',
          height: '12px',
          cursor: 'ns-resize',
          borderRadius: '50%'
        };
      case 'top-left':
        return {
          ...baseStyles,
          top: '-3px',
          left: '-3px',
          width: '12px',
          height: '12px',
          cursor: 'nw-resize',
          borderRadius: '50%',
        };
      case 'top-right':
        return {
          ...baseStyles,
          top: '-3px',
          right: '-3px',
          width: '12px',
          height: '12px',
          cursor: 'ne-resize',
          borderRadius: '50%',
        };
      case 'bottom-left':
        return {
          ...baseStyles,
          bottom: '-3px',
          left: '-3px',
          width: '12px',
          height: '12px',
          cursor: 'ne-resize',
          borderRadius: '50%',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <>
      <div
        style={getPositionStyles()}
        onPointerDown={handlePointerDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="resize-handle"
      />
      
      {/* Show dotted border when block is clicked, hovered, or resizing */}
      {(isBlockClicked || isHovered || isResizing) && (
        <div className="absolute inset-0 pointer-events-none"
          style={{
            border: '2px dashed #444',
            borderRadius: '6px',
            opacity: isResizing || isBlockClicked ? 0.8 : 0.5,
            transition: 'opacity 0.2s ease'
          }}
        />
      )}
    </>
  );
};

export default ResizeHandle;