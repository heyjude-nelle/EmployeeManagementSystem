using System.ComponentModel.DataAnnotations;
using EmployeeManagementSystem.Api.Models;

namespace EmployeeManagementSystem.Api.Dtos;

public class UpdateEmployeeDto
{
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [EnumDataType(typeof(Department))]
    public Department? Department { get; set; }

    [EnumDataType(typeof(EmploymentStatus))]
    public EmploymentStatus EmploymentStatus { get; set; } = EmploymentStatus.Hired;
}