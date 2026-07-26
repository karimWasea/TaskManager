using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.Services;
using TaskManager.Application.Validators;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;
    private readonly ITaskService _taskService;

    public ProjectsController(IProjectService projectService, ITaskService taskService)
    {
        _projectService = projectService;
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] GetProjectsInputDto input) =>
        Ok(await _projectService.GetAllAsync(input));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id) =>
        Ok(await _projectService.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
    {
        await new CreateProjectDtoValidator().ValidateAndThrowAsync(dto);
        var result = await _projectService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProjectDto dto)
    {
        await new UpdateProjectDtoValidator().ValidateAndThrowAsync(dto);
        var result = await _projectService.UpdateAsync(id, dto);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _projectService.DeleteAsync(id);
        return Ok(result);
    }

    // Endpoint: Get all tasks for a specific project with pagination and optional status filter
    [HttpGet("{id:guid}/tasks")]
    public async Task<IActionResult> GetProjectTasks(Guid id, [FromQuery] GetTasksInputDto input) =>
        Ok(await _taskService.GetByProjectAsync(id, input));
}
