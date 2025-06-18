// Simple App.js fix - just change your backend configuration
"use client"
import React from 'react';
import { DndProvider } from 'react-dnd';
import { MultiBackend } from 'react-dnd-multi-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import PatchworkGrid from './components/PatchworkGrid';

// Simple mobile-friendly backend config
const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: {
        type: 'mousedown',
      },
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: {
        enableMouseEvents: false,
        enableTouchEvents: true,
        delayTouchStart: 300,    // Increase this if drag doesn't start
        delayLongPress: 500,     // Increase this if long press doesn't work
        touchSlop: 8,            // Decrease this if drag is hard to start
        ignoreContextMenu: true,
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