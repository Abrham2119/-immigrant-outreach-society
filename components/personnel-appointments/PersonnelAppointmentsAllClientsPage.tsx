"use client";
import { useTranslation } from '@/components/providers/translation.provider';
import {
    usePersonnelAppointmentManagementAllClients
} from '@/application/hooks/usePersonnelAppointmentsAllClients';
import { assessmentForms } from '@/domain/constants/assessmentForms';
import { AssessmentFormType } from '@/domain/constants/AssessmentFormType';
import { AppointmentResponse, AppointmentStatus } from '@/domain/entities/appointmentPersonnel';
import { Eye, FileText, User, Calendar, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pagination } from '../client/Pagination';
import ModalComponent from '../ui/modal/Modal';
import { ClientFormsHistory } from './ClientFormsHistory';
import { PersonnelAppointmentDetails } from './PersonnelAppointmentDetails';

const statusColors = {
    booked: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    accepted: "bg-green-100 text-green-800",
};

interface PersonnelAppointmentsAllClientsPageProps {
    selectedStatus?: AppointmentStatus;
    onStatusChange?: (status: AppointmentStatus) => void;
}

export const PersonnelAppointmentsAllClientsPage: React.FC<PersonnelAppointmentsAllClientsPageProps> = ({
    selectedStatus: externalStatus,
    onStatusChange
}) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(8);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
    const [selectedAppointmentForAssessment, setSelectedAppointmentForAssessment] = useState<AppointmentResponse | null>(null);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
    const [remark, setRemark] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<AppointmentStatus | 'all'>('all');
    const router = useRouter();

    const { personnelId, usePersonnelAppointmentsAllClients, useUpdateAppointmentStatusAllClients } = usePersonnelAppointmentManagementAllClients();

    const { data: appointmentsData, isLoading, error } = usePersonnelAppointmentsAllClients({
        personnelId: personnelId!,
        status: externalStatus || "",
        date: selectedDate,
        page: pageNum,
        limit: pageSize,
        search: search
    });

    const updateAppointmentStatusMutation = useUpdateAppointmentStatusAllClients();

    const appointments = appointmentsData?.data || [];
    const totalPages = appointmentsData?.meta?.totalPages || 1;
    const totalCount = appointmentsData?.meta?.total || 0;
    const currentCount = appointmentsData?.meta?.count || 0;

    const filteredAppointments = appointments.filter(appointment => {
        if (selectedFilter === 'all') return true;
        return appointment.status === selectedFilter;
    });

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPageNum(1);
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setPageNum(1);
    };

    const handleClearDate = () => {
        setSelectedDate("");
        setPageNum(1);
    };

    const handlePagination = (page: number) => {
        setPageNum(page);
    };

    const openModal = (appointment: AppointmentResponse) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
        setRemark('');
    };

    const openAssessmentModal = (appointment: AppointmentResponse) => {
        setSelectedAppointmentForAssessment(appointment);
        setIsAssessmentModalOpen(true);
    };

    const closeAssessmentModal = () => {
        setIsAssessmentModalOpen(false);
        setSelectedAppointmentForAssessment(null);
    };

    const handleFormSelect = (formSlug: string) => {
        if (selectedAppointmentForAssessment && personnelId) {
            const formPath = `/dashboard/personnel/Wellness/assessment/${selectedAppointmentForAssessment.client._id}/${formSlug}`;
            router.push(formPath);
        }
        closeAssessmentModal();
    };

    const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
        setStatusUpdateLoading(appointmentId);
        try {
            await updateAppointmentStatusMutation.mutateAsync({
                appointmentId,
                statusData: {
                    status: newStatus,
                    ...(remark && { remark })
                }
            });
            setRemark('');
        } catch (error) {
            console.error(t('failedToUpdateAppointmentStatus', 'Failed to update appointment status:'), error);
        } finally {
            setStatusUpdateLoading(null);
        }
    };

    const formatDisplayDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
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



    if (!personnelId) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
                    <div className="text-center py-8 text-yellow-600">
                        <User className="h-12 w-12 mx-auto mb-4" />
                        <p className="text-lg font-medium">
                            {t('pleaseLoginAsPersonnel', 'Please log in as personnel to view appointments')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
                    <div className="text-center py-8 text-red-600">
                        {t('errorLoadingAppointments', 'Error loading appointments:')} {(error as Error).message}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {t('allClientAppointments', 'All Client Appointments')}
                    </h1>
                    <p className="text-gray-600">
                        {t('manageAllClientScheduledAppointments', 'Manage all client scheduled appointments')}
                    </p>
                </div>

                <div className="flex lg:flex-row gap-4 flex-col justify-start md:justify-between mb-3">
                    <div className="flex gap-4">
                        <div className="flex border-[#000000]/50 border items-center rounded-[10px] md:w-[531px] h-[34px]">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder={t('searchAllAppointmentsPlaceholder', 'Search all appointments...')}
                                className="outline-none placeholder:text-[16px] px-2 w-full"
                            />
                        </div>
                        <div className="flex border-[#000000]/50 border items-center rounded-[10px] md:w-[250px] h-[34px] relative">
                            <Calendar className="absolute left-2 h-4 w-4 text-gray-500" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="outline-none px-8 w-full"
                            />
                            {selectedDate && (
                                <button
                                    onClick={handleClearDate}
                                    className="absolute right-2 text-gray-500 hover:text-gray-700"
                                    title={t('clearDateFilterTooltip', 'Clear date filter')}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Filter size={18} />
                            <span>{t('filterButton', 'Filter')}</span>
                            {selectedFilter !== 'all' && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[selectedFilter as keyof typeof statusColors]}`}>
                                    {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
                                </span>
                            )}
                        </button>

                        {showFilters && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <div className="p-2">
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
                                        {t('filterLabel', 'Filter')}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedFilter('all');
                                            setShowFilters(false);
                                        }}
                                        className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded mb-1 ${selectedFilter === 'all'
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <span>{t('allAppointments', 'All Appointments')}</span>
                                        {selectedFilter === 'all' && (
                                            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedFilter('booked');
                                            setShowFilters(false);
                                        }}
                                        className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded mb-1 ${selectedFilter === 'booked'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <span>{t('statusBooked', 'Booked')}</span>
                                        {selectedFilter === 'booked' && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedFilter('completed');
                                            setShowFilters(false);
                                        }}
                                        className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded mb-1 ${selectedFilter === 'completed'
                                            ? 'bg-green-50 text-green-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <span>{t('statusCompleted', 'Completed')}</span>
                                        {selectedFilter === 'completed' && (
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedFilter('rejected');
                                            setShowFilters(false);
                                        }}
                                        className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded mb-1 ${selectedFilter === 'rejected'
                                            ? 'bg-red-50 text-red-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <span>{t('statusRejected', 'Rejected')}</span>
                                        {selectedFilter === 'rejected' && (
                                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedFilter('accepted');
                                            setShowFilters(false);
                                        }}
                                        className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded ${selectedFilter === 'accepted'
                                            ? 'bg-green-50 text-green-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <span>{t('statusAccepted', 'Accepted')}</span>
                                        {selectedFilter === 'accepted' && (
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {(selectedDate || selectedFilter !== 'all') && (
                    <div className="mb-3 flex items-center gap-2 text-sm text-blue-600">
                        {selectedDate && (
                            <>
                                <Calendar className="h-4 w-4" />
                                <span>{t('filteringByDate', 'Filtering by date:')} {selectedDate}</span>
                                <button
                                    onClick={handleClearDate}
                                    className="text-red-500 hover:text-red-700 text-xs underline"
                                >
                                    {t('clearDateFilter', 'Clear date filter')}
                                </button>
                            </>
                        )}
                        {selectedFilter !== 'all' && (
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${statusColors[selectedFilter as keyof typeof statusColors]}`}>
                                {t('statusFilterApplied', 'Status:')} {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
                            </span>
                        )}
                    </div>
                )}

                <div className="overflow-x-auto border border-[#71717180]/50 min-h-[60vh] text-[#555555]">
                    <table className="w-full text-sm min-w-[800px]">
                        <thead>
                            <tr className="bg-white border-b-[#00000080]/50 border-b">
                                <th className="text-center py-3 px-4 text-lg font-medium whitespace-nowrap">
                                    {t('clientColumn', 'Client')}
                                </th>
                                <th className="text-center px-4 py-3 text-lg font-medium whitespace-nowrap">
                                    {t('contactColumn', 'Contact')}
                                </th>
                                <th className="text-center px-4 py-3 text-lg font-medium whitespace-nowrap">
                                    {t('servicesColumn', 'Services')}
                                </th>
                                <th className="text-center px-4 py-3 text-lg font-medium whitespace-nowrap">
                                    {t('dateAndTimeColumn', 'Date & Time')}
                                </th>
                                <th className="text-center px-4 py-3 text-lg font-medium">
                                    {t('statusColumn', 'Status')}
                                </th>
                                <th className="text-center px-4 py-3 text-lg font-medium">
                                    {t('actionsColumn', 'Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="w-full min-h-[60vh] flex items-center justify-center text-center">
                                            {t('loadingAllAppointments', 'Loading all appointments...')}
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">
                                        {appointments.length === 0
                                            ? t('noAppointmentsFound', 'No appointments found.')
                                            : t('noFilteredAppointmentsFound', `No ${selectedFilter} appointments found.`)}
                                    </td>
                                </tr>
                            ) : (
                                filteredAppointments.map((appointment: AppointmentResponse, index: number) => (
                                    <tr
                                        key={appointment._id}
                                        className={`${index % 2 === 0 ? "bg-white" : "bg-[#F7F7F7]"}`}
                                    >
                                        <td className="py-3 px-4 whitespace-nowrap text-[14px] font-medium text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold text-xs">
                                                        {appointment.client.firstName.charAt(0)}{appointment.client.lastName.charAt(0)}
                                                    </span>
                                                </div>
                                                <span>
                                                    {appointment.client.firstName} {appointment.client.lastName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                                            <div className="flex flex-col gap-1">
                                                <span>{appointment.client.email}</span>
                                                <span className="text-gray-500">+{appointment.client.mobile}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                                            <div className="flex flex-wrap gap-1 justify-center">
                                                {appointment.client.services.slice(0, 2).map((service: string, serviceIndex: number) => (
                                                    <span
                                                        key={serviceIndex}
                                                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                                    >
                                                        {service}
                                                    </span>
                                                ))}
                                                {appointment.client.services.length > 2 && (
                                                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                                        +{appointment.client.services.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold">
                                                    {formatDisplayDate(appointment.date)}
                                                </span>
                                                <span className="text-gray-500">
                                                    {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none  ${statusColors[appointment.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
                                                } ${statusUpdateLoading === appointment._id ? 'opacity-50' : ''}`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 flex gap-2 items-center justify-center text-center font-medium">
                                            <button
                                                onClick={() => openModal(appointment)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                title={t('viewDetailsTooltip', 'View Details')}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <ClientFormsHistory
                                                clientId={appointment.client._id}
                                                clientName={`${appointment.client.firstName} ${appointment.client.lastName}`}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {appointmentsData && totalCount > 0 && (
                    <div className="mt-6">
                        <Pagination
                            pageNum={pageNum}
                            totalPages={totalPages}
                            onPageChange={handlePagination}
                        />
                    </div>
                )}
            </div>

            <ModalComponent isOpen={isModalOpen} onClose={closeModal}>
                {selectedAppointment && <PersonnelAppointmentDetails appointment={selectedAppointment} />}
            </ModalComponent>

            <ModalComponent isOpen={isAssessmentModalOpen} onClose={closeAssessmentModal}>
                <div className="w-full max-w-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        {t('assessmentFormsTitle', 'Assessment Forms')}
                    </h2>

                    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                        {assessmentForms.map((form: AssessmentFormType) => (
                            <button
                                key={form.id}
                                onClick={() => handleFormSelect(form.slug)}
                                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-800 font-medium">{form.title}</span>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {selectedAppointmentForAssessment && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <strong>{t('selectedClientLabel', 'Selected Client:')}</strong> {selectedAppointmentForAssessment.client.firstName} {selectedAppointmentForAssessment.client.lastName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <strong>{t('clientIdLabel', 'Client ID:')}</strong> {selectedAppointmentForAssessment.client._id}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <strong>{t('personnelIdLabel', 'Personnel ID:')}</strong> {personnelId}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <strong>{t('appointmentIdLabel', 'Appointment ID:')}</strong> {selectedAppointmentForAssessment._id}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                {t('appointmentLabel', 'Appointment:')} {formatDisplayDate(selectedAppointmentForAssessment.date)} at {formatTime(selectedAppointmentForAssessment.startTime)}
                            </p>
                        </div>
                    )}
                </div>
            </ModalComponent>
        </div>
    );
};