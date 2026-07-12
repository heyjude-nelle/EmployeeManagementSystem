namespace EmployeeManagementSystem.Api.Models;

public class Employee
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Department? Department { get; set; }
    public EmploymentStatus EmploymentStatus { get; set; } = EmploymentStatus.Hired;
}