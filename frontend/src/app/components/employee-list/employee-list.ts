import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeColumn } from '../../models/employee.model';
import { RouterLink } from '@angular/router';

const formatStatus = (status: string): string => {
  return status === 'OnLeave' ? 'On Leave' : status;
};

const formatDepartment = (department: string | null): string => {
  if (!department) return 'Not Assigned';
  return department.replace(/([a-z])([A-Z])/g, '$1 $2');
};

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly loadError = signal(false);

  protected readonly displayColumns: EmployeeColumn[] = [
    {
      label: 'Name',
      cssClass: 'name-col',
      value: (employee: Employee) => `${employee.firstName} ${employee.lastName}`,
    },
    { label: 'Email', cssClass: 'email-col', value: (employee: Employee) => employee.email },
    {
      label: 'Department',
      cssClass: 'department-col',
      value: (employee: Employee) => formatDepartment(employee.department),
    },
    {
      label: 'Status',
      cssClass: 'status-col',
      value: (employee: Employee) => formatStatus(employee.employmentStatus),
    },
  ];

  protected readonly filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.employees().filter((e) =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.employeeService.getAllEmployee().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.loadError.set(false);
      },
      error: () => {
        this.employees.set([]);
        this.loadError.set(true);
      },
    });
  }
}
