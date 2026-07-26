namespace TaskManager.Application.DTOs;

public class PagedRequestDto
{
    public const int DefaultMaxResultCount = 100;
    public const int DefaultPageSize = 6;

    private int _pageNumber = 1;
    private int _pageSize = DefaultPageSize;
    private int _maxResultCount = DefaultMaxResultCount;

    public int PageNumber
    {
        get => _pageNumber;
        set => _pageNumber = value < 1 ? 1 : value;
    }

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value < 1 ? DefaultPageSize : (value > _maxResultCount ? _maxResultCount : value);
    }

    public int MaxResultCount
    {
        get => _maxResultCount;
        set => _maxResultCount = value < 1 ? DefaultMaxResultCount : value;
    }

    public string? Sorting { get; set; }

    /// <summary>
    /// Computes the number of records to skip for EF Core Skip(SkipCount).
    /// </summary>
    public int SkipCount => (PageNumber - 1) * PageSize;
}

public class GetProjectsInputDto : PagedRequestDto
{
    public string? Search { get; set; }
}

public class GetTasksInputDto : PagedRequestDto
{
    public string? Status { get; set; }
}
