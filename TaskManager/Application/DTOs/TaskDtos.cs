namespace TaskManager.Application.DTOs;

public record TaskDto(Guid Id, string Title, string Description, string Status, DateTime? DueDate, Guid ProjectId);
public record CreateTaskDto(string Title, string Description, string Status, DateTime? DueDate, Guid ProjectId);
public record UpdateTaskDto(string Title, string Description, string Status, DateTime? DueDate);
public record UpdateTaskStatusDto(string Status);
