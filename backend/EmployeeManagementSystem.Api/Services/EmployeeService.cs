using EmployeeManagementSystem.Api.Data;
using EmployeeManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;
using EmployeeManagementSystem.Api.Dtos;

namespace EmployeeManagementSystem.Api.Services;

public interface IEmployeeService
{
    Task<IEnumerable<EmployeeDto>> GetAllAsync();
    Task<EmployeeDto?> GetByIdAsync(int id);
    Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto);
    Task<bool> UpdateAsync(int id, UpdateEmployeeDto dto);
    Task<bool> DeleteAsync(int id);
}

public class EmployeeService(AppDbContext context) : IEmployeeService
{
    private readonly AppDbContext _context = context;

    private static EmployeeDto ToDto(Employee employee)
    {
        return new EmployeeDto
        {
            EmployeeId = employee.EmployeeId,
            FirstName = employee.FirstName,
            LastName = employee.LastName,
            Email = employee.Email,
            Department = employee.Department,
            EmploymentStatus = employee.EmploymentStatus
        };
    }

    public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
    {
        var employees = await _context.Employees.ToListAsync();
        return employees.Select(ToDto);
    }

    public async Task<EmployeeDto?> GetByIdAsync(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        return employee == null ? null : ToDto(employee);
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
    {
        var employee = new Employee
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Department = dto.Department,
            EmploymentStatus = dto.EmploymentStatus
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return ToDto(employee);
    }

    public async Task<bool> UpdateAsync(int id, UpdateEmployeeDto dto)
    {
        var existingEmployee = await _context.Employees.FindAsync(id);
        if (existingEmployee == null)
        {
            return false;
        }

        existingEmployee.FirstName = dto.FirstName;
        existingEmployee.LastName = dto.LastName;
        existingEmployee.Email = dto.Email;
        existingEmployee.Department = dto.Department;
        existingEmployee.EmploymentStatus = dto.EmploymentStatus;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null)
        {
            return false;
        }

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();
        return true;
    }
}
