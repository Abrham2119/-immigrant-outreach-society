"use client";
import { useTranslation } from '@/components/providers/translation.provider';
import { Upload, File, X, Loader2, Maximize2, FileText, Image as ImageIcon, FileSpreadsheet } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useUploadClientFiles } from '@/application/hooks/useClientDocuments';
import { ClientFile } from '@/domain/entities/clientDoc';
import { DocumentPreviewOnly } from './DocumentPreviewModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ClientDocumentUploadProps {
  clientId: string;
  clientName: string;
  onClose: () => void;
}

// Type guard to check if it's a File
const isFile = (file: any): file is File => {
  return file && typeof file === 'object' && 'name' in file && 'size' in file && 'type' in file;
};

// Type guard to check if it's a ClientFile
const isClientFile = (file: any): file is ClientFile => {
  return file && typeof file === 'object' && 'fileName' in file && 'fileUrl' in file && 'fileType' in file;
};

export const ClientDocumentUpload: React.FC<ClientDocumentUploadProps> = ({
  clientId,
  clientName,
  onClose
}) => {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | ClientFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Removed uploadedFiles state since we don't want to show them after upload

  const uploadMutation = useUploadClientFiles();

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    setUploadError(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFilePreview = (file: File) => {
    setPreviewFile(file);
    // Create object URL for File object preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
  };
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error(t('pleaseSelectAtLeastOneFile', 'Please select at least one file'));
      setUploadError(t('pleaseSelectAtLeastOneFile', 'Please select at least one file'));
      return;
    }

    if (selectedFiles.length > 10) {
      toast.error(t('maximumFilesAllowedPerUpload', 'Maximum 10 files allowed per upload'));
      setUploadError(t('maximumFilesAllowedPerUpload', 'Maximum 10 files allowed per upload'));
      return;
    }

    // Check file sizes (max 10MB each)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      const errorMsg = t('filesMustBeLessThan10MB', 'Files must be less than 10MB:') + ' ' + oversizedFiles.map(f => f.name).join(', ');
      toast.error(errorMsg);
      setUploadError(errorMsg);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload files - we don't need to store the result
      await uploadMutation.mutateAsync({
        clientId,
        files: selectedFiles,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Reset to initial state (like first mount)
      setTimeout(() => {
        setSelectedFiles([]);
        setIsUploading(false);
        setUploadProgress(0);
        setUploadError(null);

        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Show success message
        toast.success(t('successfullyUploadedFilesForClient', 'Successfully uploaded files for ') + clientName);
        window.location.reload();
        onClose();
      }, 500);
    } catch (error) {
      setIsUploading(false);
      toast.error(t('uploadFailedPleaseTryAgain', 'Upload failed. Please try again.'));
      setUploadError(t('uploadFailedPleaseTryAgain', 'Upload failed. Please try again.'));
      console.error(t('uploadError', 'Upload error:'), error);
    }
  };


  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return t('zeroBytes', '0 Bytes');
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return <FileText className="text-red-500" size={20} />;
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) return <ImageIcon className="text-green-500" size={20} />;
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="text-blue-500" size={20} />;
    if (['xls', 'xlsx'].includes(ext || '')) return <FileSpreadsheet className="text-green-600" size={20} />;
    return <File className="text-gray-500" size={20} />;
  };

  const getFileType = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return t('pdfDocument', 'PDF Document');
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) return t('imageFile', 'Image');
    if (['doc', 'docx'].includes(ext || '')) return t('wordDocument', 'Word Document');
    if (['xls', 'xlsx'].includes(ext || '')) return t('excelSpreadsheet', 'Excel Spreadsheet');
    return t('documentFile', 'Document');
  };

  return (
    <>
      <ToastContainer />
      <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {t('uploadDocumentsForClient', 'Upload Documents for')} {clientName}
          </h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={16} />
            {t('selectFilesButton', 'Select Files')}
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.doc,.docx,.xls,.xlsx"
          className="hidden"
        />

        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{uploadError}</p>
          </div>
        )}

        {selectedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedFiles.length} {t('filesReadyToUpload', 'file(s) ready to upload')}
              </span>
              <button
                onClick={() => setSelectedFiles([])}
                disabled={isUploading}
                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {t('clearAllButton', 'Clear All')}
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 cursor-pointer group"
                  onClick={() => handleFilePreview(file)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {getFileIcon(file.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{getFileType(file.name)}</span>
                        <span>•</span>
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span className="text-blue-600 font-medium">{t('readyToUpload', 'Ready to upload')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilePreview(file);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title={t('previewFileTooltip', 'Preview file')}
                    >
                      <Maximize2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      disabled={isUploading}
                      className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50"
                      title={t('removeFileTooltip', 'Remove file')}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {t('uploadingProgress', 'Uploading...')} {uploadProgress}%
                </p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {t('uploadingButton', 'Uploading...')}
                </>
              ) : (
                <>
                  <Upload size={18} />
                  {t('uploadButton', 'Upload')} {selectedFiles.length} {t('filesCount', 'File(s)')}
                </>
              )}
            </button>
          </div>
        )}

        {selectedFiles.length === 0 && !isUploading && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <File className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">{t('noFilesSelected', 'No files selected')}</p>
            <p className="text-sm text-gray-500">
              {t('supportedFormats', 'Supported formats: PDF, Images (JPG, PNG, GIF, BMP, WEBP), Documents (DOC, DOCX, XLS, XLSX)')}
            </p>
            <p className="text-xs text-gray-400 mt-1">{t('maxFileLimit', 'Max 10 files, 10MB each')}</p>
          </div>
        )}
      </div>
      {/* Document Preview Modal */}
      {previewFile && (
        <DocumentPreviewOnly
          isOpen={!!previewFile}
          onClose={handleClosePreview}
          fileName={isFile(previewFile) ? previewFile.name : isClientFile(previewFile) ? previewFile.fileName : ''}
          fileType={isFile(previewFile) ? previewFile.type : isClientFile(previewFile) ? previewFile.fileType : ''}
          fileUrl={previewUrl}
          fileSize={isFile(previewFile) ? previewFile.size : isClientFile(previewFile) ? previewFile.size : 0}
        />
      )}
    </>
  );
};