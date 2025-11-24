// components/features/Admin/EmployeesTable.tsx
"use client";

import { Button } from "@/components/ui/Button/Button";
import { Employee } from "@/domain/entities/employee";
import { Edit2, Trash2, User, Mail, Calendar } from "lucide-react";
import { Pagination } from "@/components/client/Pagination";

interface EmployeesTableProps {
  employees: Employee[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  isLoading?: boolean;
  totalCount: number;
}

export default function EmployeesTable({
  employees,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  isLoading = false,
  totalCount,
}: EmployeesTableProps) {
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      Admin: "bg-red-100 text-red-800",
      Receptionist: "bg-blue-100 text-blue-800",
      PCO: "bg-green-100 text-green-800",
      Wellness: "bg-purple-100 text-purple-800",
      IOCR: "bg-indigo-100 text-indigo-800",
      Settlement: "bg-yellow-100 text-yellow-800",
      Psychosocial: "bg-pink-100 text-pink-800",
      Youth: "bg-teal-100 text-teal-800",
      SALP: "bg-orange-100 text-orange-800",
      GBV: "bg-rose-100 text-rose-800",
      Training: "bg-cyan-100 text-cyan-800",
      Policy: "bg-lime-100 text-lime-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  // Mobile card view
  const EmployeeCard = ({ employee }: { employee: Employee }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Mail size={14} />
              <span>{employee.email}</span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
          {employee.role}
        </span>
      </div>
      
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Calendar size={14} />
        <span>Joined {new Date(employee.createdAt).toLocaleDateString()}</span>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          onClick={() => onEdit(employee)}
          className="flex-1 flex items-center gap-1"
        >
          <Edit2 size={14} />
          Edit
        </Button>
        <Button
          onClick={() => onDelete(employee._id)}
          className="flex-1 flex items-center gap-1"
        >
          <Trash2 size={14} />
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <div className="overflow-x-auto border border-[#71717180]/50 min-h-[60vh] text-[#555555]">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="bg-white border-b-[#00000080]/50 border-b">
              <th className="text-center py-2 px-4 text-lg font-medium whitespace-nowrap">
                Employee
              </th>
              <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                Email
              </th>
              <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                Role
              </th>
              <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                Created
              </th>
              <th className="text-center px-4 py-2 text-lg font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5}>
                  <div className="w-full min-h-[60vh] flex items-center justify-center text-center">
                    Loading employees...
                  </div>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <User size={48} className="mb-2 opacity-50" />
                    <p className="text-lg">No employees found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr
                  key={employee._id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-[#F7F7F7]"} hover:bg-gray-50 transition-colors`}
                >
                  <td className="py-3 pl-3 whitespace-nowrap text-[14px] font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <Mail size={14} className="text-gray-400" />
                      {employee.email}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                      {employee.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 flex gap-2 items-center justify-center text-center font-medium">
                    <Button
                      variant="outline"
                      onClick={() => onEdit(employee)}
                      className="flex items-center px-2 gap-1"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
          variant="primary"
                      onClick={() => onDelete(employee._id)}
                      className="flex items-center  px-2 gap-1"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-4 space-y-4">
        {isLoading ? (
          <div className="w-full min-h-[60vh] flex items-center justify-center text-center">
            Loading employees...
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <User size={48} className="mb-2 opacity-50" />
              <p className="text-lg">No employees found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          employees.map((employee) => (
            <EmployeeCard key={employee._id} employee={employee} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing {employees.length} of {totalCount} employees
            </div>
            <Pagination
              pageNum={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}