// application/hooks/useContentProtection.tsx
"use client";

import { useEffect, useRef } from 'react';

interface ProtectionOptions {
  disablePrint?: boolean;
  disableScreenshot?: boolean;
  disableRightClick?: boolean;
  disableTextSelection?: boolean;
  showWarning?: boolean;
  enableAdvancedProtection?: boolean;
}

export const useContentProtection = (options: ProtectionOptions = {}) => {
  const {
    disablePrint = true,
    disableScreenshot = true,
    disableRightClick = true,
    disableTextSelection = true,
    showWarning = true,
    enableAdvancedProtection = true
  } = options;

  // Fixed: Proper TypeScript type for setTimeout
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (disableTextSelection) {
      // Add no-select styles
      const style = document.createElement('style');
      style.id = 'content-protection-styles';
      style.innerHTML = `
        .content-protected {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        .content-protected * {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
        .protection-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          z-index: 9998;
          pointer-events: none;
        }
        .protection-watermark {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 0, 0, 0.02) 10px,
            rgba(255, 0, 0, 0.02) 20px
          );
          z-index: 9997;
          pointer-events: none;
          opacity: 0.5;
        }
      `;
      document.head.appendChild(style);

      return () => {
        const existingStyle = document.getElementById('content-protection-styles');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, [disableTextSelection]);

  useEffect(() => {
    if (enableAdvancedProtection) {
      // Create protection overlays
      const overlay = document.createElement('div');
      overlay.className = 'protection-overlay';
      
      const watermark = document.createElement('div');
      watermark.className = 'protection-watermark';
      
      document.body.appendChild(overlay);
      document.body.appendChild(watermark);

      return () => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        if (document.body.contains(watermark)) {
          document.body.removeChild(watermark);
        }
      };
    }
  }, [enableAdvancedProtection]);

  useEffect(() => {
    const preventUnauthorizedActions = (e: Event) => {
      const event = e as KeyboardEvent | MouseEvent;

      // Prevent right-click
      if (disableRightClick && event.type === 'contextmenu') {
        e.preventDefault();
        if (showWarning) {
          alert('Right-click is disabled on this protected page.');
        }
        return false;
      }

      // Prevent keyboard shortcuts for screenshots and printing
      if (event.type === 'keydown' && 'key' in event) {
        const keyboardEvent = event as KeyboardEvent;

        // Print Screen key (including Windows+Print Screen)
        if (disableScreenshot && (
          keyboardEvent.key === 'PrintScreen' || 
          keyboardEvent.keyCode === 44 ||
          (keyboardEvent.key === 'PrintScreen' && keyboardEvent.metaKey) || // Windows key
          (keyboardEvent.key === 'PrintScreen' && keyboardEvent.ctrlKey)
        )) {
          e.preventDefault();
          if (showWarning) {
            alert('Screenshots are not allowed on this protected page.');
          }
          // Trigger multiple prevention methods
          blurAllInputs();
          showTemporaryBlock();
          return false;
        }

        // Windows+Shift+S (Windows snipping tool)
        if (disableScreenshot && 
            keyboardEvent.key === 's' && 
            keyboardEvent.shiftKey && 
            (keyboardEvent.metaKey || keyboardEvent.ctrlKey)) {
          e.preventDefault();
          if (showWarning) {
            alert('Snipping tool is disabled on this protected page.');
          }
          return false;
        }

        // Alt+Print Screen (active window screenshot)
        if (disableScreenshot && 
            keyboardEvent.key === 'PrintScreen' && 
            keyboardEvent.altKey) {
          e.preventDefault();
          if (showWarning) {
            alert('Active window screenshots are disabled.');
          }
          return false;
        }

        // Ctrl+P (Print)
        if (disablePrint && keyboardEvent.ctrlKey && keyboardEvent.key === 'p') {
          e.preventDefault();
          if (showWarning) {
            alert('Printing is disabled for this protected page.');
          }
          return false;
        }

        // Developer tools shortcuts
        if (
          keyboardEvent.keyCode === 123 || // F12
          (keyboardEvent.ctrlKey && keyboardEvent.shiftKey && keyboardEvent.keyCode === 73) || // Ctrl+Shift+I
          (keyboardEvent.ctrlKey && keyboardEvent.shiftKey && keyboardEvent.keyCode === 74) || // Ctrl+Shift+J
          (keyboardEvent.ctrlKey && keyboardEvent.shiftKey && keyboardEvent.keyCode === 67) || // Ctrl+Shift+C
          (keyboardEvent.ctrlKey && keyboardEvent.shiftKey && keyboardEvent.keyCode === 85) // Ctrl+Shift+U (view source)
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    // Blur all input elements to prevent focus-based captures
    const blurAllInputs = () => {
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        (input as HTMLElement).blur();
      });
    };

    // Show temporary block overlay
    const showTemporaryBlock = () => {
      const blockOverlay = document.createElement('div');
      blockOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: red;
        font-weight: bold;
      `;
      blockOverlay.textContent = 'SCREENSHOT PROTECTION ACTIVE';
      document.body.appendChild(blockOverlay);

      setTimeout(() => {
        if (document.body.contains(blockOverlay)) {
          document.body.removeChild(blockOverlay);
        }
      }, 1000);
    };

    // Advanced detection for snipping tools
    const detectSnippingTools = () => {
      // Check for changes in window size that might indicate snipping tool
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;

      const checkForSnipping = () => {
        if (window.innerWidth !== originalWidth || window.innerHeight !== originalHeight) {
          // Window resized - might be snipping tool
          if (showWarning) {
            alert('Screen capture tools are not allowed on this protected page.');
          }
          // Restore original size
          window.resizeTo(originalWidth, originalHeight);
        }
      };

      // Fixed: Properly typed setTimeout
      detectionInterval.current = setInterval(checkForSnipping, 100);
    };

    // Prevent drag and drop of images
    const preventDragDrop = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    const events = ['contextmenu', 'keydown', 'keyup', 'keypress'];
    events.forEach(event => {
      document.addEventListener(event, preventUnauthorizedActions);
    });

    // Add drag/drop prevention
    document.addEventListener('dragstart', preventDragDrop);
    document.addEventListener('drop', preventDragDrop);
    document.addEventListener('dragover', preventDragDrop);

    // Start snipping tool detection
    if (enableAdvancedProtection && disableScreenshot) {
      detectSnippingTools();
    }

    // Additional protection: Monitor for visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page might be in screenshot preview
        if (showWarning) {
          alert('This page is protected and cannot be captured.');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup
      events.forEach(event => {
        document.removeEventListener(event, preventUnauthorizedActions);
      });
      
      document.removeEventListener('dragstart', preventDragDrop);
      document.removeEventListener('drop', preventDragDrop);
      document.removeEventListener('dragover', preventDragDrop);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Fixed: Proper cleanup of interval
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
        detectionInterval.current = null;
      }
    };
  }, [disablePrint, disableScreenshot, disableRightClick, showWarning, enableAdvancedProtection]);
};