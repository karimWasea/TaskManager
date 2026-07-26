using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.Services;
using TaskManager.Application.Validators;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService) => _taskService = taskService;

    // Endpoint: Filter tasks by Status & Pagination
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] GetTasksInputDto input) =>
        Ok(await _taskService.GetAllAsync(input));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id) =>
        Ok(await _taskService.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
    {
        await new CreateTaskDtoValidator().ValidateAndThrowAsync(dto);
        var result = await _taskService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskDto dto)
    {
        await new UpdateTaskDtoValidator().ValidateAndThrowAsync(dto);
        var result = await _taskService.UpdateAsync(id, dto);
        return Ok(result);
    }

    // Endpoint: Change task status directly
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateTaskStatusDto dto)
    {
        var result = await _taskService.UpdateStatusAsync(id, dto);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _taskService.DeleteAsync(id);
        return Ok(result);
    }
}
