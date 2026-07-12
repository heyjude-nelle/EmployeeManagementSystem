using System.ComponentModel.DataAnnotations;
using EmployeeManagementSystem.Api.Dtos;

namespace EmployeeManagementSystem.Api.Tests.Dtos;

public class CreateEmployeeDtoValidationTests
{
    private static bool TryValidate(CreateEmployeeDto dto, out ICollection<ValidationResult> results)
    {
        var context = new ValidationContext(dto);
        results = new List<ValidationResult>();
        return Validator.TryValidateObject(dto, context, results, validateAllProperties: true);
    }

    [Fact]
    public void CreateEmployeeDto_ShouldFailValidation_WhenEmailIsInvalid()
    {
        var dto = new CreateEmployeeDto
        {
            FirstName = "Jane",
            LastName = "Doe",
            Email = "not-an-email"
        };

        var isValid = TryValidate(dto, out var results);

        Assert.False(isValid);
        Assert.Contains(results, r => r.MemberNames.Contains("Email"));
    }

    [Fact]
    public void CreateEmployeeDto_ShouldPassValidation_WhenAllFieldsAreValid()
    {
        var dto = new CreateEmployeeDto
        {
            FirstName = "Jane",
            LastName = "Doe",
            Email = "jane.doe@example.com"
        };

        var isValid = TryValidate(dto, out var results);

        Assert.True(isValid);
        Assert.Empty(results);
    }
}
