using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interfaces;

namespace TaskManager.Infrastructure.Persistence.Repositories;

public class ProjectRepository : Repository<Project>, IProjectRepository
{
    public ProjectRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Project?> GetProjectWithTasksAsync(Guid id) =>
        await Context.Projects.AsNoTracking().Include(p => p.Tasks).FirstOrDefaultAsync(p => p.Id == id);

    public async Task<IReadOnlyList<Project>> ListAllWithTasksAsync() =>
        await Context.Projects.AsNoTracking().Include(p => p.Tasks).ToListAsync();

    public async Task<(IReadOnlyList<Project> Items, int TotalCount)> GetPagedProjectsAsync(int pageNumber, int pageSize, string? searchTerm)
    {
        var query = Context.Projects.AsNoTracking().Include(p => p.Tasks).AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(term) || p.Description.ToLower().Contains(term));
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
