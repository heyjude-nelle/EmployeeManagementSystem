namespace EmployeeManagementSystem.Api.Models;

using System.ComponentModel.DataAnnotations;

public class Employee
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    [EnumDataType(typeof(Department))]
    public Department? Department { get; set; }

    [EnumDataType(typeof(EmploymentStatus))]
    public EmploymentStatus EmploymentStatus { get; set; } = EmploymentStatus.Hired;
}