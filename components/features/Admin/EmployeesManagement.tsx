// components/features/Admin/EmployeesManagement.tsx
"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button/Button";
import EmployeeForm from "./EmployeeForm";
import EmployeesTable from "./EmployeesTable";
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from "@/application/hooks/useEmployees";
import { Employee } from "@/domain/entities/employee";
import { EmployeeFormValues } from "@/domain/validation/employeeForm.schema";
import ModalComponent from "@/components/ui/modal/Modal";

export default function EmployeesManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const limit = 10;

  const { data: employeesResponse, isLoading, refetch } = useEmployees(currentPage, limit, search, roleFilter);
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  const employees = employeesResponse?.data || [];
  const meta = employeesResponse?.meta;
  const totalCount = meta?.total || 0;
  const totalPages = meta?.totalPages || 1;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleCreateEmployee = async (data: EmployeeFormValues) => {
    try {
      await createEmployeeMutation.mutateAsync(data);
      toast.success("Employee created successfully!");
      closeModal();
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create employee");
    }
  };

  const handleUpdateEmployee = async (data: EmployeeFormValues) => {
    if (!editingEmployee) return;
    
    try {
      await updateEmployeeMutation.mutateAsync({
        employeeId: editingEmployee._id,
        updates: data
      });
      toast.success("Employee updated successfully!");
      closeModal();
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update employee");
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    
    try {
      await deleteEmployeeMutation.mutateAsync(employeeId);
      toast.success("Employee deleted successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete employee");
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    openModal();
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    openModal();
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const isSubmitting = createEmployeeMutation.isPending || updateEmployeeMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Employees Management</h1>
          <p className="text-gray-600">Manage and review employees in the system</p>
        </div>

        {/* Header Actions */}
        <div className="flex lg:flex-row gap-4 flex-col justify-start md:justify-between mb-3">
          <div className="flex border-[#000000]/50 border items-center rounded-[10px] md:w-[531px] h-[34px]">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search employees..."
              className="outline-none placeholder:text-[16px] px-2 w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-medium text-[#000000]/50">
                Role
              </span>
              <select
                value={roleFilter}
                onChange={(e) => handleRoleFilterChange(e.target.value)}
                className="border border-[#000000]/50 rounded-[10px] px-3 py-1 outline-none"
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Receptionist">Receptionist</option>
                <option value="PCO">PCO</option>
                <option value="Wellness">Wellness</option>
                <option value="IOCR">IOCR</option>
                <option value="Settlement">Settlement</option>
                <option value="Psychosocial">Psychosocial</option>
                <option value="Youth">Youth</option>
                <option value="SALP">SALP</option>
                <option value="GBV">GBV</option>
                <option value="Training">Training</option>
                <option value="Policy">Policy</option>
              </select>
            </div>
            <Button
              variant="primary"
              onClick={handleAddEmployee}
              className="whitespace-nowrap px-2"
            >
              Add New Employee
            </Button>
          </div>
        </div>

        {/* Employees Table */}
        <EmployeesTable
          employees={employees}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          isLoading={isLoading}
          totalCount={totalCount}
        />
      </div>

      {/* Employee Form Modal */}
      <ModalComponent 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingEmployee ? "Edit Employee" : "Create New Employee"}
      >
        <EmployeeForm
          employee={editingEmployee || undefined}
          onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
          isSubmitting={isSubmitting}
          onCancel={closeModal}
        />
      </ModalComponent>
    </div>
  );
}