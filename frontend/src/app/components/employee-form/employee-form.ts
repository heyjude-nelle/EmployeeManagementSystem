import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import {
  CreateEmployee,
  Department,
  Employee,
  EmployeeFormField,
  EmploymentStatus,
} from '../../models/employee.model';
import { DEPARTMENTS, EMPLOYMENT_STATUSES } from '../../models/employee-constants';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly isEditMode = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly pageTitle = signal('Add Employee');

  private employeeId: number | null = null;

  protected readonly departments = DEPARTMENTS;

  protected readonly employmentStatuses = EMPLOYMENT_STATUSES;

  protected readonly employeeForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    department: this.formBuilder.control<Department | null>(null),
    employmentStatus: this.formBuilder.nonNullable.control<EmploymentStatus>('Hired', {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.employeeId = Number(id);
    this.openEditPage(this.employeeId);
  }

  protected formatOptionLabel(value: string): string {
    return value.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  protected hasFieldError(field: EmployeeFormField, error: string): boolean {
    const control = this.employeeForm.controls[field];
    return control.touched && control.hasError(error);
  }

  private toFormValue(employee: Employee): CreateEmployee {
    return {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      employmentStatus: employee.employmentStatus,
    };
  }

  protected openEditPage(id: number): void {
    this.isEditMode.set(true);
    this.pageTitle.set('Edit Employee');

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => this.employeeForm.patchValue(this.toFormValue(employee)),
      error: (error) => {
        throw error;
      },
    });
  }

  protected submit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const employee = this.employeeForm.getRawValue();
    this.isSubmitting.set(true);

    if (this.isEditMode() && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, employee).subscribe({
        next: () => this.router.navigate(['/employees']),
        error: (error: Error) => {
          this.isSubmitting.set(false);
          if (error.message === 'DUPLICATE_EMAIL') {
            this.employeeForm.controls.email.setErrors({ duplicate: true });
          }
          throw error;
        },
      });
      return;
    }

    this.employeeService.createEmployee(employee).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: (error: Error) => {
        this.isSubmitting.set(false);
        if (error.message === 'DUPLICATE_EMAIL') {
          this.employeeForm.controls.email.setErrors({ duplicate: true });
        }
        throw error;
      },
    });
  }
}
