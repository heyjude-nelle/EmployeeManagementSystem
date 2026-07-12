using EmployeeManagementSystem.Api.Data;
using EmployeeManagementSystem.Api.Dtos;
using EmployeeManagementSystem.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Api.Tests;

public class EmployeeServiceTests
{
    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateAsync_ShouldAddEmployeeAndReturnDtoWithGeneratedId()
    {
        var context = CreateContext();
        var service = new EmployeeService(context);
        var dto = new CreateEmployeeDto
        {
            FirstName = "Jane",
            LastName = "Doe",
            Email = "jane.doe@example.com"
        };

        var result = await service.CreateAsync(dto);

        Assert.True(result.Id > 0);
        Assert.Equal("Jane", result.FirstName);
    }

    [Fact]
    public async Task UpdateAsync_ShouldReturnFalse_WhenEmployeeDoesNotExist()
    {
        var context = CreateContext();
        var service = new EmployeeService(context);
        var dto = new UpdateEmployeeDto
        {
            FirstName = "Ghost",
            LastName = "User",
            Email = "ghost.user@example.com"
        };

        var result = await service.UpdateAsync(999, dto);

        Assert.False(result);
    }
}
