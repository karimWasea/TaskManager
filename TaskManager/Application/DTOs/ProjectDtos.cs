namespace TaskManager.Application.DTOs;

public record ProjectDto(Guid Id, string Name, string Description, DateTime CreatedAt, int TaskCount);
public record ProjectDetailDto(Guid Id, string Name, string Description, DateTime CreatedAt, IEnumerable<TaskDto> Tasks);
public record CreateProjectDto(string Name, string Description);
public record UpdateProjectDto(string Name, string Description);
