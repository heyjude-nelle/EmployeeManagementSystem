import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Employee, CreateEmployee, UpdateEmployee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/employees`;

  getAllEmployee(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl).pipe(catchError((error) => this.handleHttpError(error)));
  }
 
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`).pipe(catchError((error) => this.handleHttpError(error)));
  }
 
  createEmployee(employee: CreateEmployee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employee).pipe(catchError((error) => this.handleHttpError(error)));
  }
 
  updateEmployee(id: number, employee: UpdateEmployee): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, employee).pipe(catchError((error) => this.handleHttpError(error)));
  }
 
  private handleHttpError(error: HttpErrorResponse) {
    console.error('EmployeeService HTTP error', error);
    return throwError(() => error);
  }
}
