import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { environment } from '../../environments/environment';
import { Employee } from '../models/employee.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeService, provideHttpClientTesting()],
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve employee list from the API', () => {
    const expectedEmployees: Employee[] = [
      {
        id: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        department: 'Sales',
        employmentStatus: 'Hired',
      },
    ];

    service.getAllEmployee().subscribe((employees) => {
      expect(employees).toEqual(expectedEmployees);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/employees`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedEmployees);
  });

  it('should propagate HTTP errors', () => {
    service.getAllEmployee().subscribe({
      next: () => {
        throw new Error('Expected request to fail');
      },
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/employees`);
    req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server error' });
  });
});
