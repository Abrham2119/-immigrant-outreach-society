// components/Dashboard.tsx
'use client';

import { useState } from 'react';

interface StatCard {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  change: string;
  changeType: 'up' | 'down';
  period: string;
  icon: string;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      id: '1',
      title: 'Individual and Group Wellness Intervention',
      value: '40,689',
      change: '8.5%',
      changeType: 'up',
      period: 'from yesterday',
      icon: '🧠',
      color: 'blue'
    },
    {
      id: '2',
      title: 'Proactive Community Outreach (pCCI)',
      value: '10,293',
      change: '1.3%',
      changeType: 'up',
      period: 'from past week',
      icon: '👥',
      color: 'green'
    },
    {
      id: '3',
      title: 'Immigration Outreach Sponsorship (IOCR)',
      value: '4,300',
      change: '4.3%',
      changeType: 'down',
      period: 'from yesterday',
      icon: '🌍',
      color: 'purple'
    },
    {
      id: '4',
      title: 'Psychosocial Wellbeing and Supports',
      value: '2,040',
      change: '1.8%',
      changeType: 'up',
      period: 'from yesterday',
      icon: '💙',
      color: 'orange'
    }
  ]);

  return (
    <div className="  bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Dashboard  
          </h1>
         
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>     
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ stat }: { stat: StatCard }) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100 text-blue-600',
      change: 'text-green-600 bg-green-50'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-100 text-green-600',
      change: 'text-green-600 bg-green-50'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-100 text-purple-600',
      change: 'text-red-600 bg-red-50'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'bg-orange-100 text-orange-600',
      change: 'text-green-600 bg-green-50'
    }
  };

  const colors = colorClasses[stat.color as keyof typeof colorClasses];

  return (
    <div className={`${colors.bg} rounded-2xl shadow-sm border border-gray-200/50 p-4 md:p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 md:p-3 rounded-xl ${colors.icon}`}>
          <span className="text-lg md:text-xl">{stat.icon}</span>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${stat.changeType === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          {stat.changeType === 'up' ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          <span>{stat.change}</span>
        </div>
      </div>
      
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
        {stat.value}
      </h3>
      <p className="text-gray-600 text-sm md:text-base leading-tight mb-3">
        {stat.title}
      </p>
      <p className="text-gray-500 text-xs md:text-sm">
        {stat.period}
      </p>
    </div>
  );

}