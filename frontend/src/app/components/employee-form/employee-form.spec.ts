import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EmployeeForm } from './employee-form';

describe('EmployeeForm', () => {
  let component: EmployeeForm;
  let fixture: ComponentFixture<EmployeeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeForm],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the form invalid when required fields are empty', () => {
    const form = component['employeeForm'];

    form.controls.firstName.setValue('');
    form.controls.lastName.setValue('');
    form.controls.email.setValue('');
    form.controls.firstName.markAsTouched();
    form.controls.lastName.markAsTouched();
    form.controls.email.markAsTouched();

    expect(form.invalid).toBe(true);
    expect(component['hasFieldError']('firstName', 'required')).toBe(true);
    expect(component['hasFieldError']('lastName', 'required')).toBe(true);
    expect(component['hasFieldError']('email', 'required')).toBe(true);
  });
});
