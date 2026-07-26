using TaskManager.Domain.Enums;

namespace TaskManager.Domain.Entities;

public class TaskItem : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TaskItemStatus Status { get; set; } = TaskItemStatus.ToDo;
    public DateTime? DueDate { get; set; }
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
}
