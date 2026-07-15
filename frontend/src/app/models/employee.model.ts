export type Department =
  | 'Accounting'
  | 'Engineering'
  | 'HumanResources'
  | 'Legal'
  | 'Management'
  | 'Marketing'
  | 'Operations'
  | 'Sales'
  | 'Support';

export type EmploymentStatus = 'Hired' | 'Active' | 'Benched' | 'OnLeave' | 'Terminated';

export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  department: Department | null;
  employmentStatus: EmploymentStatus;
}

export type CreateEmployee = Omit<Employee, 'employeeId'>;

export type UpdateEmployee = Omit<Employee, 'employeeId'>;

export type EmployeeColumn = {
  label: string;
  cssClass?: string;
  value: (employee: Employee) => string | null;
};

export type EmployeeFormField =
  'firstName' | 'lastName' | 'email' | 'department' | 'employmentStatus';
