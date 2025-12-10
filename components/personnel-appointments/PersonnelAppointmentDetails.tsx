"use client";
import React from "react";
import { AppointmentResponse } from '@/domain/entities/appointmentPersonnel';
import { FileText, Image as ImageIcon, Download, ExternalLink } from 'lucide-react';

interface PersonnelAppointmentDetailsProps {
  appointment: AppointmentResponse;
}

const statusColors = {
  booked: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  'no-show': "bg-orange-100 text-orange-800",
  arrived: "bg-purple-100 text-purple-800",
  with_personnel: "bg-indigo-100 text-indigo-800",
};

export const PersonnelAppointmentDetails: React.FC<PersonnelAppointmentDetailsProps> = ({ appointment }) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  if (!appointment) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-gray-600 text-center">
          Appointment not found.
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatFileDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="text-red-500" size={20} />;
    if (fileType.includes('image')) return <ImageIcon className="text-green-500" size={20} />;
    if (fileType.includes('document') || fileType.includes('word')) return <FileText className="text-blue-500" size={20} />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileText className="text-green-600" size={20} />;
    return <FileText className="text-gray-500" size={20} />;
  };

const getCleanedBaseUrl = () => {
  let baseUrl = apiBaseUrl.trim();  
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.slice(0, -4);
  }  
  return baseUrl.replace(/\/+$/, '');
};

const handleDownload = async (filePath: string, fileName: string) => {
  const cleanedBaseUrl = getCleanedBaseUrl();
  const fileUrl = filePath.startsWith('http') ? filePath : `${cleanedBaseUrl}${filePath}`;
  
  const urlWithTimestamp = `${fileUrl}${fileUrl.includes('?') ? '&' : '?'}_=${Date.now()}`;
  
  try {
    const response = await fetch(urlWithTimestamp);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
    
  } catch (error) {
    const link = document.createElement('a');
    link.href = urlWithTimestamp;
    link.download = fileName;
    link.target = '_blank';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  }
};
const handleView = (filePath: string) => {
  const cleanedBaseUrl = getCleanedBaseUrl();
  const fileUrl = filePath.startsWith('http') ? filePath : `${cleanedBaseUrl}${filePath}`;
  window.open(fileUrl, '_blank');
};



  return (
    <div className="h-full max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-100px)] overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 top-0 bg-white py-2 z-10">
          Appointment Details
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Client Information</h3>
            
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-gray-800 font-medium">
                {appointment.client.firstName} {appointment.client.lastName}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Contact Information</p>
              <p className="text-gray-800 font-medium break-all">{appointment.client.email}</p>
              <p className="text-gray-600 text-sm">+{appointment.client.mobile}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Demographics</p>
              <p className="text-gray-800 font-medium capitalize">{appointment.client.gender}</p>
              <p className="text-gray-600 text-sm">{appointment.client.nationality} • {appointment.client.immigrationStatus}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Language</p>
              <p className="text-gray-800 font-medium">{appointment.client.language}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Client Status</p>
              <span className={`px-2 py-1 rounded-full text-xs ${
                statusColors[appointment.client.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
              }`}>
                {appointment.client.status}
              </span>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Appointment Information</h3>
            
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="text-gray-800 font-medium">{formatDate(appointment.date)}</p>
              <p className="text-gray-600 text-sm">
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Appointment Status</p>
              <span className={`px-2 py-1 rounded-full text-xs ${
                statusColors[appointment.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
              }`}>
                {appointment.status}
              </span>
            </div>
            
            {appointment.remark && (
              <div>
                <p className="text-sm text-gray-600">Remarks</p>
                <p className="text-gray-800 font-medium italic">"{appointment.remark}"</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600">Services Requested</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {appointment.client.services.map((service, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Files Section */}
        {appointment.client.files && appointment.client.files.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Uploaded Documents ({appointment.client.files.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointment.client.files.map((file, index) => (
                <div
                  key={file._id || index}
                  className="border rounded-lg p-4 hover:border-blue-400 transition-colors bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getFileIcon(file.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 line-clamp-1 break-words">
                          {file.fileName}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {file.fileType}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-400 mt-1">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-xs">Uploaded: {formatFileDate(file.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
                    <button
                      onClick={() => handleView(file.fileUrl)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      title="View file"
                    >
                      <ExternalLink size={14} />
                      <span className="whitespace-nowrap">View</span>
                    </button>
                    <button
                      onClick={() => handleDownload(file.fileUrl, file.fileName)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                      title="Download file"
                    >
                      <Download size={14} />
                      <span className="whitespace-nowrap">Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="space-y-4 pb-6">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Additional Information</h3>
          
          {appointment.client.message && (
            <div>
              <p className="text-sm text-gray-600">Client Message</p>
              <p className="text-gray-800 font-medium italic break-words">"{appointment.client.message}"</p>
            </div>
          )}
          
          {appointment.client.statusReason && (
            <div>
              <p className="text-sm text-gray-600">Status Reason</p>
              <p className="text-gray-800 font-medium italic break-words">"{appointment.client.statusReason}"</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-600">Appointment Created</p>
            <p className="text-gray-800 font-medium">
              {new Date(appointment.createdAt).toLocaleDateString()} at{" "}
              {new Date(appointment.createdAt).toLocaleTimeString()}
            </p>
          </div>
          
          {appointment.updatedAt && appointment.updatedAt !== appointment.createdAt && (
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-gray-800 font-medium">
                {new Date(appointment.updatedAt).toLocaleDateString()} at{" "}
                {new Date(appointment.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};