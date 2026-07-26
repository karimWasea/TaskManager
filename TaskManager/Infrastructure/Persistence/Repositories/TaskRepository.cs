using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;
using TaskManager.Domain.Interfaces;

namespace TaskManager.Infrastructure.Persistence.Repositories;

public class TaskRepository : Repository<TaskItem>, ITaskRepository
{
    public TaskRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IReadOnlyList<TaskItem>> GetTasksByProjectIdAsync(Guid projectId) =>
        await Context.Tasks.AsNoTracking().Where(t => t.ProjectId == projectId).ToListAsync();

    public async Task<IReadOnlyList<TaskItem>> GetTasksByStatusAsync(TaskItemStatus status) =>
        await Context.Tasks.AsNoTracking().Where(t => t.Status == status).ToListAsync();

    public async Task<IReadOnlyList<TaskItem>> GetByProjectIdAndStatusAsync(Guid projectId, TaskItemStatus status) =>
        await Context.Tasks.AsNoTracking()
            .Where(t => t.ProjectId == projectId && t.Status == status).ToListAsync();

    public async Task<(IReadOnlyList<TaskItem> Items, int TotalCount)> GetPagedTasksAsync(Guid? projectId, TaskItemStatus? status, int pageNumber, int pageSize)
    {
        var query = Context.Tasks.AsNoTracking().AsQueryable();

        if (projectId.HasValue && projectId.Value != Guid.Empty)
        {
            query = query.Where(t => t.ProjectId == projectId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
