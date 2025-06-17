"use client"
import React from 'react';
import { DndProvider } from 'react-dnd';
import { MultiBackend } from 'react-dnd-multi-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import PatchworkGrid from './components/PatchworkGrid';

// Improved backend configuration for better mobile support
const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: {
        // Use HTML5 backend for mouse events only
        type: 'mousedown',
      },
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: {
        enableMouseEvents: false, // Disable to avoid conflicts
        enableTouchEvents: true,
        // Reduce delay for better responsiveness
        delayTouchStart: 50,
        // Increase delay for long press to differentiate from quick taps
        delayLongPress: 200,
        // Increase touch slop for better drag detection
        touchSlop: 25, // <-- Increased from 16 to 25
        // Ignore context menu
        ignoreContextMenu: true,
        // Enable HTML5 drag image for better visual feedback
        enableHtmlDragAndDrop: false,
        // Scroll threshold
        scrollAngleRanges: [
          { start: 30, end: 150 },
          { start: 210, end: 330 }
        ],
      },
      preview: true,
      transition: {
        type: 'touchstart',
      },
    },
  ],
};

export default function Home() {
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <PatchworkGrid />
    </DndProvider>
  );
}