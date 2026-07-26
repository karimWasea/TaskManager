namespace TaskManager.Application.DTOs;

public class PagedRequestDto
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 6;
    public string? Sorting { get; set; }
}

public class GetProjectsInputDto : PagedRequestDto
{
    public string? Search { get; set; }
}

public class GetTasksInputDto : PagedRequestDto
{
    public string? Status { get; set; }
}
