using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;

namespace TaskManager.Domain.Interfaces;

public interface ITaskRepository : IRepository<TaskItem>
{
    Task<IReadOnlyList<TaskItem>> GetTasksByProjectIdAsync(Guid projectId);
    Task<IReadOnlyList<TaskItem>> GetTasksByStatusAsync(TaskItemStatus status);
    Task<IReadOnlyList<TaskItem>> GetByProjectIdAndStatusAsync(Guid projectId, TaskItemStatus status);
    Task<(IReadOnlyList<TaskItem> Items, int TotalCount)> GetPagedTasksAsync(Guid? projectId, TaskItemStatus? status, int pageNumber, int pageSize);
}
