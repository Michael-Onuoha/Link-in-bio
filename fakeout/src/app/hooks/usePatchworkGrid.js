import { useState, useRef, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import {
  GRID_COLS,
  GRID_ROWS,
  PATCHWORK_SECTIONS,
  BLOCK_ITEM_TYPE,
  CELL_SIZE
} from '../constants'; // Import from constants

const usePatchworkGrid = () => {
  const [gameBlocks, setGameBlocks] = useState([
    { id: 1, x: 0, y: 0, width: 3, height: 4, color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { id: 2, x: 3, y: 0, width: 3, height: 3, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { id: 3, x: 0, y: 4, width: 3, height: 4, color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { id: 4, x: 3, y: 3, width: 3, height: 3, color: 'bg-gradient-to-br from-orange-400 to-orange-600' },
    { id: 5, x: 0, y: 8, width: 2, height: 3, color: 'bg-gradient-to-br from-pink-400 to-pink-600' },
    { id: 6, x: 2, y: 8, width: 4, height: 2, color: 'bg-gradient-to-br from-cyan-400 to-cyan-600' },
  ]);

  const [dragInformation, setDragInformation] = useState({
    currentSection: null,
    morphedSize: null,
    previewPosition: null,
  });

  const gridRef = useRef(null);

  // Find which section a position belongs to
  const getSectionForPosition = useCallback((posX, posY) => {
    return PATCHWORK_SECTIONS.find(sectionItem =>
      posX >= sectionItem.x && posX < sectionItem.x + sectionItem.width &&
      posY >= sectionItem.y && posY < sectionItem.y + sectionItem.height
    ) || PATCHWORK_SECTIONS[0]; // fallback to first section
  }, []);

  // Check if a position is valid and not overlapping
  const checkValidPosition = useCallback((checkX, checkY, checkWidth, checkHeight, excludeBlockId = null) => {
    if (checkX < 0 || checkY < 0 || checkX + checkWidth > GRID_COLS || checkY + checkHeight > GRID_ROWS) {
      return false;
    }

    return !gameBlocks.some(blockItem => {
      if (blockItem.id === excludeBlockId) return false;
      return !(checkX >= blockItem.x + blockItem.width || checkX + checkWidth <= blockItem.x ||
               checkY >= blockItem.y + blockItem.height || checkY + checkHeight <= blockItem.y);
    });
  }, [gameBlocks]);

  // Find blocks that would be affected by a resize operation
  const getAffectedBlocks = useCallback((resizingBlockId, newX, newY, newWidth, newHeight) => {
    const resizingBlock = gameBlocks.find(b => b.id === resizingBlockId);
    if (!resizingBlock) return [];

    return gameBlocks.filter(block => {
      if (block.id === resizingBlockId) return false;

      // Check if blocks overlap with the new size
      return !(newX >= block.x + block.width || newX + newWidth <= block.x ||
               newY >= block.y + block.height || newY + newHeight <= block.y);
    });
  }, [gameBlocks]);

  // Push or resize affected blocks intelligently
  const resolveBlockConflicts = useCallback((resizingBlockId, newX, newY, newWidth, newHeight) => {
    const affectedBlocks = getAffectedBlocks(resizingBlockId, newX, newY, newWidth, newHeight);
    const resizingBlock = gameBlocks.find(b => b.id === resizingBlockId);
    if (!resizingBlock) return gameBlocks;

    let updatedBlocks = [...gameBlocks];

    // Update the resizing block first
    updatedBlocks = updatedBlocks.map(block =>
      block.id === resizingBlockId
        ? { ...block, x: newX, y: newY, width: newWidth, height: newHeight }
        : block
    );

    // Handle each affected block
    affectedBlocks.forEach(affectedBlock => {
      const resizedBlock = updatedBlocks.find(b => b.id === resizingBlockId);

      // Calculate the overlap area
      const overlapLeft = Math.max(resizedBlock.x, affectedBlock.x);
      const overlapRight = Math.min(resizedBlock.x + resizedBlock.width, affectedBlock.x + affectedBlock.width);
      const overlapTop = Math.max(resizedBlock.y, affectedBlock.y);
      const overlapBottom = Math.min(resizedBlock.y + resizedBlock.height, affectedBlock.y + affectedBlock.height);

      const overlapWidth = overlapRight - overlapLeft;
      const overlapHeight = overlapBottom - overlapTop;

      // Determine the best direction to push/resize
      const pushRight = resizedBlock.x + resizedBlock.width - affectedBlock.x;
      const pushLeft = affectedBlock.x + affectedBlock.width - resizedBlock.x;
      const pushDown = resizedBlock.y + resizedBlock.height - affectedBlock.y;
      const pushUp = affectedBlock.y + affectedBlock.height - resizedBlock.y;

      const minPush = Math.min(pushRight, pushLeft, pushDown, pushUp);

      let newBlockProps = { ...affectedBlock };

      if (minPush === pushRight && overlapWidth > 0) {
        // Push block to the right or shrink it
        const newLeft = resizedBlock.x + resizedBlock.width;
        const availableWidth = (affectedBlock.x + affectedBlock.width) - newLeft;

        if (availableWidth >= 1 && newLeft + availableWidth <= GRID_COLS) {
          newBlockProps = {
            ...newBlockProps,
            x: newLeft,
            width: Math.max(1, availableWidth)
          };
        } else {
          // Try to shrink from the left
          const newWidth = Math.max(1, resizedBlock.x - affectedBlock.x);
          if (newWidth > 0) {
            newBlockProps = {
              ...newBlockProps,
              width: newWidth
            };
          }
        }
      } else if (minPush === pushLeft && overlapWidth > 0) {
        // Push block to the left or shrink it
        const newRight = resizedBlock.x;
        const newWidth = newRight - affectedBlock.x;

        if (newWidth >= 1) {
          newBlockProps = {
            ...newBlockProps,
            width: Math.max(1, newWidth)
          };
        }
      } else if (minPush === pushDown && overlapHeight > 0) {
        // Push block down or shrink it
        const newTop = resizedBlock.y + resizedBlock.height;
        const availableHeight = (affectedBlock.y + affectedBlock.height) - newTop;

        if (availableHeight >= 1 && newTop + availableHeight <= GRID_ROWS) {
          newBlockProps = {
            ...newBlockProps,
            y: newTop,
            height: Math.max(1, availableHeight)
          };
        } else {
          // Try to shrink from the top
          const newHeight = Math.max(1, resizedBlock.y - affectedBlock.y);
          if (newHeight > 0) {
            newBlockProps = {
              ...newBlockProps,
              height: newHeight
            };
          }
        }
      } else if (minPush === pushUp && overlapHeight > 0) {
        // Push block up or shrink it
        const newBottom = resizedBlock.y;
        const newHeight = newBottom - affectedBlock.y;

        if (newHeight >= 1) {
          newBlockProps = {
            ...newBlockProps,
            height: Math.max(1, newHeight)
          };
        }
      }

      // Update the affected block
      updatedBlocks = updatedBlocks.map(block =>
        block.id === affectedBlock.id ? newBlockProps : block
      );
    });

    return updatedBlocks;
  }, [gameBlocks, getAffectedBlocks]);

  // Handle block resizing
  const handleBlockResize = useCallback((blockId, handlePosition, deltaX, deltaY) => {
    const block = gameBlocks.find(b => b.id === blockId);
    if (!block) return;

    let newX = block.x;
    let newY = block.y;
    let newWidth = block.width;
    let newHeight = block.height;

    // Calculate new dimensions based on handle position
    switch (handlePosition) {
      case 'right':
        newWidth = Math.max(1, block.width + deltaX);
        break;
      case 'bottom':
        newHeight = Math.max(1, block.height + deltaY);
        break;
      case 'bottom-right':
        newWidth = Math.max(1, block.width + deltaX);
        newHeight = Math.max(1, block.height + deltaY);
        break;
      case 'left':
        newWidth = Math.max(1, block.width - deltaX);
        newX = block.x + (block.width - newWidth);
        break;
      case 'top':
        newHeight = Math.max(1, block.height - deltaY);
        newY = block.y + (block.height - newHeight);
        break;
      case 'top-left':
        newWidth = Math.max(1, block.width - deltaX);
        newHeight = Math.max(1, block.height - deltaY);
        newX = block.x + (block.width - newWidth);
        newY = block.y + (block.height - newHeight);
        break;
      case 'top-right':
        newWidth = Math.max(1, block.width + deltaX);
        newHeight = Math.max(1, block.height - deltaY);
        newY = block.y + (block.height - newHeight);
        break;
      case 'bottom-left':
        newWidth = Math.max(1, block.width - deltaX);
        newHeight = Math.max(1, block.height + deltaY);
        newX = block.x + (block.width - newWidth);
        break;
    }

    // Ensure block stays within grid bounds
    newX = Math.max(0, Math.min(newX, GRID_COLS - newWidth));
    newY = Math.max(0, Math.min(newY, GRID_ROWS - newHeight));
    newWidth = Math.min(newWidth, GRID_COLS - newX);
    newHeight = Math.min(newHeight, GRID_ROWS - newY);

    // Resolve conflicts with other blocks
    const resolvedBlocks = resolveBlockConflicts(blockId, newX, newY, newWidth, newHeight);
    setGameBlocks(resolvedBlocks);
  }, [gameBlocks, resolveBlockConflicts]);


  // Find the optimal position for a block in a specific section
  const findOptimalPosition = useCallback((targetPosX, targetPosY, requiredWidth, requiredHeight, excludeBlockId = null) => {
    const targetSection = getSectionForPosition(targetPosX, targetPosY);
    const constrainedX = Math.max(targetSection.x, Math.min(Math.round(targetPosX), targetSection.x + targetSection.width - requiredWidth));
    const constrainedY = Math.max(targetSection.y, Math.min(Math.round(targetPosY), targetSection.y + targetSection.height - requiredHeight));

    // Try the exact position first
    if (checkValidPosition(constrainedX, constrainedY, requiredWidth, requiredHeight, excludeBlockId)) {
      return { x: constrainedX, y: constrainedY };
    }

    // Try within the current section first
    for (let searchRadius = 1; searchRadius <= 5; searchRadius++) {
      const candidatePositions = [];

      for (let deltaY = -searchRadius; deltaY <= searchRadius; deltaY++) {
        for (let deltaX = -searchRadius; deltaX <= searchRadius; deltaX++) {
          if (Math.abs(deltaX) === searchRadius || Math.abs(deltaY) === searchRadius) {
            const candidateX = Math.max(targetSection.x, Math.min(constrainedX + deltaX, targetSection.x + targetSection.width - requiredWidth));
            const candidateY = Math.max(targetSection.y, Math.min(constrainedY + deltaY, targetSection.y + targetSection.height - requiredHeight));
            candidatePositions.push({ x: candidateX, y: candidateY });
          }
        }
      }

      candidatePositions.sort((posA, posB) => {
        const distanceA = Math.abs(posA.x - constrainedX) + Math.abs(posA.y - constrainedY);
        const distanceB = Math.abs(posB.x - constrainedX) + Math.abs(posB.y - constrainedY);
        return distanceA - distanceB;
      });

      for (const candidatePos of candidatePositions) {
        if (checkValidPosition(candidatePos.x, candidatePos.y, requiredWidth, requiredHeight, excludeBlockId)) {
          return candidatePos;
        }
      }
    }

    // If no space in current section, try other sections
    for (const alternativeSection of PATCHWORK_SECTIONS) {
      if (alternativeSection.id === targetSection.id) continue;

      const altX = Math.max(alternativeSection.x, Math.min(targetPosX, alternativeSection.x + alternativeSection.width - requiredWidth));
      const altY = Math.max(alternativeSection.y, Math.min(targetPosY, alternativeSection.y + alternativeSection.height - requiredHeight));

      if (checkValidPosition(altX, altY, requiredWidth, requiredHeight, excludeBlockId)) {
        return { x: altX, y: altY };
      }
    }

    // Fallback: return the constrained position even if invalid
    return { x: constrainedX, y: constrainedY };
  }, [checkValidPosition, getSectionForPosition]);

  // Unified coordinate calculation function
  const getGridCoordinatesFromMouse = useCallback((clientOffset) => {
    if (!clientOffset || !gridRef.current) return { x: 0, y: 0 };

    const containerRect = gridRef.current.getBoundingClientRect();
    const x = Math.floor((clientOffset.x - containerRect.left) / CELL_SIZE);
    const y = Math.floor((clientOffset.y - containerRect.top) / CELL_SIZE);

    return { x: Math.max(0, Math.min(x, GRID_COLS - 1)), y: Math.max(0, Math.min(y, GRID_ROWS - 1)) };
  }, []);

  const handleBlockMovement = useCallback((draggedItem, dropPositionX, dropPositionY) => {
    const movingBlock = gameBlocks.find(blockItem => blockItem.id === draggedItem.id);
    if (!movingBlock) return;

    const destinationSection = getSectionForPosition(dropPositionX, dropPositionY);
    const newMorphedSize = destinationSection.blockSize;
    const optimalPosition = findOptimalPosition(dropPositionX, dropPositionY, newMorphedSize.width, newMorphedSize.height, draggedItem.id);

    setGameBlocks(previousBlocks =>
      previousBlocks.map(blockItem =>
        blockItem.id === draggedItem.id
          ? {
              ...blockItem,
              x: optimalPosition.x,
              y: optimalPosition.y,
              width: newMorphedSize.width,
              height: newMorphedSize.height
            }
          : blockItem
      )
    );

    // Clear drag info after successful drop
    setDragInformation({
      currentSection: null,
      morphedSize: null,
      previewPosition: null,
    });
  }, [gameBlocks, getSectionForPosition, findOptimalPosition]);

  const handleDragHoverEvent = useCallback((draggedItem, monitor) => {
    const offset = monitor.getClientOffset();
    if (!offset) return;

    const { x, y } = getGridCoordinatesFromMouse(offset);

    const section = getSectionForPosition(x, y);
    const morphedSize = section.blockSize;
    const optimalPos = findOptimalPosition(x, y, morphedSize.width, morphedSize.height, draggedItem.id);

    setDragInformation({
      currentSection: section,
      morphedSize: morphedSize,
      previewPosition: optimalPos,
    });
  }, [getSectionForPosition, findOptimalPosition, getGridCoordinatesFromMouse]);

  // Single drop handler that uses the same coordinate calculation
  const [{ isGridHovered }, mainGridDropRef] = useDrop({
    accept: BLOCK_ITEM_TYPE,
    hover: (item, monitor) => handleDragHoverEvent(item, monitor),
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      // Use the same coordinate calculation as hover
      const { x, y } = getGridCoordinatesFromMouse(offset);
      handleBlockMovement(item, x, y);
    },
    collect: (monitor) => ({
      isGridHovered: monitor.isOver(),
    }),
  });

  return {
    gridRef,
    gameBlocks,
    dragInformation,
    handleBlockResize,
    mainGridDropRef,
    isGridHovered,
    GRID_COLS, // Export constants needed for rendering
    GRID_ROWS,
    CELL_SIZE,
    PATCHWORK_SECTIONS, // Export sections for rendering backgrounds
  };
};

export default usePatchworkGrid;