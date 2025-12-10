"use client";

import { X, Download, ZoomIn, ZoomOut, RotateCw, FileText, Image as ImageIcon, File } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface DocumentPreviewOnlyProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize?: number;
}

export const DocumentPreviewOnly: React.FC<DocumentPreviewOnlyProps> = ({
  isOpen,
  onClose,
  fileName,
  fileType,
  fileUrl,
  fileSize,
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);

  // Only render on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && mounted) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
      setError(null);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, mounted]);

  useEffect(() => {
    if (isOpen && mounted) {
      setScale(1);
      setRotation(0);
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen, mounted]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    try {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download file');
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError('Failed to load image');
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = () => {
    return fileType?.startsWith('image/') ||
      fileName?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i);
  };

  const isPDF = () => {
    return fileType === 'application/pdf' || fileName?.endsWith('.pdf');
  };

  const getFileIcon = () => {
    if (isImage()) return <ImageIcon className="text-green-500" size={24} />;
    if (isPDF()) return <FileText className="text-red-500" size={24} />;
    return <File className="text-gray-500" size={24} />;
  };

  const getFileTypeName = () => {
    if (isImage()) return 'Image';
    if (isPDF()) return 'PDF Document';
    if (fileName?.match(/\.(doc|docx)$/i)) return 'Word Document';
    if (fileName?.match(/\.(xls|xlsx)$/i)) return 'Excel Spreadsheet';
    return 'Document';
  };

  // Don't render on server side
  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full h-full flex flex-col bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white truncate">
                {fileName}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span>{getFileTypeName()}</span>
                <span>•</span>
                <span>{formatFileSize(fileSize)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center mr-10 gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Download"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download</span>
            </button>

          </div>
        </div>        <div className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.25}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            <span className="text-gray-300 text-sm min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 3}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg"
              title="Reset Zoom"
            >
              100%
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRotate}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg"
              title="Rotate"
            >
              <RotateCw size={20} />
            </button>
            <span className="text-gray-300 text-sm">
              Rotation: {rotation}°
            </span>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-900 p-4">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="text-center p-8">
              <div className="text-red-400 mb-4">
                <FileText size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Unable to preview file</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download Instead
              </button>
            </div>
          )}

          {/* Image Preview */}
          {!error && isImage() && (
            <div className="relative">
              <img
                ref={imageRef}
                src={fileUrl}
                alt={fileName}
                className="max-w-full max-h-full transition-transform duration-200"
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          )}

          {/* PDF Preview */}
          {!error && isPDF() && (
            <div className="w-full h-full">
              <iframe
                ref={iframeRef}
                src={fileUrl}
                className="w-full h-full border-0"
                title={fileName}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setError('Failed to load PDF');
                }}
              />
            </div>
          )}

          {/* Unsupported File Type */}
          {!error && !isImage() && !isPDF() && (
            <div className="text-center p-8">
              <div className="text-gray-400 mb-4">
                <FileText size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">File Preview Not Available</h3>
              <p className="text-gray-400 mb-4">
                This file type ({fileType || 'unknown'}) cannot be previewed in the browser.
              </p>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download File
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 bg-gray-800 border-t border-gray-700 text-sm text-gray-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Scale: {Math.round(scale * 100)}%</span>
              <span>Rotation: {rotation}°</span>
            </div>
            <div>
              <span className="truncate max-w-[300px] inline-block">
                {fileName}
              </span>
            </div>
          </div>
        </div>

        {/* Close button overlay */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors z-20"
          title="Close (ESC)"
        >
          <X size={24} />
        </button>

        {/* Zoom controls overlay */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 bg-gray-800/80 backdrop-blur-sm rounded-lg p-2">
          <button
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-50"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg"
            title="Reset Zoom"
          >
            <span className="text-xs">100%</span>
          </button>
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.25}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-50"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
        </div>

        {/* Rotate control overlay */}
        <button
          onClick={handleRotate}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-300 hover:text-white hover:bg-gray-800/80 backdrop-blur-sm rounded-lg"
          title="Rotate 90°"
        >
          <RotateCw size={20} />
        </button>
      </div>
    </div>
  );
};