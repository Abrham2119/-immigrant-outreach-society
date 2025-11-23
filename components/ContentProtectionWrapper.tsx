// components/ContentProtectionWrapper.tsx
"use client";

import { useContentProtection } from '@/application/hooks/useContentProtection';
import React from 'react';

interface ContentProtectionWrapperProps {
  children: React.ReactNode;
  disablePrint?: boolean;
  disableScreenshot?: boolean;
  disableRightClick?: boolean;
  disableTextSelection?: boolean;
  showWarning?: boolean;
  enableAdvancedProtection?: boolean;
  className?: string;
}

export const ContentProtectionWrapper: React.FC<ContentProtectionWrapperProps> = ({
  children,
  disablePrint = true,
  disableScreenshot = true,
  disableRightClick = true,
  disableTextSelection = true,
  showWarning = true,
  enableAdvancedProtection = true,
  className = ''
}) => {
  useContentProtection({
    disablePrint,
    disableScreenshot,
    disableRightClick,
    disableTextSelection,
    showWarning,
    enableAdvancedProtection
  });

  return (
    <>
      <style jsx global>{`
        @media print {
          body, body * {
            visibility: hidden !important;
            display: none !important;
          }
          .no-print,
          .no-print * {
            display: none !important;
            visibility: hidden !important;
          }
        }
        
        @page {
          size: auto;
          margin: 0;
        }
        
        .content-protected {
          position: relative;
          background: white;
        }
        
        /* Prevent text selection */
        .content-protected {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          cursor: default;
        }
        
        /* Prevent image dragging */
        .content-protected img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }
        
        /* Disable text selection highlights */
        .content-protected ::selection {
          background: transparent;
        }
        .content-protected ::-moz-selection {
          background: transparent;
        }
        
        /* Protection overlay styles */
        .protection-shield {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: 
            radial-gradient(circle at 20% 20%, rgba(255,0,0,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0,0,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(0,255,0,0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          opacity: 0.03;
        }
      `}</style>
      
      {/* Additional protection shield */}
      {enableAdvancedProtection && <div className="protection-shield" />}
      
      <div className={`content-protected no-print ${className}`}>
        {children}
      </div>
    </>
  );
};