// App.js - Complete with mobile DnD backend configuration
import React from 'react';
import { DndProvider } from 'react-dnd';
import { MultiBackend } from 'react-dnd-multi-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

// Your other imports...

// Mobile-optimized backend configuration
const mobileBackendConfig = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: {
        dragDropManager: undefined,
        monitor: undefined,
        registry: undefined,
      },
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: {
        enableMouseEvents: true,
        delayTouchStart: 100, // Short delay for better responsiveness
        delayMouseStart: 0,
        touchSlop: 5, // Small distance threshold
        ignoreContextMenu: true,
        enableHoverOutsideTarget: true,
        enableKeyboardEvents: true,
      },
      preview: true,
      transition: {
        touchstart: (event) => {
          return event.touches != null;
        },
      },
    },
  ],
};

function App() {
  return (
    <DndProvider backend={MultiBackend} options={mobileBackendConfig}>
      {/* Your app components here */}
    </DndProvider>
  );
}

export default App;