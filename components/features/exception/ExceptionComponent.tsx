"use client";
import { useExceptions, useUpdateExceptionStatus } from '@/application/hooks/useExceptionManagement';
import { EXCEPTION_STATUS, EXCEPTION_TYPES, statusOptions, typeOptions } from '@/domain/constants/exception.constants';
import { Calendar, Clock, User, FileText, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Pagination } from '@/components/client/Pagination';
import { Exception } from '@/domain/entities/assesments/exception';
import ModalComponent from '@/components/ui/modal/Modal';

interface ExceptionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    exception: Exception | null;
}

const ExceptionDetailsModal = ({ isOpen, onClose, exception }: ExceptionDetailsModalProps) => {
    if (!exception) return null;

    const exceptionType = EXCEPTION_TYPES[exception.type as keyof typeof EXCEPTION_TYPES];
    const exceptionStatus = EXCEPTION_STATUS[exception.status as keyof typeof EXCEPTION_STATUS];

    return (
        <ModalComponent isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col h-full w-full max-h-[90vh] sm:max-h-[85vh]">
                <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-xl sm:text-2xl font-bold text-center">Exception Details</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="space-y-6">
                        <div className="border-b pb-4">
                            <h3 className="font-semibold text-base sm:text-lg mb-3 text-blue-600 flex items-center gap-2">
                                <User size={20} />
                                Personnel Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <strong className="text-gray-700 text-sm sm:text-base">Name:</strong>
                                    <p className="mt-1 text-sm sm:text-base">
                                        {exception.personnel.firstName} {exception.personnel.lastName}
                                    </p>
                                </div>
                                <div>
                                    <strong className="text-gray-700 text-sm sm:text-base">Email:</strong>
                                    <p className="mt-1 text-sm sm:text-base">{exception.personnel.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-b pb-4">
                            <h3 className="font-semibold text-base sm:text-lg mb-3 text-green-600 flex items-center gap-2">
                                <Calendar size={20} />
                                Exemption Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <strong className="text-gray-700 text-sm sm:text-base">Date:</strong>
                                    <p className="mt-1 text-sm sm:text-base">
                                        {new Date(exception.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <strong className="text-gray-700 text-sm sm:text-base">Type:</strong>
                                    <p className="mt-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${exceptionType?.color || 'bg-gray-100 text-gray-800'}`}>
                                            {exceptionType?.label || exception.type}
                                        </span>
                                    </p>
                                </div>
                                {(exception.startTime || exception.endTime) && (
                                    <>
                                        <div>
                                            <strong className="text-gray-700 text-sm sm:text-base">Start Time:</strong>
                                            <p className="mt-1 text-sm sm:text-base">{exception.startTime || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <strong className="text-gray-700 text-sm sm:text-base">End Time:</strong>
                                            <p className="mt-1 text-sm sm:text-base">{exception.endTime || 'N/A'}</p>
                                        </div>
                                    </>
                                )}
                                <div className="sm:col-span-2">
                                    <strong className="text-gray-700 text-sm sm:text-base">Reason:</strong>
                                    <p className="mt-1 text-sm sm:text-base">{exception.reason}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pb-4">
                            <h3 className="font-semibold text-base sm:text-lg mb-3 text-purple-600 flex items-center gap-2">
                                <FileText size={20} />
                                Status Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <strong className="text-gray-700 text-sm sm:text-base">Status:</strong>
                                    <p className="mt-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${exceptionStatus?.color || 'bg-gray-100 text-gray-800'}`}>
                                            {exceptionStatus?.label || exception.status}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <strong className="text-gray-700 text-sm sm:text-base">Created:</strong>
                                    <p className="mt-1 text-sm sm:text-base">
                                        {new Date(exception.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {exception.adminComment && (
                                    <div className="sm:col-span-2">
                                        <strong className="text-gray-700 text-sm sm:text-base">Admin Comment:</strong>
                                        <p className="mt-1 text-sm sm:text-base">{exception.adminComment}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalComponent>
    );
};

interface StatusUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    exception: Exception | null;
    onStatusUpdate: (exceptionId: string, status: 'approved' | 'rejected', comment: string) => void;
    isLoading: boolean;
    exemptionValue: 'approved' | 'rejected'
}

const StatusUpdateModal = ({
    isOpen,
    onClose,
    exception,
    onStatusUpdate,
    isLoading,
    exemptionValue
}: StatusUpdateModalProps) => {

    console.log(exemptionValue)
    const [status, setStatus] = useState<'approved' | 'rejected'>(exemptionValue);
    const [comment, setComment] = useState('');

    useEffect(() => {
        setStatus(exemptionValue);
    }, [exemptionValue]);
    const handleSubmit = () => {
        if (!exception) return;
        onStatusUpdate(exception._id, status, comment);
    };
    const handleClose = () => {
        setComment('');
        setStatus(exemptionValue);
        onClose();
    };

    return (
        <ModalComponent isOpen={isOpen} onClose={handleClose}>
            <div className="p-4 sm:p-6 w-full">
                <h2 className="text-xl sm:text-2xl w-full font-bold text-center mb-6">
                    Are you sure to change the exemption status?
                </h2>

                {exception && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium">
                                {exception.personnel.firstName} {exception.personnel.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                                {new Date(exception.date).toLocaleDateString()} • {EXCEPTION_TYPES[exception.type as keyof typeof EXCEPTION_TYPES]?.label}
                            </p>
                            <p className="text-sm mt-2">{exception.reason}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'approved' | 'rejected')}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="approved">Approve</option>
                                <option value="rejected">Reject</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Comment {status === 'rejected' && '(Required)'}
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={status === 'rejected' ? 'Please provide a reason for rejection...' : 'Optional comment...'}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                required={status === 'rejected'}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleClose}
                                disabled={isLoading}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading || (status === 'rejected' && !comment.trim())}
                                className={`flex-1 py-2 px-4 rounded-lg text-white transition-colors disabled:opacity-50 ${status === 'approved'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {isLoading ? 'Updating...' : status === 'approved' ? 'Approve' : 'Reject'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ModalComponent>
    );
};

export default function ExceptionComponent() {
    const [search, setSearch] = useState<string>("");
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [status, setStatus] = useState<string>("all");
    const [type, setType] = useState<string>("all");
    const [personnelId, setPersonnelId] = useState<string>("");
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedException, setSelectedException] = useState<Exception | null>(null);
    const [exemptionValue, setExemptionValue] = useState<'approved' | 'rejected'>("approved")

    const { data, isLoading, error, refetch } = useExceptions(pageNum, pageSize, search, status, type, personnelId);
    const updateExceptionStatusMutation = useUpdateExceptionStatus();

    useEffect(() => {
        console.log('Exception Data:', data);
        console.log('Loading:', isLoading);
        console.log('Error:', error);
    }, [data, isLoading, error]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPageNum(1);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setPageNum(1);
    };

    const handleTypeChange = (value: string) => {
        setType(value);
        setPageNum(1);
    };

    const handlePagination = (page: number) => {
        setPageNum(page);
    };

    const openDetailsModal = (exception: Exception) => {
        setSelectedException(exception);
        setIsDetailsModalOpen(true);
    };

    const openStatusModal = (exception: Exception, value: | 'approved' | 'rejected') => {
        setSelectedException(exception);
        setExemptionValue(value)
        setIsStatusModalOpen(true);
    };

    const closeModals = () => {
        setIsDetailsModalOpen(false);
        setIsStatusModalOpen(false);
        setSelectedException(null);
    };

    const handleStatusUpdate = (exceptionId: string, newStatus: 'approved' | 'rejected', comment: string) => {
        updateExceptionStatusMutation.mutate(
            {
                exceptionId,
                statusData: {
                    status: newStatus,
                    ...(comment && { adminComment: comment })
                }
            },
            {
                onSuccess: () => {
                    toast.success(`Exemption ${newStatus} successfully!`);
                    closeModals();
                    refetch();
                },
                onError: (error: Error) => {
                    const axiosError = error as any;
                    const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error occurred';
                    toast.error(`Error updating status: ${errorMessage}`);
                }
            }
        );
    };

    // Format time display
    const formatTimeDisplay = (exception: Exception) => {
        if (!exception.startTime && !exception.endTime) return "-";
        return `${exception.startTime || 'N/A'} - ${exception.endTime || 'N/A'}`;
    };

    // Safe type access
    const getExceptionType = (exceptionType: string) => {
        return EXCEPTION_TYPES[exceptionType as keyof typeof EXCEPTION_TYPES] || { label: exceptionType, color: 'bg-gray-100 text-gray-800' };
    };

    const getExceptionStatus = (exceptionStatus: string) => {
        return EXCEPTION_STATUS[exceptionStatus as keyof typeof EXCEPTION_STATUS] || { label: exceptionStatus, color: 'bg-gray-100 text-gray-800' };
    };

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
                    <div className="text-center py-8 text-red-600">
                        Error loading exceptions: {error.message}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
                {/* Debug Info - Remove in production */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Exemption Requests</h1>
                    <p className="text-gray-600">Manage and review exemption requests from personnel</p>
                </div>

                {/* Header Actions */}
                <div className="flex lg:flex-row gap-4 flex-col justify-start md:justify-between mb-3">
                    <div className="flex border-[#000000]/50 border items-center rounded-[10px] md:w-[531px] h-[34px]">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search exceptions..."
                            className="outline-none placeholder:text-[16px] px-2 w-full"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[16px] font-medium text-[#000000]/50">
                                Type
                            </span>
                            <select
                                value={type}
                                onChange={(e) => handleTypeChange(e.target.value)}
                                className="border border-[#000000]/50 rounded-[10px] px-3 py-1 outline-none"
                            >
                                {typeOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[16px] font-medium text-[#000000]/50">
                                Status
                            </span>
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="border border-[#000000]/50 rounded-[10px] px-3 py-1 outline-none"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto border border-[#71717180]/50 min-h-[60vh] text-[#555555]">
                    <table className="w-full text-sm min-w-[800px]">
                        <thead>
                            <tr className="bg-white border-b-[#00000080]/50 border-b">
                                <th className="text-center py-2 px-4 text-lg font-medium whitespace-nowrap">
                                    Personnel
                                </th>
                                <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                                    Date
                                </th>
                                <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                                    Type
                                </th>
                                <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                                    Time
                                </th>
                                <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                                    Reason
                                </th>
                                <th className="text-center px-4 py-2 text-lg font-medium">
                                    Status
                                </th>
                                <th className="text-center px-4 py-2 text-lg font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="w-full min-h-[60vh] flex items-center justify-center text-center">
                                            Loading exceptions...
                                        </div>
                                    </td>
                                </tr>
                            ) : data?.exceptions?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">
                                        No exceptions found.
                                    </td>
                                </tr>
                            ) : (
                                data?.exceptions?.map((exception, index) => {
                                    const exceptionType = getExceptionType(exception.type);
                                    const exceptionStatus = getExceptionStatus(exception.status);

                                    return (
                                        <tr
                                            key={exception._id}
                                            className={`${index % 2 === 0 ? "bg-white" : "bg-[#F7F7F7]"}`}
                                        >
                                            <td className="py-3 pl-3 whitespace-nowrap text-[14px] font-medium text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-semibold">
                                                        {exception.personnel.firstName} {exception.personnel.lastName}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {exception.personnel.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                                                {new Date(exception.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${exceptionType.color}`}>
                                                    {exceptionType.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Clock size={14} />
                                                    {formatTimeDisplay(exception)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium max-w-[200px] truncate">
                                                {exception.reason}
                                            </td>
                                            <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${exceptionStatus.color}`}>
                                                    {exceptionStatus.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 flex gap-2 items-center justify-center text-center font-medium">
                                                <button
                                                    onClick={() => openDetailsModal(exception)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                                                    title="View Details"
                                                >
                                                    <FileText size={16} />
                                                </button>

                                                {exception.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => openStatusModal(exception, "approved")}
                                                            className="text-green-600 hover:text-green-800 transition-colors p-1 rounded hover:bg-green-50"
                                                            title="Approve Exception"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => openStatusModal(exception, "rejected")}
                                                            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                                                            title="Reject Exception"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {data && data.pages > 1 && (
                    <Pagination
                        pageNum={pageNum}
                        totalPages={data.pages}
                        onPageChange={handlePagination}
                    />
                )}
            </div>

            {/* Modals */}
            <ExceptionDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={closeModals}
                exception={selectedException}
            />

            <StatusUpdateModal
                isOpen={isStatusModalOpen}
                onClose={closeModals}
                exception={selectedException}
                exemptionValue={exemptionValue}
                onStatusUpdate={handleStatusUpdate}
                isLoading={updateExceptionStatusMutation.isPending}
            />
        </div>
    );
}