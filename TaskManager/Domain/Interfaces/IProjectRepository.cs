using TaskManager.Domain.Entities;

namespace TaskManager.Domain.Interfaces;

public interface IProjectRepository : IRepository<Project>
{
    Task<Project?> GetProjectWithTasksAsync(Guid id);
    Task<IReadOnlyList<Project>> ListAllWithTasksAsync();
    Task<(IReadOnlyList<Project> Items, int TotalCount)> GetPagedProjectsAsync(int pageNumber, int pageSize, string? searchTerm);
}
