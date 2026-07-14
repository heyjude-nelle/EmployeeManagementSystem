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
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: Department | null;
  employmentStatus: EmploymentStatus;
}

export type CreateEmployee = Omit<Employee, 'id'>;

export type UpdateEmployee = Omit<Employee, 'id'>;

export type EmployeeColumn = {
  label: string;
  cssClass?: string;
  value: (employee: Employee) => string | null;
};

export type EmployeeFormField =
  'firstName' | 'lastName' | 'email' | 'department' | 'employmentStatus';
