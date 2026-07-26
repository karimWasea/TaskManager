using TaskManager.Application.Common.Exceptions;
using TaskManager.Application.Common.Models;
using TaskManager.Application.DTOs;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interfaces;

namespace TaskManager.Application.Services;

public class ProjectService : IProjectService
{
    private readonly IUnitOfWork _unitOfWork;

    public ProjectService(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<PagedResult<ProjectDto>>> GetAllAsync(GetProjectsInputDto input)
    {
        var (projects, totalCount) = await _unitOfWork.Projects.GetPagedProjectsAsync(input.PageNumber, input.PageSize, input.Search);

        var dtos = projects.Select(p => new ProjectDto(
            p.Id, p.Name, p.Description, p.CreatedAt, p.Tasks.Count)).ToList();

        var pagedResult = new PagedResult<ProjectDto>(dtos, totalCount, input.PageNumber, input.PageSize);
        return Result<PagedResult<ProjectDto>>.Success(pagedResult, "Projects retrieved successfully.");
    }

    public async Task<Result<ProjectDetailDto>> GetByIdAsync(Guid id)
    {
        var project = await _unitOfWork.Projects.GetProjectWithTasksAsync(id)
            ?? throw new NotFoundException($"Project with id '{id}' was not found.");

        var dto = new ProjectDetailDto(
            project.Id,
            project.Name,
            project.Description,
            project.CreatedAt,
            project.Tasks.Select(t => new TaskDto(
                t.Id, t.Title, t.Description, t.Status.ToString(), t.DueDate, t.ProjectId)));

        return Result<ProjectDetailDto>.Success(dto, "Project detail retrieved successfully.");
    }

    public async Task<Result<ProjectDto>> CreateAsync(CreateProjectDto dto)
    {
        var project = new Project
        {
            Name = dto.Name,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Projects.AddAsync(project);
        await _unitOfWork.SaveChangesAsync();

        var createdDto = new ProjectDto(project.Id, project.Name, project.Description, project.CreatedAt, 0);
        return Result<ProjectDto>.Success(createdDto, "Project created successfully.");
    }

    public async Task<Result> UpdateAsync(Guid id, UpdateProjectDto dto)
    {
        var project = await _unitOfWork.Projects.GetByIdAsync(id)
            ?? throw new NotFoundException($"Project with id '{id}' was not found.");

        project.Name = dto.Name;
        project.Description = dto.Description;

        _unitOfWork.Projects.Update(project);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success("Project updated successfully.");
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        var project = await _unitOfWork.Projects.GetByIdAsync(id)
            ?? throw new NotFoundException($"Project with id '{id}' was not found.");

        _unitOfWork.Projects.Delete(project);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success("Project deleted successfully.");
    }
}
