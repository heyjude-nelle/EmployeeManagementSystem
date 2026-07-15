import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { EmployeeList } from './employee-list';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

class MockEmployeeService {
  getAllEmployee() {
    return of([
      {
        employeeId: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        department: 'Sales',
        employmentStatus: 'Hired',
      } as Employee,
    ]);
  }
}

describe('EmployeeList', () => {
  let component: EmployeeList;
  let fixture: ComponentFixture<EmployeeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeList],
      providers: [{ provide: EmployeeService, useClass: MockEmployeeService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display employee data from the service', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Alice Smith');
    expect(compiled.textContent).toContain('alice@example.com');
  });
});
