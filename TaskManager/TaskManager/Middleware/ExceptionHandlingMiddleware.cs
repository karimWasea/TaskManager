using System.Net;
using System.Text.Json;
using TaskManager.Application.Common.Exceptions;

namespace TaskManager.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleAsync(context, ex);
        }
    }

    private async Task HandleAsync(HttpContext context, Exception ex)
    {
        _logger.LogError(ex, "Unhandled exception occurred: {Message}", ex.Message);

        var (statusCode, payload) = ex switch
        {
            ValidationException ve => (HttpStatusCode.BadRequest, (object)new
            {
                title = "Validation Failed",
                status = 400,
                errors = ve.Errors
            }),
            FluentValidation.ValidationException fve => (HttpStatusCode.BadRequest, new
            {
                title = "Validation Failed",
                status = 400,
                errors = fve.Errors.GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(x => x.ErrorMessage).ToArray())
            }),
            NotFoundException => (HttpStatusCode.NotFound, new
            {
                title = "Not Found",
                status = 404,
                detail = ex.Message
            }),
            ArgumentException => (HttpStatusCode.BadRequest, new
            {
                title = "Bad Request",
                status = 400,
                detail = ex.Message
            }),
            _ => (HttpStatusCode.InternalServerError, new
            {
                title = "Server Error",
                status = 500,
                detail = "An unexpected error occurred."
            })
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;
        await context.Response.WriteAsync(JsonSerializer.Serialize(payload,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
    }
}
