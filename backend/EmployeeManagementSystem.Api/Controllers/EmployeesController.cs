using Microsoft.AspNetCore.Mvc;
using EmployeeManagementSystem.Api.Models;
using EmployeeManagementSystem.Api.Services;

namespace EmployeeManagementSystem.Api.Controllers;

[ApiController]
[Route("api/employees")]
public class EmployeesController(IEmployeeService employeeService) : ControllerBase
{
    private readonly IEmployeeService _employeeService = employeeService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
    {
        return Ok(await _employeeService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Employee>> GetEmployee(int id)
    {
        var employee = await _employeeService.GetByIdAsync(id);
        if (employee == null)
        {
            return NotFound();
        }
        return Ok(employee);
    }

    [HttpPost]
    public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
    {
        employee = await _employeeService.CreateAsync(employee);

        return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
    {
        employee.Id = id;

        var success = await _employeeService.UpdateAsync(id, employee);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var success = await _employeeService.DeleteAsync(id);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}