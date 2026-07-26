using TaskManager.Application.Common.Exceptions;
using TaskManager.Application.Common.Models;
using TaskManager.Application.DTOs;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;
using TaskManager.Domain.Interfaces;

namespace TaskManager.Application.Services;

public class TaskService : ITaskService
{
    private readonly IUnitOfWork _unitOfWork;

    public TaskService(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<PagedResult<TaskDto>>> GetAllAsync(GetTasksInputDto input)
    {
        var pageNumber = input.PageNumber < 1 ? 1 : input.PageNumber;
        var pageSize = input.PageSize < 1 ? 6 : input.PageSize;

        TaskItemStatus? statusEnum = null;
        if (!string.IsNullOrWhiteSpace(input.Status))
        {
            if (!Enum.TryParse<TaskItemStatus>(input.Status, true, out var parsed))
                throw new ArgumentException($"Invalid status '{input.Status}'. Allowed values: ToDo, InProgress, Done.");
            statusEnum = parsed;
        }

        var (tasks, totalCount) = await _unitOfWork.Tasks.GetPagedTasksAsync(null, statusEnum, pageNumber, pageSize);
        var dtos = tasks.Select(Map).ToList();
        var pagedResult = new PagedResult<TaskDto>(dtos, totalCount, pageNumber, pageSize);
        return Result<PagedResult<TaskDto>>.Success(pagedResult, "Tasks retrieved successfully.");
    }

    public async Task<Result<TaskDto>> GetByIdAsync(Guid id)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(id)
            ?? throw new NotFoundException($"Task with id '{id}' was not found.");
        return Result<TaskDto>.Success(Map(task), "Task detail retrieved successfully.");
    }

    public async Task<Result<PagedResult<TaskDto>>> GetByProjectAsync(Guid projectId, GetTasksInputDto input)
    {
        var project = await _unitOfWork.Projects.GetByIdAsync(projectId)
            ?? throw new NotFoundException($"Project with id '{projectId}' was not found.");

        var pageNumber = input.PageNumber < 1 ? 1 : input.PageNumber;
        var pageSize = input.PageSize < 1 ? 6 : input.PageSize;

        TaskItemStatus? statusEnum = null;
        if (!string.IsNullOrWhiteSpace(input.Status))
        {
            if (!Enum.TryParse<TaskItemStatus>(input.Status, true, out var parsed))
                throw new ArgumentException($"Invalid status '{input.Status}'. Allowed values: ToDo, InProgress, Done.");
            statusEnum = parsed;
        }

        var (tasks, totalCount) = await _unitOfWork.Tasks.GetPagedTasksAsync(projectId, statusEnum, pageNumber, pageSize);
        var dtos = tasks.Select(Map).ToList();
        var pagedResult = new PagedResult<TaskDto>(dtos, totalCount, pageNumber, pageSize);
        return Result<PagedResult<TaskDto>>.Success(pagedResult, "Project tasks retrieved successfully.");
    }

    public async Task<Result<TaskDto>> CreateAsync(CreateTaskDto dto)
    {
        if (!Enum.TryParse<TaskItemStatus>(dto.Status, true, out var statusEnum))
            throw new ArgumentException($"Invalid status '{dto.Status}'. Allowed values: ToDo, InProgress, Done.");

        var project = await _unitOfWork.Projects.GetByIdAsync(dto.ProjectId)
            ?? throw new NotFoundException($"Project with id '{dto.ProjectId}' was not found.");

        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Status = statusEnum,
            DueDate = dto.DueDate,
            ProjectId = dto.ProjectId,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Tasks.AddAsync(task);
        await _unitOfWork.SaveChangesAsync();

        return Result<TaskDto>.Success(Map(task), "Task created successfully.");
    }

    public async Task<Result> UpdateAsync(Guid id, UpdateTaskDto dto)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(id)
            ?? throw new NotFoundException($"Task with id '{id}' was not found.");

        if (!Enum.TryParse<TaskItemStatus>(dto.Status, true, out var statusEnum))
            throw new ArgumentException($"Invalid status '{dto.Status}'. Allowed values: ToDo, InProgress, Done.");

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Status = statusEnum;
        task.DueDate = dto.DueDate;

        _unitOfWork.Tasks.Update(task);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success("Task updated successfully.");
    }

    public async Task<Result> UpdateStatusAsync(Guid id, UpdateTaskStatusDto dto)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(id)
            ?? throw new NotFoundException($"Task with id '{id}' was not found.");

        if (!Enum.TryParse<TaskItemStatus>(dto.Status, true, out var statusEnum))
            throw new ArgumentException($"Invalid status '{dto.Status}'. Allowed values: ToDo, InProgress, Done.");

        task.Status = statusEnum;
        _unitOfWork.Tasks.Update(task);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success("Task status updated successfully.");
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(id)
            ?? throw new NotFoundException($"Task with id '{id}' was not found.");

        _unitOfWork.Tasks.Delete(task);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success("Task deleted successfully.");
    }

    private static TaskDto Map(TaskItem t) =>
        new(t.Id, t.Title, t.Description, t.Status.ToString(), t.DueDate, t.ProjectId);
}
