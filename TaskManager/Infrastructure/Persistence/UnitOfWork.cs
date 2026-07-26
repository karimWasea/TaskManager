using TaskManager.Domain.Interfaces;
using TaskManager.Infrastructure.Persistence.Repositories;

namespace TaskManager.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IProjectRepository? _projectRepository;
    private ITaskRepository? _taskRepository;

    public UnitOfWork(ApplicationDbContext context) => _context = context;

    public IProjectRepository Projects =>
        _projectRepository ??= new ProjectRepository(_context);

    public ITaskRepository Tasks =>
        _taskRepository ??= new TaskRepository(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        await _context.SaveChangesAsync(cancellationToken);

    public void Dispose() => _context.Dispose();
}
