import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { RouterLink } from '@angular/router';

type EmployeeColumn = {
  label: string;
  cssClass?: string;
  value: (employee: Employee) => string | null;
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
      value: (employee: Employee) => employee.department,
    },
    {
      label: 'Status',
      cssClass: 'status-col',
      value: (employee: Employee) => employee.employmentStatus,
    },
  ];

  protected readonly filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.employees().filter((e) =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.employeeService.getAllEmployee().subscribe((data) => this.employees.set(data));
  }
}
