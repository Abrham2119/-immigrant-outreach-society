// components/AppointmentDashboard.tsx
'use client';

import { useTranslation } from '@/components/providers/translation.provider';
import { useState } from 'react';

interface Appointment {
  id: string;
  title: string;
  client: string;
  duration: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  date: string;
  time: string;
}

export default function AppointmentDashboard() {
  const { t } = useTranslation(); 
  
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Mental Health/Counselling',
      client: 'Alemu Kftom',
      duration: '1 hour',
      type: 'In Person',
      status: 'scheduled',
      date: '2024-01-15',
      time: '10:00 AM'
    },
    {
      id: '2',
      title: 'Mental Health/Counselling',
      client: 'Alemu Kftom',
      duration: '1 hour',
      type: 'In Person',
      status: 'scheduled',
      date: '2024-01-16',
      time: '2:00 PM'
    },
    {
      id: '3',
      title: 'Mental Health/Counselling',
      client: 'Michael Nick',
      duration: '30 minutes',
      type: 'In Person',
      status: 'completed',
      date: '2024-01-14',
      time: '11:00 AM'
    },
    {
      id: '4',
      title: 'Mental Health/Counselling',
      client: 'Alemu Kftom',
      duration: '1 hour',
      type: 'In Person',
      status: 'completed',
      date: '2024-01-13',
      time: '3:00 PM'
    }
  ]);

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    today: appointments.filter(a => a.date === '2024-01-15').length
  };

  const upcomingAppointments = appointments
    .filter(a => a.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('appointmentDashboard', 'Appointment Dashboard')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('managePersonalAppointments', 'Manage your personal appointments and schedule')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={t('totalAppointments', 'Total Appointments')}
            value={stats.total}
            icon="📅"
            color="blue"
          />
          <StatCard
            title={t('scheduled', 'Scheduled')}
            value={stats.scheduled}
            icon="⏳"
            color="yellow"
          />
          <StatCard
            title={t('completed', 'Completed')}
            value={stats.completed}
            icon="✅"
            color="green"
          />
          <StatCard
            title={t('today', 'Today')}
            value={stats.today}
            icon="📌"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t('upcomingAppointments', 'Upcoming Appointments')}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {t('yourScheduledMeetings', 'Your scheduled meetings')}
                </p>
              </div>
              <div className="p-6">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">📅</div>
                    <p className="text-gray-500">
                      {t('noUpcomingAppointments', 'No upcoming appointments')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Calendar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t('quickActions', 'Quick Actions')}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <ActionButton icon="📋" label={t('scheduleNew', 'Schedule New')} />
                  <ActionButton icon="🖨️" label={t('printSchedule', 'Print Schedule')} />
                  <ActionButton icon="📮" label={t('postUpdates', 'Post Updates')} />
                  <ActionButton icon="🚫" label={t('setUnavailable', 'Set Unavailable')} />
                </div>
              </div>
            </div>       
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {t('recentActivity', 'Recent Activity')}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {appointments.slice(0, 3).map((appointment) => (
                <ActivityItem key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

// Appointment Card Component
function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const { t } = useTranslation(); // Add translation hook here if needed
  
  const statusColors = {
    scheduled: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusTranslations = {
    scheduled: t('scheduled', 'Scheduled'),
    completed: t('completed', 'Completed'),
    cancelled: t('cancelled', 'Cancelled')
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-lg">👤</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{appointment.client}</h3>
          <p className="text-sm text-gray-600">{appointment.title}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500">{appointment.date}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{appointment.time}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{appointment.duration}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
          {statusTranslations[appointment.status]}
        </span>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <span className="text-gray-400 hover:text-gray-600">⋯</span>
        </button>
      </div>
    </div>
  );
}

// Action Button Component
function ActionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
      <span className="text-xl">{icon}</span>
      <span className="font-medium text-gray-700">{label}</span>
    </button>
  );
}

// Activity Item Component
function ActivityItem({ appointment }: { appointment: Appointment }) {
  const { t } = useTranslation(); // Add translation hook here if needed
  
  const statusTranslations = {
    scheduled: t('scheduled', 'Scheduled'),
    completed: t('completed', 'Completed'),
    cancelled: t('cancelled', 'Cancelled')
  };

  return (
    <div className="flex items-center space-x-4">
      <div className={`w-2 h-2 rounded-full ${
        appointment.status === 'completed' ? 'bg-green-500' : 
        appointment.status === 'scheduled' ? 'bg-yellow-500' : 'bg-red-500'
      }`} />
      <div className="flex-1">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{appointment.client}</span> - {appointment.title}
        </p>
        <p className="text-xs text-gray-500">
          {appointment.date} • {appointment.time} • {appointment.duration}
        </p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${
        appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
        appointment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
      }`}>
        {statusTranslations[appointment.status]}
      </span>
    </div>
  );
}