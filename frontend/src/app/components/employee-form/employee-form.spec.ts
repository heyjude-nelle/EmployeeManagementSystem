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

  it('should keep submit disabled until the form has unsaved changes', () => {
    const form = component['employeeForm'];
    const submitButton = (): HTMLButtonElement =>
      (fixture.nativeElement as HTMLElement).querySelector('.save-button')!;

    form.setValue({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      department: null,
      employmentStatus: 'Hired',
    });
    fixture.detectChanges();

    expect(form.valid).toBe(true);
    expect(submitButton().disabled).toBe(true);

    form.markAsDirty();
    fixture.detectChanges();

    expect(submitButton().disabled).toBe(false);
  });
});
