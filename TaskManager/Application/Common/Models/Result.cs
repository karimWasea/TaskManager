namespace TaskManager.Application.Common.Models;

public class Result<T>
{
    public bool IsSuccess { get; set; }
    public T? Data { get; set; }
    public string Message { get; set; } = string.Empty;
    public IDictionary<string, string[]>? Errors { get; set; }

    public static Result<T> Success(T data, string message = "Operation completed successfully.") =>
        new() { IsSuccess = true, Data = data, Message = message };

    public static Result<T> Failure(string message, IDictionary<string, string[]>? errors = null) =>
        new() { IsSuccess = false, Message = message, Errors = errors };
}

public class Result
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;
    public IDictionary<string, string[]>? Errors { get; set; }

    public static Result Success(string message = "Operation completed successfully.") =>
        new() { IsSuccess = true, Message = message };

    public static Result Failure(string message, IDictionary<string, string[]>? errors = null) =>
        new() { IsSuccess = false, Message = message, Errors = errors };
}
