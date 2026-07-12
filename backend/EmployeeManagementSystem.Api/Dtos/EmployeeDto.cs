using EmployeeManagementSystem.Api.Models;

namespace EmployeeManagementSystem.Api.Dtos;

public class EmployeeDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Department? Department { get; set; }
    public EmploymentStatus EmploymentStatus { get; set; }
}