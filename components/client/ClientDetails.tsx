"use client";
import React from "react";
import { useQuery } from '@tanstack/react-query';
import { getClientByIdUseCase } from '@/infrastructure/api/clientService';
import { Client } from '@/domain/entities/client';

interface ClientDetailsProps {
  id: string;
}

const SERVICES = [
  { value: "PCO", label: "Proactive Community Outreach" },
  { value: "Wellness", label: "Wellness Intervention" },
  { value: "IOCR", label: "Immigration Crisis Response" },
  { value: "Settlement", label: "Settlement & Integration" },
  { value: "Psychosocial", label: "Psychosocial Wellbeing" },
  { value: "Youth", label: "Youth Program" },
  { value: "SALP", label: "Senior Active Living Program (SALP)" },
  { value: "GBV", label: "Gender-Based Violence (GBV) Program" },
  { value: "Training", label: "Training and Workshops" },
  { value: "Policy", label: "Policy Influencing and Advocacy for Antiracism Initiatives" }
];

const statusColors = {
  upcoming: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  arrived: "bg-blue-100 text-blue-800",
};

export const ClientDetails: React.FC<ClientDetailsProps> = ({ id }) => {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientByIdUseCase(id),
    enabled: !!id,
  });

  // Extract client data from the response
  const client = response?.client;

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl p-6">
        <div className="text-red-600 text-center">
          Error loading client details: {(error as Error).message}
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="w-full max-w-2xl p-6">
        <div className="text-gray-600 text-center">
          Client not found.
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Function to map service values to labels
  const getServiceLabel = (serviceValue: string) => {
    const service = SERVICES.find(s => s.value === serviceValue);
    return service ? service.label : serviceValue; // Fallback to original value if not found
  };

  console.log(client, "this is client");

  return (
    <div className="w-full max-w-8xl max-h-[86vh] overflow-hidden flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Client Details</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h3>

            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-gray-800 font-medium">{client.firstName} {client.lastName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="text-gray-800 font-medium capitalize">{client.gender}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="text-gray-800 font-medium">
                {formatDate(client.birthDate)} (Age: {calculateAge(client.birthDate)})
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Nationality</p>
              <p className="text-gray-800 font-medium">{client.nationality}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Immigration Status</p>
              <p className="text-gray-800 font-medium">{client.immigrationStatus}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Language</p>
              <p className="text-gray-800 font-medium">{client.language}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Contact Information</h3>

            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="text-gray-800 font-medium">+{client.mobile}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-gray-800 font-medium">{client.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="text-gray-800 font-medium">{client.address}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Additional Information</h3>

          <div>
            <p className="text-sm text-gray-600">Services</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.isArray(client.services) && client.services.length > 0 ? (
                client.services.map((serviceValue, index) => {
                  const serviceLabel = getServiceLabel(serviceValue);
                  return (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize"
                    >
                      {serviceLabel}
                    </span>
                  );
                })
              ) : (
                <span className="text-gray-500 italic">No services</span>
              )}
            </div>
          </div>

          {client.message && (
            <div>
              <p className="text-sm text-gray-600">Message</p>
              <p className="text-gray-800 font-medium italic">"{client.message}"</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[client.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
              }`}>
              {client.status}
            </span>
          </div>

          {/* Registered By Information - Only show if not null */}
          {client.registeredBy && (
            <div>
              <p className="text-sm text-gray-600">Registered By</p>
              <p className="text-gray-800 font-medium">{client.registeredBy}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-600">Registration Date</p>
            <p className="text-gray-800 font-medium">
              {new Date(client.createdAt).toLocaleDateString()} at{" "}
              {new Date(client.createdAt).toLocaleTimeString()}
            </p>
          </div>

          {client.updatedAt && client.updatedAt !== client.createdAt && (
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-gray-800 font-medium">
                {new Date(client.updatedAt).toLocaleDateString()} at{" "}
                {new Date(client.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};