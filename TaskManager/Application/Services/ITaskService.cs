using TaskManager.Application.Common.Models;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Services;

public interface ITaskService
{
    Task<Result<PagedResult<TaskDto>>> GetAllAsync(GetTasksInputDto input);
    Task<Result<TaskDto>> GetByIdAsync(Guid id);
    Task<Result<PagedResult<TaskDto>>> GetByProjectAsync(Guid projectId, GetTasksInputDto input);
    Task<Result<TaskDto>> CreateAsync(CreateTaskDto dto);
    Task<Result> UpdateAsync(Guid id, UpdateTaskDto dto);
    Task<Result> UpdateStatusAsync(Guid id, UpdateTaskStatusDto dto);
    Task<Result> DeleteAsync(Guid id);
}
