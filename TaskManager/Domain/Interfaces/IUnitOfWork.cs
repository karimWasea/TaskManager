namespace TaskManager.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IProjectRepository Projects { get; }
    ITaskRepository Tasks { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
