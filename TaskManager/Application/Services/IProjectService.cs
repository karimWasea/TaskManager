using TaskManager.Application.Common.Models;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Services;

public interface IProjectService
{
    Task<Result<PagedResult<ProjectDto>>> GetAllAsync(GetProjectsInputDto input);
    Task<Result<ProjectDetailDto>> GetByIdAsync(Guid id);
    Task<Result<ProjectDto>> CreateAsync(CreateProjectDto dto);
    Task<Result> UpdateAsync(Guid id, UpdateProjectDto dto);
    Task<Result> DeleteAsync(Guid id);
}
